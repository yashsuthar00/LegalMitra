import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import validator from 'validator';
import URL from 'url-parse';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// List of suspicious domains and patterns to avoid
const BLOCKED_DOMAINS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', // URL shorteners
  'localhost', '127.0.0.1', '0.0.0.0', // Local addresses
];

const MALICIOUS_PATTERNS = [
  /malware/i, /virus/i, /phishing/i, /spam/i, /scam/i,
  /download\s+now/i, /click\s+here/i, /free\s+money/i
];

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Validate input
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid URL to analyze' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const cleanUrl = url.trim();

    // Basic URL validation
    if (!validator.isURL(cleanUrl, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    })) {
      return NextResponse.json(
        { error: 'Please provide a valid HTTP or HTTPS URL' },
        { status: 400 }
      );
    }

    // Parse URL for additional security checks
    const parsedUrl = new URL(cleanUrl);
    
    // Check for blocked domains
    const domain = parsedUrl.hostname.toLowerCase();
    if (BLOCKED_DOMAINS.some(blocked => domain.includes(blocked))) {
      return NextResponse.json(
        { error: 'This domain is not allowed for security reasons' },
        { status: 400 }
      );
    }

    // Check for suspicious patterns in URL
    if (MALICIOUS_PATTERNS.some(pattern => pattern.test(cleanUrl))) {
      return NextResponse.json(
        { error: 'This URL appears suspicious and cannot be analyzed' },
        { status: 400 }
      );
    }

    let scrapedContent;
    let pageTitle = '';
    let pageDescription = '';

    try {
      // Fetch the webpage with security headers and timeout
      const response = await axios.get(cleanUrl, {
        timeout: 10000, // 10 second timeout
        maxRedirects: 3,
        headers: {
          'User-Agent': 'LegalMitra-Bot/1.0 (Legal Document Analyzer)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        maxContentLength: 5 * 1024 * 1024, // 5MB limit
      });

      // Check content type
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
        return NextResponse.json(
          { error: 'This URL does not contain readable text content' },
          { status: 400 }
        );
      }

      // Parse HTML content
      const $ = cheerio.load(response.data);
      
      // Get page title and description
      pageTitle = $('title').text().trim() || '';
      pageDescription = $('meta[name="description"]').attr('content') || 
                      $('meta[property="og:description"]').attr('content') || '';

      // Remove script, style, and other non-content elements
      $('script, style, nav, header, footer, aside, .advertisement, .ads, .social-media').remove();
      
      // Extract main content
      let mainContent = '';
      
      // Try to find main content areas
      const contentSelectors = [
        'main', '[role="main"]', '.main-content', '.content', '.post-content',
        '.article-content', '.entry-content', '.page-content', '.terms', '.privacy-policy',
        '.legal', '.agreement', '.contract', '.policy', 'article', '.document'
      ];
      
      for (const selector of contentSelectors) {
        const content = $(selector).text().trim();
        if (content && content.length > mainContent.length) {
          mainContent = content;
        }
      }
      
      // Fallback to body content if no main content found
      if (!mainContent || mainContent.length < 100) {
        mainContent = $('body').text().trim();
      }
      
      // Clean up the text
      scrapedContent = mainContent
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .trim();
      
      console.log(`Scraped content length: ${scrapedContent.length} characters`);
      // Check if we got meaningful content
      if (!scrapedContent || scrapedContent.length < 50) {
        return NextResponse.json(
          { error: 'Could not extract sufficient text content from this URL' },
          { status: 400 }
        );
      }

      // Limit content length for processing
      if (scrapedContent.length > 50000) {
        scrapedContent = scrapedContent.substring(0, 50000) + '... [Content truncated for analysis]';
      }

    } catch (fetchError) {
      console.error('Error fetching URL:', fetchError);
      
      if (fetchError.code === 'ENOTFOUND') {
        return NextResponse.json(
          { error: 'URL not found. Please check the URL and try again.' },
          { status: 400 }
        );
      } else if (fetchError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Connection refused. The website may be down or blocking requests.' },
          { status: 400 }
        );
      } else if (fetchError.response?.status === 403) {
        return NextResponse.json(
          { error: 'Access forbidden. The website is blocking our analysis tool.' },
          { status: 400 }
        );
      } else if (fetchError.response?.status === 404) {
        return NextResponse.json(
          { error: 'Page not found (404). Please check the URL.' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: 'Failed to fetch the webpage. Please try again or check if the URL is accessible.' },
          { status: 400 }
        );
      }
    }

    // First, check if the content is legal-related using AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const contentValidationPrompt = `
You are a strict legal document classifier. Your job is to determine if content is actually a legal document or legal agreement.

Analyze this content and determine if it contains actual legal terms, agreements, policies, or contracts:

Content Title: "${pageTitle}"
Content Description: "${pageDescription}"
Content Sample: "${scrapedContent.substring(0, 2000)}"

STRICT CRITERIA FOR LEGAL CONTENT:
✅ LEGAL content must contain:
- Terms of Service, Privacy Policy, User Agreement, EULA
- Rental agreements, Employment contracts, Service contracts
- Legal notices, Disclaimers, License agreements, Terms and Conditions
- Court documents, Legal forms, Compliance documents
- Cookie policies, Data processing agreements
- Software licenses, Terms of Use

❌ NOT LEGAL content includes:
- News articles, Blog posts, Product descriptions, Marketing pages
- Social media posts, Personal websites, Entertainment content
- Technical documentation, Help pages, FAQs
- Company about pages, Contact pages, General website content
- Product catalogs, Shopping pages, General informational content

IMPORTANT: Only respond with exactly "LEGAL" if the content clearly contains binding legal terms, agreements, or policies that users would need to accept or be bound by. If you have ANY doubt or if it's just general website content, respond with "NOT_LEGAL".

Response (LEGAL or NOT_LEGAL):`;

    try {
      const validationResult = await model.generateContent(contentValidationPrompt);
      const validationResponse = await validationResult.response;
      const responseText = validationResponse.text().trim().toUpperCase();
      const isLegal = responseText.includes('LEGAL') && !responseText.includes('NOT_LEGAL');

      console.log('Content validation response:', responseText);

      if (!isLegal) {
        return NextResponse.json(
          { 
            error: 'This URL does not contain legal document content. Please provide a link to legal documents such as Terms of Service, Privacy Policy, User Agreement, or other legal contracts.',
            suggestion: 'Valid examples: Privacy policies, Terms of service, User agreements, Software licenses, Employment contracts, Rental agreements, or Legal disclaimers.'
          },
          { status: 400 }
        );
      }
    } catch (validationError) {
      console.error('Content validation error:', validationError);
      // Continue with analysis if validation fails, but add extra validation in main prompt
    }

    // Now analyze the legal content with enhanced validation
    const analysisPrompt = `
You are a legal document analysis AI assistant. IMPORTANT: You must first verify that the provided content is actually a legal document before proceeding with analysis.

Website URL: ${cleanUrl}
Page Title: ${pageTitle}
Page Description: ${pageDescription}

Content to Analyze:
"${scrapedContent}"

CRITICAL INSTRUCTION: Before analyzing, you must determine if this content is actually a legal document (Terms of Service, Privacy Policy, Contract, Agreement, etc.). 

If the content is NOT a legal document (like news articles, product descriptions, general website content, marketing material, etc.), you MUST respond with this exact JSON:
{
  "error": "NOT_LEGAL_CONTENT",
  "message": "This content does not appear to be a legal document. Please provide a URL containing Terms of Service, Privacy Policy, User Agreement, or other legal documents."
}

ONLY if the content IS clearly a legal document, provide analysis in this JSON format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "overallSummary": "A brief 2-3 sentence summary of the legal document",
  "keyFindings": [
    {
      "type": "FINANCIAL_RISK" | "LEGAL_OBLIGATION" | "PRIVACY_CONCERN" | "TERMINATION_CLAUSE" | "LIABILITY" | "OTHER",
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "title": "Brief title of the finding",
      "description": "Detailed explanation of what this means for the user",
      "recommendation": "What the user should do about this"
    }
  ],
  "redFlags": [
    "List of specific concerning clauses or terms that could be problematic"
  ],
  "positiveAspects": [
    "List of favorable terms or protections for the user"
  ],
  "simplifiedExplanation": "Explain the legal document in simple, everyday language that anyone can understand",
  "actionableAdvice": [
    "Specific steps the user should take before agreeing to these terms"
  ]
}

Focus on legal analysis of:
- Financial obligations and penalties
- Termination conditions and notice periods
- Liability and responsibility clauses
- Privacy and data usage terms
- Automatic renewals or extensions
- Dispute resolution mechanisms
- Any unusual or potentially unfair terms

DO NOT HALLUCINATE. If this is not a legal document, use the error response above.`;

    // Generate the analysis
    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const analysisText = response.text();

    // Try to parse JSON from the response
    let analysis;
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        
        // Check if AI detected non-legal content
        if (parsedResponse.error === "NOT_LEGAL_CONTENT") {
          return NextResponse.json(
            { 
              error: parsedResponse.message || 'This content does not appear to be a legal document. Please provide a URL containing Terms of Service, Privacy Policy, User Agreement, or other legal documents.',
              suggestion: 'Valid examples: Privacy policies, Terms of service, User agreements, Software licenses, Employment contracts, Rental agreements, or Legal disclaimers.'
            },
            { status: 400 }
          );
        }
        
        analysis = parsedResponse;
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Check if the raw response indicates non-legal content
      if (analysisText.toLowerCase().includes('not a legal document') || 
          analysisText.toLowerCase().includes('not legal content') ||
          analysisText.toLowerCase().includes('general website content')) {
        return NextResponse.json(
          { 
            error: 'This content does not appear to be a legal document. Please provide a URL containing Terms of Service, Privacy Policy, User Agreement, or other legal documents.',
            suggestion: 'Valid examples: Privacy policies, Terms of service, User agreements, Software licenses, Employment contracts, Rental agreements, or Legal disclaimers.'
          },
          { status: 400 }
        );
      }
      
      // If JSON parsing fails for other reasons, create structured response
      analysis = {
        riskLevel: 'MEDIUM',
        overallSummary: 'The AI analysis could not be properly parsed, but the document has been reviewed.',
        keyFindings: [
          {
            type: 'OTHER',
            severity: 'MEDIUM',
            title: 'Analysis Available',
            description: analysisText.substring(0, 500) + '...',
            recommendation: 'Please review the full analysis and consider consulting a legal professional.'
          }
        ],
        redFlags: ['Analysis parsing error - manual review recommended'],
        positiveAspects: [],
        simplifiedExplanation: analysisText.substring(0, 300) + '...',
        actionableAdvice: ['Consider getting professional legal advice for important documents']
      };
    }

    // Add metadata
    const responseData = {
      ...analysis,
      metadata: {
        sourceType: 'url',
        sourceUrl: cleanUrl,
        pageTitle,
        pageDescription,
        contentLength: scrapedContent.length,
        analyzedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp'
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error analyzing URL:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze the URL. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze URLs.' },
    { status: 405 }
  );
}
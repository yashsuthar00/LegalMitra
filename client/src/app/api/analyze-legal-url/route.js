import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import validator from 'validator';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Security configuration
const SECURITY_CONFIG = {
  maxContentLength: 500000, // 500KB limit
  maxRedirects: 3,
  timeout: 15000, // 15 seconds
  allowedDomains: [], // Empty means all domains allowed, but we'll validate content
  blockedDomains: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '192.168.',
    '10.',
    '172.',
    'malware',
    'phishing'
  ],
  allowedContentTypes: [
    'text/html',
    'text/plain',
    'application/json'
  ]
};

// Helper function to validate URL
function validateUrl(url) {
  try {
    // Check if it's a valid URL format
    if (!validator.isURL(url, { 
      protocols: ['http', 'https'],
      require_protocol: true 
    })) {
      return { valid: false, error: 'Invalid URL format' };
    }

    const urlObj = new URL(url);
    
    // Check for blocked domains
    const hostname = urlObj.hostname.toLowerCase();
    for (const blocked of SECURITY_CONFIG.blockedDomains) {
      if (hostname.includes(blocked)) {
        return { valid: false, error: 'Domain not allowed for security reasons' };
      }
    }
    
    // Check for private/local IP addresses
    if (hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|0\.0\.0\.0|localhost)$/)) {
      return { valid: false, error: 'Private/local URLs are not allowed' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL' };
  }
}

// Helper function to safely fetch content
async function fetchContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: SECURITY_CONFIG.timeout,
      maxRedirects: SECURITY_CONFIG.maxRedirects,
      maxContentLength: SECURITY_CONFIG.maxContentLength,
      headers: {
        'User-Agent': 'LegalMitra-Bot/1.0 (Legal Document Analyzer)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      validateStatus: (status) => status < 400,
    });

    // Validate content type
    const contentType = response.headers['content-type']?.toLowerCase() || '';
    const isValidContentType = SECURITY_CONFIG.allowedContentTypes.some(type => 
      contentType.includes(type)
    );
    
    if (!isValidContentType) {
      throw new Error('Content type not supported for analysis');
    }

    return {
      content: response.data,
      contentType,
      size: response.data.length,
      status: response.status
    };
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw new Error('Website not found. Please check the URL and try again.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Connection refused. The website may be down.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Request timed out. The website is taking too long to respond.');
    } else if (error.response?.status === 403) {
      throw new Error('Access forbidden. The website blocks automated requests.');
    } else if (error.response?.status === 404) {
      throw new Error('Page not found. Please check the URL.');
    } else if (error.response?.status >= 500) {
      throw new Error('The website is experiencing server issues. Please try again later.');
    }
    throw error;
  }
}

// Helper function to extract text content
function extractTextContent(html, url) {
  try {
    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .ad, .advertisement, .popup, .modal').remove();
    
    // Try to find main content areas
    const contentSelectors = [
      'main',
      '[role="main"]',
      '.main-content',
      '.content',
      '.legal-content',
      '.terms',
      '.privacy',
      '.policy',
      'article',
      '.document'
    ];
    
    let content = '';
    let title = $('title').text().trim();
    
    // Try content selectors first
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0 && element.text().trim().length > 100) {
        content = element.text().trim();
        break;
      }
    }
    
    // Fallback to body if no specific content area found
    if (!content || content.length < 100) {
      content = $('body').text().trim();
    }
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    return {
      content,
      title,
      length: content.length
    };
  } catch (error) {
    throw new Error('Failed to extract content from the webpage');
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate URL
    const validation = validateUrl(url.trim());
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API key is not configured' },
        { status: 500 }
      );
    }

    console.log(`Fetching content from: ${url}`);
    
    // Fetch and extract content
    const fetchResult = await fetchContent(url.trim());
    const extracted = extractTextContent(fetchResult.content, url);
    
    console.log(`Scraped content length: ${extracted.length} characters`);
    
    if (extracted.length < 100) {
      return NextResponse.json(
        { error: 'Not enough content found on the webpage to analyze' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // First, validate that this is actually legal content
    const contentValidationPrompt = `
You are a content validator. Analyze the following text and determine if it contains legal content that should be analyzed.

Content to validate:
"""
${extracted.content.substring(0, 3000)}
"""

Respond with EXACTLY one word:
- "LEGAL" if the content contains legal documents, terms of service, privacy policies, contracts, agreements, legal notices, or other legal text that regular people might need to understand
- "NOT_LEGAL" if the content is clearly not legal in nature (like news articles, blog posts, product pages, etc.)

Response:`;

    try {
      const validationResult = await model.generateContent(contentValidationPrompt);
      const validationResponse = await validationResult.response;
      const responseText = validationResponse.text().trim().toUpperCase();
      const isLegal = responseText.includes('LEGAL') && !responseText.includes('NOT_LEGAL');
      
      console.log('Content validation response:', responseText);
      
      if (!isLegal) {
        return NextResponse.json({
          error: 'Non-legal content detected',
          message: 'The URL you provided does not appear to contain legal documents or terms that can be analyzed. Please provide a URL to privacy policies, terms of service, contracts, or other legal documents.',
          suggestion: 'Try URLs like privacy policies, terms of service, user agreements, or legal contracts.'
        }, { status: 400 });
      }
    } catch (validationError) {
      console.error('Content validation error:', validationError);
      // If validation fails, we'll proceed but with a warning
    }

    // Main analysis prompt
    const analysisPrompt = `
You are a legal document analysis expert. Analyze the following legal document from a website and provide a comprehensive breakdown that helps ordinary people understand what they're agreeing to.

Website URL: ${url}
Page Title: ${extracted.title}
Content:
"""
${extracted.content}
"""

Please provide your analysis in the following JSON format:

{
  "overallSummary": "Brief 2-3 sentence summary of what this document is about",
  "riskLevel": "HIGH|MEDIUM|LOW",
  "simplifiedExplanation": "Plain English explanation of what this document means for the person agreeing to it",
  "keyFindings": [
    {
      "title": "Brief title of the finding",
      "description": "Detailed explanation of this clause or section",
      "type": "FINANCIAL_RISK|LEGAL_OBLIGATION|PRIVACY_CONCERN|TERMINATION_CLAUSE|LIABILITY|OTHER",
      "severity": "HIGH|MEDIUM|LOW",
      "recommendation": "What the person should do about this"
    }
  ],
  "redFlags": [
    "List of concerning clauses or terms that heavily favor one party"
  ],
  "positiveAspects": [
    "List of protective clauses or favorable terms"
  ],
  "actionableAdvice": [
    "Specific steps the person should take before agreeing"
  ],
  "metadata": {
    "sourceType": "url",
    "sourceUrl": "${url}",
    "pageTitle": "${extracted.title}",
    "contentLength": ${extracted.length},
    "analyzedAt": "${new Date().toISOString()}",
    "model": "gemini-2.0-flash-exp"
  }
}

Important guidelines:
- Focus on practical implications for ordinary people
- Highlight financial risks, hidden fees, and liability issues
- Explain legal jargon in simple terms
- Be thorough but concise
- Prioritize the most important issues
- Provide actionable recommendations
`;

    console.log('Sending analysis request to Gemini API...');
    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log('Raw Gemini response received');

    // Try to extract JSON from the response
    let analysisData;
    try {
      // Remove any markdown code block formatting
      const cleanText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      analysisData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini response:', parseError);
      
      // Return a formatted error response
      return NextResponse.json({
        error: 'Failed to parse AI response',
        details: 'The AI returned an invalid response format',
        rawResponse: analysisText.substring(0, 500) + '...'
      }, { status: 500 });
    }

    // Validate the response structure
    if (!analysisData.overallSummary || !analysisData.riskLevel) {
      return NextResponse.json({
        error: 'Invalid analysis format',
        details: 'The AI response is missing required fields'
      }, { status: 500 });
    }

    console.log('Analysis completed successfully');
    return NextResponse.json(analysisData);

  } catch (error) {
    console.error('Error in legal URL analysis:', error);
    
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key or API access issue' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze URL', details: error.message },
      { status: 500 }
    );
  }
}
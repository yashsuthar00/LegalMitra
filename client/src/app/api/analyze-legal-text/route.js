import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request) {
  try {
    // Parse the request body
    const { text } = await request.json();

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide valid text to analyze' },
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

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create a comprehensive prompt for legal document analysis
    const prompt = `
You are a legal document analysis AI assistant. Please analyze the following legal text and provide a comprehensive assessment focusing on potential risks, threats, and important clauses that users should be aware of.

Legal Text to Analyze:
"${text}"

Please provide your analysis in the following JSON format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "overallSummary": "A brief 2-3 sentence summary of the document",
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
  "simplifiedExplanation": "Explain the document in simple, everyday language that anyone can understand",
  "actionableAdvice": [
    "Specific steps the user should take before agreeing to these terms"
  ]
}

Focus particularly on:
- Financial obligations and penalties
- Termination conditions and notice periods
- Liability and responsibility clauses
- Privacy and data usage terms
- Automatic renewals or extensions
- Dispute resolution mechanisms
- Any unusual or potentially unfair terms

Provide clear, actionable advice that helps users make informed decisions.`;

    // Generate the analysis
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // Try to parse JSON from the response
    let analysis;
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
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
        textLength: text.length,
        analyzedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp'
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error analyzing legal text:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze the legal text. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze legal text.' },
    { status: 405 }
  );
}
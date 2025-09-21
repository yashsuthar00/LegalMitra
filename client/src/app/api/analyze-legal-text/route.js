import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters long' },
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
You are a legal document analysis expert. Analyze the following legal document and provide a comprehensive breakdown that helps ordinary people understand what they're agreeing to.

Document Text:
"""
${text}
"""

Please provide your analysis in the following JSON format:

{
  "overallSummary": "Brief 2-3 sentence summary of what this document is about",
  "riskLevel": "HIGH|MEDIUM|LOW",
  "simplifiedExplanation": "Plain English explanation of what this document means for the person signing it",
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
    "Specific steps the person should take before signing or agreeing"
  ],
  "metadata": {
    "documentType": "Type of legal document (contract, agreement, policy, etc.)",
    "analyzedAt": "${new Date().toISOString()}",
    "textLength": ${text.length},
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

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log('Raw Gemini response:', analysisText);

    // Try to extract JSON from the response
    let analysisData;
    try {
      // Remove any markdown code block formatting
      const cleanText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      analysisData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini response:', parseError);
      console.log('Response text:', analysisText);
      
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
    console.error('Error in legal text analysis:', error);
    
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
      { error: 'Failed to analyze document', details: error.message },
      { status: 500 }
    );
  }
}
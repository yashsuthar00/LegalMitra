# LegalMitra - AI-Powered Legal Document Analyzer

LegalMitra is an intelligent web application that helps users understand complex legal documents by providing AI-powered analysis, risk assessment, and plain-English explanations.

## Features

- **Text Analysis**: Paste any legal document text for instant AI analysis
- **Risk Assessment**: Get clear risk levels (LOW, MEDIUM, HIGH) for different aspects
- **Plain English Explanations**: Complex legal jargon translated into understandable language
- **Key Findings**: Detailed breakdown of important clauses and potential issues
- **Red Flags**: Highlighted concerning terms that could cause problems
- **Actionable Advice**: Step-by-step recommendations for what to do next
- **Sample Documents**: Test with pre-loaded sample rental agreements

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Google Cloud account with Gemini API access

### Installation

1. Clone the repository and navigate to the client folder:
```bash
cd legalmitra/client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the client directory:
```bash
# Google Gemini API Configuration
GOOGLE_API_KEY=your_actual_google_gemini_api_key_here

# Next.js Configuration  
NEXT_PUBLIC_APP_NAME=LegalMitra
```

4. Get your Google Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and replace `your_actual_google_gemini_api_key_here` in `.env.local`

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Input Legal Text**: Paste any legal document text into the text area
2. **Analyze**: Click "Analyze Document" to get AI-powered insights
3. **Review Results**: Read through the comprehensive analysis including:
   - Overall risk level
   - Simplified explanation
   - Key findings with severity levels
   - Red flags to watch out for
   - Positive aspects
   - Actionable next steps

## API Endpoints

### POST `/api/analyze-legal-text`

Analyzes legal document text using Google Gemini AI.

**Request Body:**
```json
{
  "text": "Your legal document text here..."
}
```

**Response:**
```json
{
  "riskLevel": "MEDIUM",
  "overallSummary": "Brief summary...",
  "keyFindings": [...],
  "redFlags": [...],
  "positiveAspects": [...],
  "simplifiedExplanation": "...",
  "actionableAdvice": [...],
  "metadata": {
    "textLength": 1234,
    "analyzedAt": "2025-01-21T...",
    "model": "gemini-2.0-flash-exp"
  }
}
```

## Future Enhancements

- [ ] PDF document upload and parsing
- [ ] URL analysis for online terms of service
- [ ] Document comparison features
- [ ] Export analysis reports
- [ ] User authentication and history
- [ ] Mobile app version

## Important Disclaimer

⚠️ **This tool provides general guidance only and does not constitute legal advice. For important legal matters, always consult with a qualified attorney who can provide personalized guidance based on your specific situation and applicable laws.**

## Contributing

This is a hackathon prototype. Contributions are welcome!

## License

MIT License - see LICENSE file for details.

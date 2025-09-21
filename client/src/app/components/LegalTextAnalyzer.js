'use client';

import { useState } from 'react';
import { AlertTriangle, FileText, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import AnalysisResults from './AnalysisResults';

export default function LegalTextAnalyzer() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some legal text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze-legal-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }

      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setAnalysis(null);
    setError(null);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Legal Document Analyzer
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="legalText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste your legal document text below:
            </label>
            <textarea
              id="legalText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your terms of service, contract, rental agreement, or any legal document here..."
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isAnalyzing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {text.length > 0 && (
                <span>{text.length} characters • Minimum 50 characters recommended</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClear}
                disabled={isAnalyzing || !text}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Document'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Analysis Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && <AnalysisResults analysis={analysis} />}

      {/* Sample Text for Testing */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          Try it with sample text
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          Click the button below to load a sample rental agreement for testing:
        </p>
        <button
          onClick={() => setText(sampleText)}
          disabled={isAnalyzing}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
        >
          Load Sample Rental Agreement
        </button>
      </div>
    </div>
  );
}

// Sample text for testing
const sampleText = `RENTAL AGREEMENT

This agreement is between Landlord ABC Properties and Tenant John Doe for the property located at 123 Main Street.

TERMS:
- Monthly rent: $2,500 due by the 1st of each month
- Late fee: $100 after 5 days
- Security deposit: $5,000 (non-refundable cleaning fee of $500)
- Lease term: 12 months with automatic renewal unless 60 days notice given
- Tenant is responsible for ALL repairs and maintenance regardless of cause
- Landlord may enter property at any time with 24-hour notice
- No pets allowed, violation results in immediate termination and $2,000 fine
- Tenant waives right to jury trial for any disputes
- Early termination fee: 3 months rent plus forfeiture of security deposit
- Rent increases of up to 15% annually are permitted
- Tenant responsible for landlord's legal fees in any dispute

By signing, tenant agrees to all terms and acknowledges reading and understanding this agreement.`;
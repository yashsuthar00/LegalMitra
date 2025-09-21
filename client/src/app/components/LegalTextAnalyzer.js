'use client';

import { useState } from 'react';
import { AlertTriangle, FileText, Loader2, CheckCircle, XCircle, Info, Link, Type, Globe } from 'lucide-react';
import AnalysisResults from './AnalysisResults';

export default function LegalTextAnalyzer() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'url'
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyzeText = async () => {
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

  const handleAnalyzeUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze-legal-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze URL');
      }

      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    if (activeTab === 'text') {
      handleAnalyzeText();
    } else {
      handleAnalyzeUrl();
    }
  };

  const handleClear = () => {
    setText('');
    setUrl('');
    setAnalysis(null);
    setError(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setAnalysis(null);
  };

  const canAnalyze = activeTab === 'text' ? text.trim().length > 0 : url.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Legal Document Analyzer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Analyze legal documents from text or web links using AI
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
          <button
            onClick={() => handleTabChange('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            <Type className="h-4 w-4" />
            Text Input
          </button>
          <button
            onClick={() => handleTabChange('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'url'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            <Globe className="h-4 w-4" />
            Website URL
          </button>
        </div>

        {/* Content Input */}
        <div className="space-y-6">
          {activeTab === 'text' ? (
            <div>
              <label htmlFor="legalText" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                📄 Paste your legal document text below:
              </label>
              <textarea
                id="legalText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your terms of service, contract, rental agreement, privacy policy, or any legal document here..."
                className="w-full h-72 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isAnalyzing}
              />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {text.length > 0 && (
                  <span>📊 {text.length} characters • Minimum 50 characters recommended</span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="legalUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                🔗 Enter the URL of a legal document or webpage:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="legalUrl"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/terms-of-service"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isAnalyzing}
                />
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Supported URLs:
                      </p>
                      <ul className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                        <li>• Privacy policies and terms of service</li>
                        <li>• Legal agreements and contracts</li>
                        <li>• User agreements and license terms</li>
                        <li>• Employment contracts and rental agreements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'text' && text.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ready to analyze
                </span>
              )}
              {activeTab === 'url' && url.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  URL ready for analysis
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClear}
                disabled={isAnalyzing || (!text && !url)}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !canAnalyze}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing {activeTab === 'text' ? 'Text' : 'URL'}...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Analyze {activeTab === 'text' ? 'Text' : 'URL'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Analysis Error</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              {error.includes('suggestion') && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  💡 {error.split('suggestion: ')[1]}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && <AnalysisResults analysis={analysis} />}

      {/* Sample Content for Testing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Text */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <Type className="h-5 w-5 text-blue-600" />
            Try Sample Text
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Test the analyzer with a sample rental agreement containing various concerning clauses:
          </p>
          <button
            onClick={() => {
              setActiveTab('text');
              setText(sampleText);
              setError(null);
              setAnalysis(null);
            }}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Load Sample Rental Agreement
          </button>
        </div>

        {/* Sample URLs */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Try Sample URLs
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Test with real privacy policies and terms of service:
          </p>
          <div className="space-y-2">
            {sampleUrls.map((sampleUrl, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab('url');
                  setUrl(sampleUrl.url);
                  setError(null);
                  setAnalysis(null);
                }}
                disabled={isAnalyzing}
                className="block w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded"
              >
                <Link className="h-3 w-3 inline mr-2" />
                {sampleUrl.name}
              </button>
            ))}
          </div>
        </div>
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

// Sample URLs for testing
const sampleUrls = [
  {
    name: "GitHub Terms of Service",
    url: "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"
  },
  {
    name: "Discord Privacy Policy",
    url: "https://discord.com/privacy"
  },
  {
    name: "Netflix Terms of Use",
    url: "https://help.netflix.com/legal/termsofuse"
  },
  {
    name: "Airbnb Terms of Service",
    url: "https://www.airbnb.com/terms"
  }
];
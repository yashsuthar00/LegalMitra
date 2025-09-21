'use client';

import { useState } from 'react';
import { AlertTriangle, FileText, Loader2, CheckCircle, XCircle, Info, Link, Type, Globe } from 'lucide-react';
import EnhancedAnalysisResults from './EnhancedAnalysisResults';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl">
            <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Legal Document Analyzer
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Analyze legal documents from text or web links using AI
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-2xl p-1.5 mb-8 max-w-md mx-auto sm:mx-0">
          <button
            onClick={() => handleTabChange('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'text'
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-lg transform scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-600/50'
            }`}
          >
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Text Input</span>
            <span className="sm:hidden">Text</span>
          </button>
          <button
            onClick={() => handleTabChange('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-lg transform scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-600/50'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Website URL</span>
            <span className="sm:hidden">URL</span>
          </button>
        </div>

        {/* Content Input */}
        <div className="space-y-6">
          {activeTab === 'text' ? (
            <div className="space-y-4">
              <label htmlFor="legalText" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                📄 Paste your legal document text below:
              </label>
              <textarea
                id="legalText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your terms of service, contract, rental agreement, privacy policy, or any legal document here..."
                className="w-full h-64 sm:h-80 p-4 sm:p-6 border-2 border-slate-200 dark:border-slate-600 rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:bg-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base leading-relaxed"
                disabled={isAnalyzing}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div className="text-slate-500 dark:text-slate-400">
                  {text.length > 0 && (
                    <span>📊 {text.length.toLocaleString()} characters • {Math.ceil(text.length / 1000)}K estimated tokens</span>
                  )}
                </div>
                <div className="text-slate-400 dark:text-slate-500 text-xs">
                  Minimum 50 characters recommended
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label htmlFor="legalUrl" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                🔗 Enter the URL of a legal document or webpage:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="legalUrl"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/terms-of-service"
                  className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 dark:bg-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base"
                  disabled={isAnalyzing}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                        Supported URLs:
                      </p>
                      <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                        <li>• Privacy policies and terms of service</li>
                        <li>• Legal agreements and contracts</li>
                        <li>• User agreements and license terms</li>
                        <li>• Employment contracts and rental agreements</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Sample URLs */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-4 sm:p-6 border border-indigo-200 dark:border-indigo-800">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Try Sample URLs
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
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
                        className="block w-full text-left text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium disabled:opacity-50 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-3 rounded-lg"
                      >
                        <Link className="h-3 w-3 inline mr-2" />
                        {sampleUrl.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-600">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {activeTab === 'text' && text.length > 0 && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Ready to analyze
                </span>
              )}
              {activeTab === 'url' && url.length > 0 && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  URL ready to analyze
                </span>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleClear}
                disabled={isAnalyzing}
                className="flex-1 sm:flex-none px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Clear
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Analyze Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
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
      {analysis && <EnhancedAnalysisResults analysis={analysis} />}

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
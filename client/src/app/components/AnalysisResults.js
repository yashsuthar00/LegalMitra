'use client';

import { AlertTriangle, CheckCircle, XCircle, Shield, Eye, DollarSign, FileX, Scale, Clock } from 'lucide-react';

export default function AnalysisResults({ analysis }) {
  if (!analysis) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'HIGH': return <XCircle className="h-6 w-6" />;
      case 'MEDIUM': return <AlertTriangle className="h-6 w-6" />;
      case 'LOW': return <CheckCircle className="h-6 w-6" />;
      default: return <Shield className="h-6 w-6" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'FINANCIAL_RISK': return <DollarSign className="h-5 w-5" />;
      case 'LEGAL_OBLIGATION': return <Scale className="h-5 w-5" />;
      case 'PRIVACY_CONCERN': return <Eye className="h-5 w-5" />;
      case 'TERMINATION_CLAUSE': return <FileX className="h-5 w-5" />;
      case 'LIABILITY': return <Shield className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Overall Risk Assessment */}
      <div className={`p-6 rounded-xl border-2 ${getRiskColor(analysis.riskLevel)}`}>
        <div className="flex items-center gap-4 mb-4">
          {getRiskIcon(analysis.riskLevel)}
          <div>
            <h2 className="text-2xl font-bold">
              Overall Risk Level: {analysis.riskLevel}
            </h2>
            <p className="text-lg opacity-90">
              {analysis.overallSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Simplified Explanation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          What This Document Means in Simple Terms
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {analysis.simplifiedExplanation}
        </p>
      </div>

      {/* Key Findings */}
      {analysis.keyFindings && analysis.keyFindings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Key Findings
          </h3>
          <div className="space-y-4">
            {analysis.keyFindings.map((finding, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(finding.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {finding.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(finding.severity)}`}>
                        {finding.severity} RISK
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {finding.description}
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                        💡 Recommendation: {finding.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      {analysis.redFlags && analysis.redFlags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            🚩 Red Flags - Pay Special Attention
          </h3>
          <ul className="space-y-2">
            {analysis.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-800 dark:text-red-200">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Positive Aspects */}
      {analysis.positiveAspects && analysis.positiveAspects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            ✅ Positive Aspects
          </h3>
          <ul className="space-y-2">
            {analysis.positiveAspects.map((aspect, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-800 dark:text-green-200">{aspect}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actionable Advice */}
      {analysis.actionableAdvice && analysis.actionableAdvice.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            📋 What You Should Do Next
          </h3>
          <ol className="space-y-3">
            {analysis.actionableAdvice.map((advice, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-blue-800 dark:text-blue-200">{advice}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Analysis Metadata */}
      {analysis.metadata && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis Details</h4>
          <div className="text-xs text-gray-500 dark:text-gray-400 grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>📄 Text Length: {analysis.metadata.textLength} characters</div>
            <div>🤖 Model: {analysis.metadata.model}</div>
            <div>⏰ Analyzed: {new Date(analysis.metadata.analyzedAt).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Important Legal Disclaimer
            </h4>
            <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
              This AI analysis is for informational purposes only and does not constitute legal advice. 
              For important legal matters, always consult with a qualified attorney who can provide 
              personalized guidance based on your specific situation and applicable laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
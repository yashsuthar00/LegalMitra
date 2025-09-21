'use client';

import { useState } from 'react';
import LegalTextAnalyzer from './components/LegalTextAnalyzer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6">
              <span className="text-blue-600 drop-shadow-sm">Legal</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mitra</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-6"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Demystify complex legal documents with AI-powered analysis. 
            Get clear insights about risks, obligations, and important clauses in plain English.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              AI-Powered Analysis
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Text & URL Support
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Risk Assessment
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <LegalTextAnalyzer />
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 dark:text-gray-400">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <span className="text-amber-600 text-lg">⚠️</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Important Legal Disclaimer</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              This tool provides general guidance only and does not constitute legal advice. 
              For important legal matters, please consult a qualified attorney who can provide 
              personalized guidance based on your specific situation and applicable laws.
            </p>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <p className="text-sm">
                Built with Next.js and Google Gemini AI • © 2025 LegalMitra • 
                <span className="inline-flex items-center gap-1 ml-1">
                  Made for the Google AI Hackathon
                  <span className="text-blue-600">🚀</span>
                </span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
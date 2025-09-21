'use client';

import { useState } from 'react';
import LegalTextAnalyzer from './components/LegalTextAnalyzer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            <span className="text-blue-600">Legal</span>Mitra
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Demystify complex legal documents with AI-powered analysis. 
            Get clear insights about risks, obligations, and important clauses in plain English.
          </p>
        </header>

        {/* Main Content */}
        <main>
          <LegalTextAnalyzer />
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="mb-4">
            ⚠️ This tool provides general guidance only. For important legal matters, please consult a qualified attorney.
          </p>
          <p className="text-sm">
            Built with Next.js and Google Gemini AI • © 2025 LegalMitra
          </p>
        </footer>
      </div>
    </div>
  );
}
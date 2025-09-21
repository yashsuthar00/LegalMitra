'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Eye, 
  DollarSign, 
  FileX, 
  Scale, 
  Clock,
  TrendingUp,
  PieChart,
  BarChart3,
  Activity,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  BookOpen,
  Lightbulb,
  Info
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function EnhancedAnalysisResults({ analysis }) {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    findings: true,
    redFlags: true,
    positive: true,
    advice: true
  });

  if (!analysis) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return { 
        bg: 'bg-red-50 dark:bg-red-950/50', 
        border: 'border-red-300 dark:border-red-700', 
        text: 'text-red-700 dark:text-red-300',
        accent: 'bg-red-100 dark:bg-red-900/30'
      };
      case 'MEDIUM': return { 
        bg: 'bg-amber-50 dark:bg-amber-950/50', 
        border: 'border-amber-300 dark:border-amber-700', 
        text: 'text-amber-700 dark:text-amber-300',
        accent: 'bg-amber-100 dark:bg-amber-900/30'
      };
      case 'LOW': return { 
        bg: 'bg-emerald-50 dark:bg-emerald-950/50', 
        border: 'border-emerald-300 dark:border-emerald-700', 
        text: 'text-emerald-700 dark:text-emerald-300',
        accent: 'bg-emerald-100 dark:bg-emerald-900/30'
      };
      default: return { 
        bg: 'bg-slate-50 dark:bg-slate-900/50', 
        border: 'border-slate-300 dark:border-slate-600', 
        text: 'text-slate-700 dark:text-slate-300',
        accent: 'bg-slate-100 dark:bg-slate-800/50'
      };
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'HIGH': return <XCircle className="h-8 w-8" />;
      case 'MEDIUM': return <AlertTriangle className="h-8 w-8" />;
      case 'LOW': return <CheckCircle className="h-8 w-8" />;
      default: return <Shield className="h-8 w-8" />;
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
      case 'HIGH': return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'MEDIUM': return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700';
      case 'LOW': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600';
    }
  };

  // Prepare data for charts
  const riskLevelValue = analysis.riskLevel === 'HIGH' ? 85 : analysis.riskLevel === 'MEDIUM' ? 55 : 25;
  
  // Risk Assessment Doughnut Chart
  const riskData = {
    labels: ['Risk Level', 'Safe Level'],
    datasets: [
      {
        data: [riskLevelValue, 100 - riskLevelValue],
        backgroundColor: [
          analysis.riskLevel === 'HIGH' ? '#DC2626' : 
          analysis.riskLevel === 'MEDIUM' ? '#D97706' : '#059669',
          '#E5E7EB'
        ],
        borderColor: [
          analysis.riskLevel === 'HIGH' ? '#B91C1C' : 
          analysis.riskLevel === 'MEDIUM' ? '#B45309' : '#047857',
          '#D1D5DB'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Findings by Type Chart
  const findingsTypeData = analysis.keyFindings ? (() => {
    const typeCounts = {};
    analysis.keyFindings.forEach(finding => {
      typeCounts[finding.type] = (typeCounts[finding.type] || 0) + 1;
    });
    
    return {
      labels: Object.keys(typeCounts).map(type => 
        type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      ),
      datasets: [
        {
          label: 'Number of Issues',
          data: Object.values(typeCounts),
          backgroundColor: [
            '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#6B7280'
          ],
          borderColor: [
            '#2563EB', '#7C3AED', '#DC2626', '#D97706', '#059669', '#4B5563'
          ],
          borderWidth: 1,
        },
      ],
    };
  })() : null;

  // Severity Distribution Chart
  const severityData = analysis.keyFindings ? (() => {
    const severityCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    analysis.keyFindings.forEach(finding => {
      severityCounts[finding.severity] = (severityCounts[finding.severity] || 0) + 1;
    });
    
    return {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [
        {
          label: 'Number of Issues',
          data: [severityCounts.HIGH, severityCounts.MEDIUM, severityCounts.LOW],
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
          borderColor: ['#DC2626', '#D97706', '#059669'],
          borderWidth: 2,
        },
      ],
    };
  })() : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
    },
  };

  const riskGaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataIndex === 0) {
              return `Risk Level: ${analysis.riskLevel} (${riskLevelValue}%)`;
            }
            return null;
          }
        }
      }
    },
    cutout: '70%',
  };

  const AnimatedCard = ({ children, delay = 0, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoothness
      }}
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );

  const CollapsibleSection = ({ title, icon, isExpanded, onToggle, children, variant = "default" }) => {
    const variants = {
      default: "border-slate-200 dark:border-slate-700",
      danger: "border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30",
      success: "border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30",
      warning: "border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30",
      info: "border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30",
      primary: "border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30"
    };

    return (
      <motion.div 
        className={`border rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${variants[variant]}`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.button
          onClick={onToggle}
          className="w-full px-6 py-5 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: isExpanded ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-slate-600 dark:text-slate-400"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.button>
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.3 }
              }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ scrollBehavior: 'smooth' }}>
      {/* Risk Assessment Dashboard */}
      <AnimatedCard delay={0.1} className="border-l-4 border-l-indigo-500">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 rounded-xl">
              <Activity className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Risk Assessment Dashboard
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">Comprehensive analysis overview</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Risk Gauge */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <div className="text-center mb-6 w-full">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Overall Risk Level</h3>
                <div className="relative">
                  <div className="h-48 sm:h-56 lg:h-48">
                    <Doughnut data={riskData} options={riskGaugeOptions} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        {getRiskIcon(analysis.riskLevel)}
                      </motion.div>
                      <div className={`mt-3 text-2xl font-bold ${getRiskColor(analysis.riskLevel).text}`}>
                        {analysis.riskLevel}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{riskLevelValue}% Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Findings by Type */}
              {findingsTypeData && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <h4 className="text-md font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Issues by Category
                  </h4>
                  <div className="h-44 sm:h-48">
                    <Bar data={findingsTypeData} options={chartOptions} />
                  </div>
                </div>
              )}

              {/* Severity Distribution */}
              {severityData && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <h4 className="text-md font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Risk Severity
                  </h4>
                  <div className="h-44 sm:h-48">
                    <Doughnut data={severityData} options={chartOptions} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-4 rounded-xl border border-blue-200 dark:border-blue-800"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-blue-700 dark:text-blue-300 text-sm font-semibold">Total Issues</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {analysis.keyFindings ? analysis.keyFindings.length : 0}
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 p-4 rounded-xl border border-red-200 dark:border-red-800"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-red-700 dark:text-red-300 text-sm font-semibold">Red Flags</div>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                {analysis.redFlags ? analysis.redFlags.length : 0}
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold">Positive Aspects</div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {analysis.positiveAspects ? analysis.positiveAspects.length : 0}
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-4 rounded-xl border border-purple-200 dark:border-purple-800"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-purple-700 dark:text-purple-300 text-sm font-semibold">Action Items</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {analysis.actionableAdvice ? analysis.actionableAdvice.length : 0}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedCard>

      {/* Overall Summary */}
      <AnimatedCard delay={0.2} className="border-l-4 border-l-purple-500">
        <div className={`p-6 sm:p-8 ${getRiskColor(analysis.riskLevel).bg} border-l-4 ${getRiskColor(analysis.riskLevel).border}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <motion.div 
              className={`p-4 rounded-2xl ${getRiskColor(analysis.riskLevel).accent}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className={getRiskColor(analysis.riskLevel).text}>
                {getRiskIcon(analysis.riskLevel)}
              </div>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Overall Risk Level: <span className={getRiskColor(analysis.riskLevel).text}>{analysis.riskLevel}</span>
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysis.overallSummary}
              </p>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Simplified Explanation */}
      <AnimatedCard delay={0.3} className="border-l-4 border-l-cyan-500">
        <CollapsibleSection
          title="📖 What This Document Means in Simple Terms"
          icon={<BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />}
          isExpanded={expandedSections.overview}
          onToggle={() => toggleSection('overview')}
          variant="info"
        >
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-xl border border-cyan-200 dark:border-cyan-800">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              {analysis.simplifiedExplanation}
            </p>
          </div>
        </CollapsibleSection>
      </AnimatedCard>

      {/* Key Findings */}
      {analysis.keyFindings && analysis.keyFindings.length > 0 && (
        <AnimatedCard delay={0.4} className="border-l-4 border-l-orange-500">
          <CollapsibleSection
            title="🔍 Key Findings & Analysis"
            icon={<Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            isExpanded={expandedSections.findings}
            onToggle={() => toggleSection('findings')}
            variant="warning"
          >
            <div className="grid gap-6">
              {analysis.keyFindings.map((finding, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-700"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-xl">
                      {getTypeIcon(finding.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
                          {finding.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border w-fit ${getSeverityColor(finding.severity)}`}>
                          {finding.severity} RISK
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                        {finding.description}
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                          💡 <strong>Recommendation:</strong> {finding.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        </AnimatedCard>
      )}

      {/* Red Flags */}
      {analysis.redFlags && analysis.redFlags.length > 0 && (
        <AnimatedCard delay={0.5} className="border-l-4 border-l-red-500">
          <CollapsibleSection
            title="� Critical Red Flags - Immediate Attention Required"
            icon={<Zap className="h-6 w-6 text-red-600 dark:text-red-400" />}
            isExpanded={expandedSections.redFlags}
            onToggle={() => toggleSection('redFlags')}
            variant="danger"
          >
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="grid gap-4">
                {analysis.redFlags.map((flag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 group"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    >
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    </motion.div>
                    <span className="text-red-800 dark:text-red-200 font-medium flex-1 group-hover:text-red-900 dark:group-hover:text-red-100 transition-colors">{flag}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        </AnimatedCard>
      )}

      {/* Positive Aspects */}
      {analysis.positiveAspects && analysis.positiveAspects.length > 0 && (
        <AnimatedCard delay={0.6} className="border-l-4 border-l-emerald-500">
          <CollapsibleSection
            title="✨ Positive Aspects & Protections"
            icon={<CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            isExpanded={expandedSections.positive}
            onToggle={() => toggleSection('positive')}
            variant="success"
          >
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
              <div className="grid gap-4">
                {analysis.positiveAspects.map((aspect, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 group"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    </motion.div>
                    <span className="text-emerald-800 dark:text-emerald-200 font-medium flex-1 group-hover:text-emerald-900 dark:group-hover:text-emerald-100 transition-colors">{aspect}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        </AnimatedCard>
      )}

      {/* Actionable Advice */}
      {analysis.actionableAdvice && analysis.actionableAdvice.length > 0 && (
        <AnimatedCard delay={0.7} className="border-l-4 border-l-violet-500">
          <CollapsibleSection
            title="🎯 Your Action Plan - Next Steps"
            icon={<Lightbulb className="h-6 w-6 text-violet-600 dark:text-violet-400" />}
            isExpanded={expandedSections.advice}
            onToggle={() => toggleSection('advice')}
            variant="primary"
          >
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-6">
              <div className="space-y-4">
                {analysis.actionableAdvice.map((advice, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all duration-300 group hover:shadow-md"
                  >
                    <motion.span 
                      className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {index + 1}
                    </motion.span>
                    <span className="text-violet-800 dark:text-violet-200 font-medium flex-1 group-hover:text-violet-900 dark:group-hover:text-violet-100 transition-colors leading-relaxed">{advice}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        </AnimatedCard>
      )}

      {/* Analysis Metadata */}
      {analysis.metadata && (
        <AnimatedCard delay={0.8} className="border-l-4 border-l-slate-500">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-3 text-lg">
              <Info className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              Analysis Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <span className="text-2xl">📄</span>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Content Length:</span>
                  <div className="text-slate-600 dark:text-slate-400">{analysis.metadata.contentLength || analysis.metadata.textLength} characters</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <span className="text-2xl">🤖</span>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">AI Model:</span>
                  <div className="text-slate-600 dark:text-slate-400">{analysis.metadata.model}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <span className="text-2xl">⏰</span>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Analyzed:</span>
                  <div className="text-slate-600 dark:text-slate-400">{new Date(analysis.metadata.analyzedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
            {analysis.metadata.sourceType === 'url' && (
              <div className="border-t border-slate-200 dark:border-slate-600 pt-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600">
                    <span className="text-2xl">🔗</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-2">Source URL:</span>
                      <a 
                        href={analysis.metadata.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all text-sm transition-colors"
                      >
                        {analysis.metadata.sourceUrl}
                      </a>
                    </div>
                  </div>
                  {analysis.metadata.pageTitle && (
                    <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600">
                      <span className="text-2xl">📝</span>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">Page Title:</span>
                        <span className="text-slate-600 dark:text-slate-400">{analysis.metadata.pageTitle}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </AnimatedCard>
      )}

      {/* Disclaimer */}
      <AnimatedCard delay={0.9} className="border-l-4 border-l-amber-500">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
            </motion.div>
            <div>
              <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-3 text-lg">
                Important Legal Disclaimer
              </h4>
              <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                This AI analysis is for informational purposes only and does not constitute legal advice. 
                For important legal matters, always consult with a qualified attorney who can provide 
                personalized guidance based on your specific situation and applicable laws.
              </p>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
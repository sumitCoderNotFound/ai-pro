import { useState, useEffect } from 'react'
import { monitorApi } from '@/services/api'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Phone,
  Download,
  Loader2,
  RefreshCw,
  X,
  FileText,
  FileSpreadsheet
} from 'lucide-react'

const QualityAssurancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [stats, setStats] = useState({
    overall_score: 0,
    score_change: 0,
    total_reviewed: 0,
    passed: 0,
    failed: 0,
    flagged: 0
  })
  const [reviews, setReviews] = useState([])
  const [rules, setRules] = useState([])
  
  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState('csv')

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [statsRes, reviewsRes, rulesRes] = await Promise.all([
        monitorApi.getQAStats(selectedPeriod),
        monitorApi.getQAReviews(10),
        monitorApi.getQARules()
      ])
      setStats(statsRes)
      setReviews(reviewsRes.reviews || [])
      setRules(rulesRes.rules || [])
    } catch (err) {
      console.error('Failed to fetch QA data:', err)
      setError('Failed to load QA data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedPeriod])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const exportData = {
        generatedAt: new Date().toISOString(),
        timePeriod: selectedPeriod,
        stats: stats,
        reviews: reviews,
        rules: rules
      }
      
      let content, filename, type
      
      if (exportFormat === 'csv') {
        let csv = 'QA Report\n'
        csv += `Generated: ${new Date().toLocaleString()}\n`
        csv += `Time Period: ${selectedPeriod}\n\n`
        
        // Stats
        csv += 'Overview\n'
        csv += `Overall Score,${stats.overall_score}%\n`
        csv += `Score Change,${stats.score_change}%\n`
        csv += `Total Reviewed,${stats.total_reviewed}\n`
        csv += `Passed,${stats.passed}\n`
        csv += `Failed,${stats.failed}\n`
        csv += `Flagged,${stats.flagged}\n\n`
        
        // Reviews
        csv += 'Recent Reviews\n'
        csv += 'Agent,Conversation ID,Score,Status,Time\n'
        reviews.forEach(review => {
          csv += `${review.agent},${review.conversation_id},${review.score},${review.status},${review.time_ago}\n`
        })
        csv += '\n'
        
        // Rules
        csv += 'QA Rules\n'
        csv += 'Rule Name,Enabled,Pass Rate\n'
        rules.forEach(rule => {
          csv += `${rule.name},${rule.enabled ? 'Yes' : 'No'},${rule.pass_rate}%\n`
        })
        
        content = csv
        filename = `qa-report-${selectedPeriod}-${Date.now()}.csv`
        type = 'text/csv'
      } else {
        content = JSON.stringify(exportData, null, 2)
        filename = `qa-report-${selectedPeriod}-${Date.now()}.json`
        type = 'application/json'
      }
      
      const blob = new Blob([content], { type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setShowExportModal(false)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusBadge = (status) => {
    const styles = {
      passed: 'bg-green-100 text-green-700',
      flagged: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700'
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AI Quality Assurance</h1>
          <p className="text-neutral-600 text-sm">Monitor and improve your AI agent performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button
            onClick={fetchData}
            className="p-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchData} className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Score Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 col-span-2 lg:col-span-1">
          <div className="text-sm text-neutral-600 mb-2">Overall QA Score</div>
          <div className={`text-3xl font-bold ${getScoreColor(stats.overall_score)}`}>
            {stats.overall_score}%
          </div>
          <div className={`flex items-center gap-1 mt-2 text-sm ${stats.score_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.score_change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {stats.score_change >= 0 ? '+' : ''}{stats.score_change}% from last period
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Reviewed</span>
            <MessageSquare className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{stats.total_reviewed}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Passed</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Flagged</span>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.flagged}</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Failed</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Reviews</h2>
            <button className="text-sm text-primary-600 hover:underline">View All</button>
          </div>
          
          {reviews.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              No reviews available
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        review.type === 'voice' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {review.type === 'voice' ? (
                          <Phone className="w-5 h-5 text-green-600" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{review.agent}</p>
                        <p className="text-sm text-neutral-500">{review.conversation_id} • {review.time_ago}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-xl font-bold ${getScoreColor(review.score)}`}>
                        {review.score}
                      </div>
                      {getStatusBadge(review.status)}
                    </div>
                  </div>
                  
                  {review.issues && review.issues.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.issues.map((issue, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QA Rules */}
        <div className="bg-white rounded-2xl border border-neutral-200">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">QA Rules</h2>
            <button className="text-sm text-primary-600 hover:underline">Configure</button>
          </div>
          
          <div className="p-6 space-y-4">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-neutral-300'}`} />
                  <span className={`text-sm ${rule.enabled ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {rule.name}
                  </span>
                </div>
                {rule.enabled && (
                  <span className={`text-sm font-medium ${getScoreColor(rule.pass_rate)}`}>
                    {rule.pass_rate}%
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-neutral-100">
            <button className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 text-sm">
              Add New Rule
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">Improve Your QA Score</h3>
            <p className="text-neutral-600 text-sm">
              Based on recent reviews, consider updating your agent's response time settings and adding more specific guidelines for information accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">Export QA Report</h2>
              <button 
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-neutral-600">
                Export your QA report for the selected time period ({selectedPeriod}).
              </p>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      exportFormat === 'csv'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <FileSpreadsheet className={`w-8 h-8 ${exportFormat === 'csv' ? 'text-primary-600' : 'text-neutral-400'}`} />
                    <span className={`text-sm font-medium ${exportFormat === 'csv' ? 'text-primary-700' : 'text-neutral-600'}`}>
                      CSV
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      exportFormat === 'json'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <FileText className={`w-8 h-8 ${exportFormat === 'json' ? 'text-primary-600' : 'text-neutral-400'}`} />
                    <span className={`text-sm font-medium ${exportFormat === 'json' ? 'text-primary-700' : 'text-neutral-600'}`}>
                      JSON
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QualityAssurancePage
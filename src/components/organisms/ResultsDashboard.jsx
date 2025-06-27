import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { toast } from 'react-toastify'
import ValueCard from '@/components/molecules/ValueCard'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import assessmentService from '@/services/api/assessmentService'

const ResultsDashboard = () => {
  const [latestResults, setLatestResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLatestResults()
  }, [])

  const loadLatestResults = async () => {
    setLoading(true)
    setError(null)
    try {
      const assessments = await assessmentService.getRecent(1)
      if (assessments.length > 0) {
        setLatestResults(assessments[0])
      }
    } catch (err) {
      setError(err.message || 'Failed to load results')
      toast.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const shareResults = async () => {
    if (!latestResults) return

    const shareText = `My top values from Values Compass:
${latestResults.results.slice(0, 5).map((v, i) => `${i + 1}. ${v.name} (${v.score}/100)`).join('\n')}

Discover your values at Values Compass!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Values Assessment Results',
          text: shareText
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        toast.success('Results copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy results')
      }
    }
  }

  const downloadReport = () => {
    if (!latestResults) return
    
    // Mock PDF generation - in a real app, this would generate an actual PDF
    const reportData = {
      assessment: latestResults,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `values-assessment-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Report downloaded!')
  }

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        colors: {
          backgroundBarColors: ['#f1f5f9'],
          backgroundBarRadius: 8
        }
      }
    },
    colors: ['#4A6FA5'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        colors: ['#ffffff'],
        fontWeight: 600
      }
    },
    xaxis: {
      categories: latestResults?.results?.slice(0, 7).map(v => v.name) || [],
      max: 100,
      labels: {
        style: { colors: '#6b7280' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#6b7280' }
      }
    },
    grid: {
      show: false
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `${val}%`
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <SkeletonLoader variant="card" count={3} />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadLatestResults} />
  }

  if (!latestResults) {
    return (
      <EmptyState 
        title="No results yet"
        description="Complete an assessment to see your values profile"
        actionLabel="Take Assessment"
        onAction={() => window.location.href = '/assessment'}
        icon="BarChart3"
      />
    )
  }

  const topValues = latestResults.results || []
  const chartData = [{
    name: 'Score',
    data: topValues.slice(0, 7).map(v => v.score)
  }]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Text variant="h2" weight="bold" color="primary">
          Your Values Profile
        </Text>
        <Text variant="body" color="muted" className="max-w-2xl mx-auto">
          Based on your assessment, here are the values that matter most to you. 
          These insights can guide your decisions and help you live more authentically.
        </Text>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <Text variant="h4" weight="medium" className="mb-6">
            Values Strength Overview
          </Text>
          <div className="h-80">
            <Chart
              options={chartOptions}
              series={chartData}
              type="bar"
              height="100%"
            />
          </div>
        </Card>
      </motion.div>

      {/* Top Values Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <Text variant="h4" weight="medium">
          Your Top Values
        </Text>
        <div className="grid gap-4 md:grid-cols-2">
          {topValues.slice(0, 6).map((value, index) => (
            <motion.div
              key={value.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <ValueCard value={value} variant="elevated" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          variant="primary"
          icon="Share2"
          onClick={shareResults}
        >
          Share Results
        </Button>
        
        <Button
          variant="outline"
          icon="Download"
          onClick={downloadReport}
        >
          Download Report
        </Button>
        
        <Button
          variant="ghost"
          icon="RefreshCw"
          onClick={() => window.location.href = '/assessment'}
        >
          Retake Assessment
        </Button>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Text variant="body-sm" weight="bold" color="primary">💡</Text>
            </div>
            <div>
              <Text variant="h6" weight="medium" className="mb-2">
                What This Means
              </Text>
              <Text variant="body-sm" color="muted" className="leading-relaxed">
                Your top value, <strong>{topValues[0]?.name}</strong>, scores {topValues[0]?.score}/100. 
                This suggests it's a core driver in your decision-making. Consider how you can 
                better align your daily actions and long-term goals with this value to increase 
                life satisfaction and authenticity.
              </Text>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ResultsDashboard
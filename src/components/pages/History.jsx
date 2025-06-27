import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import AssessmentSummary from '@/components/molecules/AssessmentSummary'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import assessmentService from '@/services/api/assessmentService'

const History = () => {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await assessmentService.getAll()
      setAssessments(data)
    } catch (err) {
      setError(err.message || 'Failed to load assessment history')
      toast.error('Failed to load assessment history')
    } finally {
      setLoading(false)
    }
  }

  const handleViewAssessment = (assessment) => {
    // In a real app, this would navigate to a detailed results view
    console.log('View assessment:', assessment)
    toast.info('Viewing assessment results...')
  }

  const handleDeleteAssessment = async (assessment) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return
    }

    try {
      await assessmentService.delete(assessment.Id)
      setAssessments(prev => prev.filter(a => a.Id !== assessment.Id))
      toast.success('Assessment deleted successfully')
    } catch (err) {
      toast.error('Failed to delete assessment')
    }
  }

  const exportAllData = () => {
    const exportData = {
      assessments,
      exportedAt: new Date().toISOString(),
      totalAssessments: assessments.length
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `values-compass-history-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('History exported successfully!')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <SkeletonLoader variant="card" count={3} />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAssessments} />
  }

  if (assessments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <EmptyState 
          title="No assessments yet"
          description="Your completed assessments will appear here. Take your first assessment to get started!"
          actionLabel="Take Assessment"
          onAction={() => window.location.href = '/assessment'}
          icon="History"
        />
      </div>
    )
  }

  const completedAssessments = assessments.filter(a => a.completed)
  const inProgressAssessments = assessments.filter(a => !a.completed)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <div>
          <Text variant="h2" weight="bold" className="mb-2">
            Assessment History
          </Text>
          <Text variant="body" color="muted">
            Review your past assessments and track how your values have evolved
          </Text>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={exportAllData}
          >
            Export Data
          </Button>
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => window.location.href = '/assessment'}
          >
            New Assessment
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Text variant="h4" weight="bold" color="primary">
                {completedAssessments.length}
              </Text>
              <Text variant="caption" color="muted">
                Completed
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <Text variant="h4" weight="bold" color="warning">
                {inProgressAssessments.length}
              </Text>
              <Text variant="caption" color="muted">
                In Progress
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent" />
            </div>
            <div>
              <Text variant="h4" weight="bold" color="accent">
                {assessments.length > 0 
                  ? Math.round(assessments.reduce((sum, a) => sum + (a.results?.length || 0), 0) / assessments.length)
                  : 0
                }
              </Text>
              <Text variant="caption" color="muted">
                Avg Values
              </Text>
            </div>
          </div>
        </div>
      </motion.div>

      {/* In Progress Assessments */}
      {inProgressAssessments.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Text variant="h4" weight="medium">
            Continue Assessment
          </Text>
          <div className="space-y-4">
            {inProgressAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <AssessmentSummary
                  assessment={assessment}
                  onView={handleViewAssessment}
                  onDelete={handleDeleteAssessment}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Completed Assessments */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <Text variant="h4" weight="medium">
          Completed Assessments
        </Text>
        
        {completedAssessments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <ApperIcon name="CheckCircle" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <Text variant="body" color="muted">
              No completed assessments yet
            </Text>
          </div>
        ) : (
          <div className="space-y-4">
            {completedAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <AssessmentSummary
                  assessment={assessment}
                  onView={handleViewAssessment}
                  onDelete={handleDeleteAssessment}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}

export default History
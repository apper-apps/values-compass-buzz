import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import QuestionCard from '@/components/molecules/QuestionCard'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/atoms/ProgressBar'
import Text from '@/components/atoms/Text'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import questionService from '@/services/api/questionService'
import assessmentService from '@/services/api/assessmentService'

const AssessmentFlow = ({ framework = 'Personal Values Framework' }) => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const questionsData = await questionService.getAll()
      setQuestions(questionsData)
    } catch (err) {
      setError(err.message || 'Failed to load questions')
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        value: answer,
        timestamp: new Date().toISOString()
      }
    }))
  }

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      completeAssessment()
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const completeAssessment = async () => {
    setSaving(true)
    try {
      // Calculate mock results based on answers
      const results = calculateResults(answers)
      
      const assessmentData = {
        framework,
        answers: Object.values(answers),
        results,
        completed: true
      }

      await assessmentService.create(assessmentData)
      toast.success('Assessment completed successfully!')
      navigate('/results')
    } catch (err) {
      toast.error('Failed to save assessment')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const calculateResults = (answers) => {
    // Mock calculation logic - in a real app, this would be more sophisticated
    const valueScores = {
      'Growth': 0,
      'Integrity': 0,
      'Balance': 0,
      'Family': 0,
      'Independence': 0,
      'Compassion': 0,
      'Achievement': 0
    }

    // Simple scoring based on answer patterns
    Object.values(answers).forEach(answer => {
      if (typeof answer.value === 'string') {
        if (answer.value.includes('growth') || answer.value.includes('learning')) {
          valueScores['Growth'] += 15
        }
        if (answer.value.includes('honest') || answer.value.includes('integrity')) {
          valueScores['Integrity'] += 15
        }
        if (answer.value.includes('balance') || answer.value.includes('family')) {
          valueScores['Balance'] += 10
          valueScores['Family'] += 10
        }
        if (answer.value.includes('independent') || answer.value.includes('freedom')) {
          valueScores['Independence'] += 15
        }
        if (answer.value.includes('help') || answer.value.includes('others')) {
          valueScores['Compassion'] += 15
        }
        if (answer.value.includes('achieve') || answer.value.includes('success')) {
          valueScores['Achievement'] += 15
        }
      }
    })

    // Add some randomness for variety
    Object.keys(valueScores).forEach(key => {
      valueScores[key] += Math.floor(Math.random() * 30) + 50
    })

    // Convert to results format
    const results = Object.entries(valueScores)
      .map(([name, score], index) => ({
        Id: index + 1,
        name,
        description: getValueDescription(name),
        score: Math.min(100, Math.max(0, score)),
        rank: 0
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }))

    return results.slice(0, 7) // Return top 7 values
  }

  const getValueDescription = (name) => {
    const descriptions = {
      'Growth': 'Continuous learning, personal development, and expanding your capabilities',
      'Integrity': 'Acting with honesty, authenticity, and strong moral principles',
      'Balance': 'Maintaining harmony between different areas of life',
      'Family': 'Strong, loving relationships with family members',
      'Independence': 'Freedom to make your own choices and live authentically',
      'Compassion': 'Care and concern for others\' wellbeing and showing empathy',
      'Achievement': 'Setting and reaching meaningful goals and accomplishments'
    }
    return descriptions[name] || 'A core personal value that guides your decisions'
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <SkeletonLoader variant="question" count={1} />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadQuestions} />
  }

  if (questions.length === 0) {
    return (
      <ErrorState 
        message="No questions available for this assessment" 
        onRetry={loadQuestions} 
      />
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasAnswer = answers[currentQuestion.Id]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Text variant="body-sm" color="muted">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text variant="body-sm" color="primary" weight="medium">
            {Math.round(progress)}% Complete
          </Text>
        </div>
        <ProgressBar 
          progress={progress} 
          showPercentage={false}
          color="primary"
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.Id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            answer={answers[currentQuestion.Id]?.value}
            onAnswer={(answer) => handleAnswer(currentQuestion.Id, answer)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          icon="ChevronLeft"
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {currentQuestionIndex > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Skip question
                goToNext()
              }}
            >
              Skip
            </Button>
          )}

          <Button
            variant="primary"
            icon={isLastQuestion ? "Check" : "ChevronRight"}
            iconPosition="right"
            onClick={goToNext}
            disabled={!hasAnswer}
            loading={saving}
          >
            {saving ? 'Saving...' : isLastQuestion ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentFlow
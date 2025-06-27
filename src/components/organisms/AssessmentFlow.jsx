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
    // Enhanced calculation logic for standard elicitation methods
    const valueScores = {
      'Growth': 0,
      'Integrity': 0,
      'Balance': 0,
      'Family': 0,
      'Independence': 0,
      'Compassion': 0,
      'Achievement': 0,
      'Security': 0,
      'Creativity': 0,
      'Justice': 0
    }

    // Process different types of elicitation responses
    Object.values(answers).forEach(answer => {
      const value = answer.value

      // Handle standard elicitation (bucket sorting)
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check if it's bucket assignments
        if (value['Most Important']) {
          value['Most Important'].forEach(item => {
            Object.keys(valueScores).forEach(key => {
              if (item.toLowerCase().includes(key.toLowerCase()) || 
                  item.toLowerCase().includes('honesty') && key === 'Integrity' ||
                  item.toLowerCase().includes('helping') && key === 'Compassion' ||
                  item.toLowerCase().includes('success') && key === 'Achievement') {
                valueScores[key] += 25
              }
            })
          })
        }
        
        if (value['Moderately Important']) {
          value['Moderately Important'].forEach(item => {
            Object.keys(valueScores).forEach(key => {
              if (item.toLowerCase().includes(key.toLowerCase()) ||
                  item.toLowerCase().includes('honesty') && key === 'Integrity' ||
                  item.toLowerCase().includes('helping') && key === 'Compassion') {
                valueScores[key] += 15
              }
            })
          })
        }

        // Handle values sorting (category assignments)
        if (value['Essential']) {
          value['Essential'].forEach(item => {
            Object.keys(valueScores).forEach(key => {
              if (item.toLowerCase().includes(key.toLowerCase()) ||
                  item.toLowerCase().includes('principles') && key === 'Integrity') {
                valueScores[key] += 30
              }
            })
          })
        }

        if (value['Very Important']) {
          value['Very Important'].forEach(item => {
            Object.keys(valueScores).forEach(key => {
              if (item.toLowerCase().includes(key.toLowerCase())) {
                valueScores[key] += 20
              }
            })
          })
        }

        // Handle comparison results
        Object.values(value).forEach(choice => {
          if (typeof choice === 'string') {
            Object.keys(valueScores).forEach(key => {
              if (choice.toLowerCase().includes(key.toLowerCase()) ||
                  choice.toLowerCase().includes('growth') && key === 'Growth' ||
                  choice.toLowerCase().includes('security') && key === 'Security') {
                valueScores[key] += 12
              }
            })
          }
        })
      }

      // Handle string responses (single choice)
      if (typeof value === 'string') {
        Object.keys(valueScores).forEach(key => {
          if (value.toLowerCase().includes(key.toLowerCase()) ||
              value.includes('growth') || value.includes('learning') && key === 'Growth' ||
              value.includes('honest') || value.includes('integrity') && key === 'Integrity' ||
              value.includes('balance') || value.includes('family') && key === 'Balance' ||
              value.includes('independent') || value.includes('freedom') && key === 'Independence' ||
              value.includes('help') || value.includes('others') && key === 'Compassion' ||
              value.includes('achieve') || value.includes('success') && key === 'Achievement') {
            valueScores[key] += 15
          }
        })
      }

      // Handle rating scale responses
      if (typeof value === 'object' && typeof value[0] === 'number') {
        // This is a rating scale response
        Object.values(value).forEach((rating, index) => {
          if (rating >= 4) { // High ratings (4-5)
            Object.keys(valueScores).forEach(key => {
              if (index === 0 && key === 'Health') valueScores[key] += rating * 3
              if (index === 1 && key === 'Balance') valueScores[key] += rating * 3
              if (index === 2 && key === 'Growth') valueScores[key] += rating * 3
              if (index === 3 && key === 'Compassion') valueScores[key] += rating * 3
            })
          }
        })
      }
    })

    // Add baseline scores and some variance
    Object.keys(valueScores).forEach(key => {
      valueScores[key] += Math.floor(Math.random() * 25) + 40
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
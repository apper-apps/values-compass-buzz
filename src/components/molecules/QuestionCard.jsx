import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import ApperIcon from '@/components/ApperIcon'

const QuestionCard = ({ 
  question, 
  answer, 
  onAnswer, 
  className = '' 
}) => {
  const [selectedValue, setSelectedValue] = useState(answer || null)
  const [draggedItems, setDraggedItems] = useState(
    question.type === 'ranking' ? (answer || question.options) : []
  )

  const handleSingleChoice = (value) => {
    setSelectedValue(value)
    onAnswer(value)
  }

  const handleMultipleChoice = (value) => {
    const currentValues = selectedValue || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    setSelectedValue(newValues)
    onAnswer(newValues)
  }

  const handleSlider = (value) => {
    setSelectedValue(value)
    onAnswer(value)
  }

  const handleRanking = (newOrder) => {
    setDraggedItems(newOrder)
    setSelectedValue(newOrder)
    onAnswer(newOrder)
  }

  const moveItem = (fromIndex, toIndex) => {
    const newItems = [...draggedItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    handleRanking(newItems)
  }

  const renderInput = () => {
    switch (question.type) {
      case 'single-choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSingleChoice(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedValue === option
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedValue === option
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedValue === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = (selectedValue || []).includes(option)
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleMultipleChoice(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )

      case 'slider':
        return (
          <div className="space-y-4">
            <div className="px-2">
              <input
                type="range"
                min="0"
                max={question.options.length - 1}
                value={selectedValue || 0}
                onChange={(e) => handleSlider(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #4A6FA5 0%, #4A6FA5 ${(selectedValue || 0) * 100 / (question.options.length - 1)}%, #e5e7eb ${(selectedValue || 0) * 100 / (question.options.length - 1)}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              {question.options.map((label, index) => (
                <span 
                  key={index}
                  className={`${index === selectedValue ? 'text-primary font-medium' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
            {selectedValue !== null && (
              <div className="text-center">
                <Text variant="body-sm" color="primary" weight="medium">
                  {question.options[selectedValue]}
                </Text>
              </div>
            )}
          </div>
        )

      case 'ranking':
        return (
          <div className="space-y-2">
            <Text variant="body-sm" color="muted" className="mb-3">
              Drag to reorder from most important (top) to least important (bottom)
            </Text>
            {draggedItems.map((item, index) => (
              <motion.div
                key={item}
                layout
                className="flex items-center p-3 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:border-gray-300"
                whileHover={{ scale: 1.01 }}
                whileDrag={{ scale: 1.05, zIndex: 10 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(event, info) => {
                  const offset = info.offset.y
                  const itemHeight = 60 // Approximate height
                  const newIndex = Math.round(index + offset / itemHeight)
                  const clampedIndex = Math.max(0, Math.min(draggedItems.length - 1, newIndex))
                  
                  if (clampedIndex !== index) {
                    moveItem(index, clampedIndex)
                  }
                }}
              >
                <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-medium mr-3">
                  {index + 1}
                </div>
                <span className="flex-1 text-sm">{item}</span>
                <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}
          </div>
        )

      case 'rating-scale':
        return (
          <div className="space-y-4">
            {question.options.map((option, optionIndex) => {
              const currentRating = (selectedValue && selectedValue[optionIndex]) || 0
              return (
                <div key={optionIndex} className="space-y-2">
                  <Text variant="body-sm" weight="medium">{option}</Text>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const newRatings = { ...(selectedValue || {}) }
                          newRatings[optionIndex] = rating
                          setSelectedValue(newRatings)
                          onAnswer(newRatings)
                        }}
                        className={`w-8 h-8 rounded-full ${
                          rating <= currentRating
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {rating}
                      </motion.button>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {currentRating > 0 ? `${currentRating}/5` : 'Not rated'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )

      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <Text variant="body-sm" color="muted">
              Question type "{question.type}" not supported yet.
            </Text>
          </div>
        )
    }
  }

  return (
    <Card className={`p-6 ${className}`} hover={false}>
      <div className="space-y-6">
        <div>
          <Text variant="h4" weight="medium" className="mb-2">
            {question.text}
          </Text>
          {question.category && (
            <Text variant="caption" color="muted" className="uppercase tracking-wide">
              {question.category.replace('-', ' ')}
            </Text>
          )}
        </div>
        
        {renderInput()}
      </div>
    </Card>
  )
}

export default QuestionCard
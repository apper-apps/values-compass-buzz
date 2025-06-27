import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Text from '@/components/atoms/Text'
import ProgressBar from '@/components/atoms/ProgressBar'

const ValueCard = ({ 
  value, 
  showScore = true, 
  showRank = true,
  variant = 'default',
  className = '' 
}) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 70) return 'primary'
    if (score >= 50) return 'accent'
    return 'secondary'
  }

  const getRankColor = (rank) => {
    if (rank <= 2) return 'text-accent'
    if (rank <= 5) return 'text-primary'
    return 'text-gray-500'
  }

  return (
    <Card className={`p-6 ${className}`} variant={variant}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Text variant="h5" weight="semibold" className="mb-1">
              {value.name}
            </Text>
            {showRank && (
              <Text variant="caption" color="muted" className="uppercase tracking-wide">
                Rank #{value.rank}
              </Text>
            )}
          </div>
          
          {showScore && (
            <div className="flex items-center space-x-2">
              <Text 
                variant="h4" 
                weight="bold" 
                className={getRankColor(value.rank)}
              >
                {value.score}
              </Text>
              <Text variant="caption" color="muted">
                /100
              </Text>
            </div>
          )}
        </div>

        {/* Description */}
        <Text variant="body-sm" color="muted" className="leading-relaxed">
          {value.description}
        </Text>

        {/* Progress Bar */}
        {showScore && (
          <ProgressBar
            progress={value.score}
            color={getScoreColor(value.score)}
            size="sm"
            showPercentage={false}
          />
        )}
      </div>
    </Card>
  )
}

export default ValueCard
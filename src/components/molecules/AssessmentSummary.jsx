import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const AssessmentSummary = ({ 
  assessment, 
  onView, 
  onDelete,
  className = '' 
}) => {
  const topValues = assessment.results?.slice(0, 3) || []
  const completionDate = format(new Date(assessment.date), 'MMM d, yyyy')
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Text variant="h6" weight="medium" className="mb-1">
              {assessment.framework}
            </Text>
            <div className="flex items-center space-x-2 text-gray-500">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <Text variant="caption">{completionDate}</Text>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              assessment.completed ? 'bg-success' : 'bg-warning'
            }`} />
            <Text variant="caption" color={assessment.completed ? 'success' : 'warning'}>
              {assessment.completed ? 'Completed' : 'In Progress'}
            </Text>
          </div>
        </div>

        {/* Top Values Preview */}
        {topValues.length > 0 && (
          <div>
            <Text variant="body-sm" color="muted" className="mb-2">
              Top Values:
            </Text>
            <div className="flex flex-wrap gap-2">
              {topValues.map((value, index) => (
                <motion.div
                  key={value.Id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full"
                >
                  <Text variant="caption" weight="medium">
                    #{value.rank} {value.name}
                  </Text>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-4 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-gray-500">
            <ApperIcon name="HelpCircle" className="w-4 h-4" />
            <Text variant="caption">
              {assessment.answers?.length || 0} questions
            </Text>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500">
            <ApperIcon name="Target" className="w-4 h-4" />
            <Text variant="caption">
              {assessment.results?.length || 0} values identified
            </Text>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            icon="Eye"
            onClick={() => onView?.(assessment)}
          >
            View Results
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Share2"
              onClick={() => {
                // Share functionality could be implemented here
                console.log('Share assessment:', assessment.Id)
              }}
            >
              Share
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete?.(assessment)}
              className="text-error hover:bg-error/10"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default AssessmentSummary
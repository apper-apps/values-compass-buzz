import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </motion.div>
      
      <Text variant="h5" weight="medium" className="mb-2">
        Oops! Something went wrong
      </Text>
      
      <Text variant="body-sm" color="muted" className="mb-6 max-w-md">
        {message}
      </Text>
      
      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ErrorState
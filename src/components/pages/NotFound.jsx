import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 max-w-md"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
        >
          <ApperIcon name="Compass" className="w-12 h-12 text-primary" />
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          <Text variant="h1" weight="bold" color="primary">
            404
          </Text>
          
          <Text variant="h4" weight="medium">
            Page Not Found
          </Text>
          
          <Text variant="body" color="muted">
            Looks like you've wandered off the path. Let's get you back to discovering your values.
          </Text>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              icon="Home"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              icon="ArrowLeft"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </motion.div>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200">
          <Text variant="body-sm" color="muted" className="mb-4">
            Or explore these popular sections:
          </Text>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/assessment')}
            >
              Take Assessment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/results')}
            >
              View Results
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
            >
              Assessment History
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
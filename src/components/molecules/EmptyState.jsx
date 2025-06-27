import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import ApperIcon from '@/components/ApperIcon'

const EmptyState = ({ 
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Get Started',
  onAction,
  icon = 'Package',
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-gray-300" />
      </motion.div>
      
      <Text variant="h5" weight="medium" className="mb-2">
        {title}
      </Text>
      
      <Text variant="body-sm" color="muted" className="mb-8 max-w-md">
        {description}
      </Text>
      
      {onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState
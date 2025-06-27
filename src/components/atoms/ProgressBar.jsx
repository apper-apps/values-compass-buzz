import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  className = '',
  showPercentage = true,
  color = 'primary',
  size = 'md'
}) => {
  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-success'
  }
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }
  
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]} overflow-hidden`}>
        <motion.div
          className={`${colors[color]} ${sizes[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
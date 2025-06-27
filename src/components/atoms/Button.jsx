import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 disabled:bg-gray-300',
    secondary: 'bg-secondary text-gray-900 hover:bg-secondary/90 focus:ring-secondary/50 disabled:bg-gray-200',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 disabled:bg-gray-300',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary/50 disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray/50 disabled:text-gray-400'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  const iconSpacing = {
    left: icon ? (size === 'sm' ? 'mr-2' : 'mr-2.5') : '',
    right: icon ? (size === 'sm' ? 'ml-2' : 'ml-2.5') : ''
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon 
            name="Loader2" 
            className={`${iconSizes[size]} animate-spin mr-2`} 
          />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon 
              name={icon} 
              className={`${iconSizes[size]} ${iconSpacing.left}`} 
            />
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <ApperIcon 
              name={icon} 
              className={`${iconSizes[size]} ${iconSpacing.right}`} 
            />
          )}
        </>
      )}
    </motion.button>
  )
}

export default Button
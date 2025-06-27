import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-md border-0',
    outlined: 'bg-white border-2 border-gray-200',
    ghost: 'bg-transparent border-0'
  }
  
  const baseClasses = 'rounded-xl overflow-hidden'
  
  const motionProps = hover ? {
    whileHover: { y: -2, boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.1)' },
    transition: { duration: 0.2 }
  } : {}
  
  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
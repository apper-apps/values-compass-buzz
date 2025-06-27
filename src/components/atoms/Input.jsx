import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  
  const hasValue = value && value.toString().length > 0
  const showFloatingLabel = focused || hasValue
  
  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <motion.label
          className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
            showFloatingLabel
              ? 'top-2 text-xs text-gray-600 font-medium'
              : 'top-1/2 -translate-y-1/2 text-gray-500'
          } ${icon && iconPosition === 'left' ? 'left-10' : ''}`}
          animate={{
            y: showFloatingLabel ? -8 : 0,
            scale: showFloatingLabel ? 0.9 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </motion.label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        {/* Input Field */}
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={showFloatingLabel ? '' : placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-3 py-3 border rounded-lg bg-white transition-all duration-200
            ${showFloatingLabel ? 'pt-6 pb-2' : ''}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error 
              ? 'border-error text-error focus:border-error focus:ring-error/20' 
              : 'border-gray-300 focus:border-primary focus:ring-primary/20'
            }
            ${focused ? 'ring-2' : 'ring-0'}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            focus:outline-none
          `}
          {...props}
        />
        
        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </motion.p>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default Input
const Text = ({ 
  children, 
  variant = 'body',
  weight = 'normal',
  color = 'default',
  align = 'left',
  className = '',
  as: Component = 'p',
  ...props 
}) => {
  const variants = {
    h1: 'text-4xl md:text-5xl font-heading leading-tight',
    h2: 'text-3xl md:text-4xl font-heading leading-tight',
    h3: 'text-2xl md:text-3xl font-heading leading-snug',
    h4: 'text-xl md:text-2xl font-heading leading-snug',
    h5: 'text-lg md:text-xl font-heading leading-normal',
    h6: 'text-base md:text-lg font-heading leading-normal',
    body: 'text-base leading-relaxed',
    'body-sm': 'text-sm leading-relaxed',
    caption: 'text-xs leading-normal',
    label: 'text-sm font-medium leading-normal'
  }
  
  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const colors = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    light: 'text-gray-500',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    white: 'text-white'
  }
  
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }
  
  return (
    <Component
      className={`${variants[variant]} ${weights[weight]} ${colors[color]} ${alignments[align]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Text
import { motion } from 'framer-motion'

const SkeletonLoader = ({ 
  count = 1, 
  variant = 'card',
  className = '' 
}) => {
  const shimmerAnimation = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { backgroundPosition: '200px 0' },
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity
    }
  }

  const renderSkeleton = (index) => {
    switch (variant) {
      case 'card':
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <motion.div
                    className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32"
                    style={{ backgroundSize: '400px 100%' }}
                    {...shimmerAnimation}
                  />
                  <motion.div
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                    style={{ backgroundSize: '400px 100%' }}
                    {...shimmerAnimation}
                  />
                </div>
                <motion.div
                  className="h-8 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '400px 100%' }}
                  {...shimmerAnimation}
                />
              </div>
              
              <motion.div
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                style={{ backgroundSize: '400px 100%' }}
                {...shimmerAnimation}
              />
              <motion.div
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"
                style={{ backgroundSize: '400px 100%' }}
                {...shimmerAnimation}
              />
            </div>
          </div>
        )
      
      case 'question':
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="space-y-6">
              <div className="space-y-2">
                <motion.div
                  className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"
                  style={{ backgroundSize: '400px 100%' }}
                  {...shimmerAnimation}
                />
                <motion.div
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"
                  style={{ backgroundSize: '400px 100%' }}
                  {...shimmerAnimation}
                />
              </div>
              
              <div className="space-y-3">
                {[...Array(4)].map((_, optionIndex) => (
                  <motion.div
                    key={optionIndex}
                    className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                    style={{ backgroundSize: '400px 100%' }}
                    {...shimmerAnimation}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'list':
        return (
          <div key={index} className="flex items-center space-x-4 p-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
              style={{ backgroundSize: '400px 100%' }}
              {...shimmerAnimation}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
                style={{ backgroundSize: '400px 100%' }}
                {...shimmerAnimation}
              />
              <motion.div
                className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"
                style={{ backgroundSize: '400px 100%' }}
                {...shimmerAnimation}
              />
            </div>
          </div>
        )
      
      default:
        return (
          <motion.div
            key={index}
            className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
            style={{ backgroundSize: '400px 100%' }}
            {...shimmerAnimation}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => 
        renderSkeleton(index)
      )}
    </div>
  )
}

export default SkeletonLoader
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Welcome = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: 'Target',
      title: 'Discover Core Values',
      description: 'Uncover what truly matters to you through thoughtful questions and reflection'
    },
    {
      icon: 'BarChart3',
      title: 'Visual Insights',
      description: 'See your values ranked and visualized to understand your priorities clearly'
    },
    {
      icon: 'History',
      title: 'Track Progress',
      description: 'Monitor how your values evolve over time with historical assessments'
    },
    {
      icon: 'Share2',
      title: 'Share & Reflect',
      description: 'Export your results and share insights with trusted friends or mentors'
    }
  ]

  const frameworks = [
    {
      id: 'personal',
      name: 'Personal Values Framework',
      description: 'Comprehensive assessment covering life priorities, relationships, and personal growth',
      duration: '10-15 minutes',
      questions: 10
    },
    {
      id: 'career',
      name: 'Career Values Assessment',
      description: 'Focus on work-related values, leadership style, and professional priorities',
      duration: '8-12 minutes',
      questions: 8
    },
    {
      id: 'life',
      name: 'Life Values Compass',
      description: 'Deep dive into legacy, purpose, and what gives your life meaning',
      duration: '12-18 minutes',
      questions: 12
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-primary/5">
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg"
          >
            <ApperIcon name="Compass" className="w-12 h-12 text-white" />
          </motion.div>
          
          <div className="space-y-4">
            <Text variant="h1" weight="bold" color="primary" className="leading-tight">
              Discover Your <br className="hidden sm:block" />
              <span className="text-accent">Core Values</span>
            </Text>
            
            <Text variant="body" color="muted" className="max-w-2xl mx-auto text-lg">
              Understanding your values is the foundation of authentic decision-making. 
              Our thoughtful assessment helps you identify what truly matters most in your life.
            </Text>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              icon="Play"
              onClick={() => navigate('/assessment')}
              className="text-lg px-8 py-4"
            >
              Start Assessment
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              icon="History"
              onClick={() => navigate('/history')}
              className="text-lg px-8 py-4"
            >
              View History
            </Button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-8"
        >
          <Text variant="h3" weight="semibold" align="center">
            Why Values Matter
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <Text variant="h6" weight="semibold" className="mb-2">
                        {feature.title}
                      </Text>
                      <Text variant="body-sm" color="muted">
                        {feature.description}
                      </Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Assessment Frameworks */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <Text variant="h3" weight="semibold">
              Choose Your Assessment
            </Text>
            <Text variant="body" color="muted">
              Select the framework that best fits your current focus and available time
            </Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {frameworks.map((framework, index) => (
              <motion.div
                key={framework.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                <Card 
                  className="p-6 cursor-pointer transition-all duration-200"
                  hover={true}
                  onClick={() => navigate('/assessment', { state: { framework: framework.name } })}
                >
                  <div className="space-y-4">
                    <div>
                      <Text variant="h6" weight="semibold" className="mb-2">
                        {framework.name}
                      </Text>
                      <Text variant="body-sm" color="muted" className="line-clamp-3">
                        {framework.description}
                      </Text>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <span>{framework.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="HelpCircle" className="w-4 h-4" />
                        <span>{framework.questions} questions</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      icon="ArrowRight"
                      iconPosition="right"
                    >
                      Begin Assessment
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center py-12"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <div className="space-y-4">
              <Text variant="h4" weight="semibold">
                Ready to begin your journey?
              </Text>
              <Text variant="body" color="muted" className="max-w-md mx-auto">
                It takes just a few minutes to gain insights that can last a lifetime.
              </Text>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon="Compass"
                  onClick={() => navigate('/assessment')}
                  className="mt-4"
                >
                  Start Your Assessment
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}

export default Welcome
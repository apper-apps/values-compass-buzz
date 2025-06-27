import { useLocation } from 'react-router-dom'
import AssessmentFlow from '@/components/organisms/AssessmentFlow'

const Assessment = () => {
  const location = useLocation()
  const framework = location.state?.framework || 'Personal Values Framework'

  return (
    <div className="min-h-screen bg-background py-8">
      <AssessmentFlow framework={framework} />
    </div>
  )
}

export default Assessment
import Welcome from '@/components/pages/Welcome'
import Assessment from '@/components/pages/Assessment'
import Results from '@/components/pages/Results'
import History from '@/components/pages/History'

export const routes = {
  welcome: {
    id: 'welcome',
    label: 'Welcome',
    path: '/',
    icon: 'Home',
    component: Welcome
  },
  assessment: {
    id: 'assessment',
    label: 'Assessment',
    path: '/assessment',
    icon: 'ClipboardCheck',
    component: Assessment
  },
  results: {
    id: 'results',
    label: 'Results',
    path: '/results',
    icon: 'BarChart3',
    component: Results
  },
  history: {
    id: 'history',
    label: 'History',
    path: '/history',
    icon: 'History',
    component: History
  }
}

export const routeArray = Object.values(routes)
export default routes
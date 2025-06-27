import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'

const Layout = () => {
  const location = useLocation()

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Compass" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-semibold text-gray-900">
                Values Compass
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden flex-shrink-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          {routeArray.slice(1).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-500 hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <ApperIcon 
                    name={route.icon} 
                    className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : 'text-gray-500'}`} 
                  />
                  <span className={isActive ? 'text-primary font-medium' : 'text-gray-500'}>
                    {route.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation - Hidden for now since this is mobile-first */}
      <div className="hidden lg:block">
        {/* Desktop navigation can be added here if needed */}
      </div>
    </div>
  )
}

export default Layout
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Scissors } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-32 h-32 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Scissors className="w-16 h-16 text-accent-500" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary-100 mb-4">
            הדף לא נמצא
          </h2>
          <p className="text-xl text-primary-300 mb-8 max-w-md mx-auto">
            נראה שהגעת לדף שלא קיים. בואו נחזור לדף הבית ונמצא את מה שאתה מחפש.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              <Home className="w-5 h-5 ml-2 rtl:mr-2" />
              דף הבית
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 ml-2 rtl:mr-2" />
              חזור
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound

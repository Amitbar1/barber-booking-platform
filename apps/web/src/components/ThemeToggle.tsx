import { useTheme } from '@/theme/useTheme';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-focus transition-all duration-200"
      aria-label={isDark ? 'Switch to Light' : 'Switch to Dark'}
      title={isDark ? 'Switch to Light' : 'Switch to Dark'}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background */}
      <div className={`absolute inset-0 rounded-full transition-colors duration-200 ${
        isDark ? 'bg-primary' : 'bg-border'
      }`} />
      
      {/* Toggle Circle */}
      <motion.div
        className="absolute top-0.5 w-6 h-6 bg-onPrimary rounded-full shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 20 : 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
        <motion.div
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-onPrimary" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-onPrimary" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

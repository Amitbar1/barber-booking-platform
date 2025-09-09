/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // שומרים לאופציות עתידיות, בפועל נסמוך על CSS vars
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // משתני CSS לנושאים
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        text:     'var(--text)',
        muted:    'var(--text-muted)',
        border:   'var(--border)',
        primary:  'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        onPrimary:'var(--primary-text)',
        accent:   'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        onAccent: 'var(--accent-text)',
        
        // צבעי מצב - חזקים יותר
        success:  'var(--success)',
        'success-dark': 'var(--success-dark)',
        'success-light': 'var(--success-light)',
        warning:  'var(--warning)',
        'warning-dark': 'var(--warning-dark)',
        'warning-light': 'var(--warning-light)',
        error:    'var(--error)',
        'error-dark': 'var(--error-dark)',
        'error-light': 'var(--error-light)',
        info:     'var(--info)',
        'info-dark': 'var(--info-dark)',
        'info-light': 'var(--info-light)',
        
        // צבעי ring
        ring: {
          primary: 'var(--primary)',
          accent: 'var(--accent)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)',
          info: 'var(--info)',
        },
        
        // צבעי מתכת
        gold:     'var(--gold)',
        'gold-dark': 'var(--gold-dark)',
        bronze:   'var(--bronze)',
        copper:   'var(--copper)',
        brass:    'var(--brass)',
        charcoal: 'var(--charcoal)',
        steel:    'var(--steel)',
        silver:   'var(--silver)',
        platinum: 'var(--platinum)',
        // ערכת צבעים מותאמת למספרות גברים - 2025
        barber: {
          // צבעי בסיס - שחור ואלגנטי
          black: '#0a0a0a',
          charcoal: '#1a1a1a',
          dark: '#2a2a2a',
          steel: '#3a3a3a',
          
          // זהב וארד - אלגנטיות ומותרות
          gold: '#d4af37',
          bronze: '#cd7f32',
          copper: '#b87333',
          brass: '#b5a642',
          
          // כסף ומתכת - מודרניות
          silver: '#c0c0c0',
          platinum: '#e5e4e2',
          chrome: '#e8e8e8',
          
          // צבעי דגש - כחול עמוק וירוק זית
          navy: '#1e3a8a',
          deep: '#1e40af',
          olive: '#6b7280',
          sage: '#9ca3af',
          
          // אדום קלאסי למספרות
          crimson: '#dc2626',
          burgundy: '#7f1d1d',
        },
        
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
      },
      fontFamily: {
        // טיפוגרפיה מודרנית למספרות
        'hebrew': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px var(--primary)' },
          '100%': { boxShadow: '0 0 20px var(--primary)' },
        },
      },
    },
  },
  plugins: [],
}

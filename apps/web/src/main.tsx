import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './styles/theme.css'
import './index.css'

const THEME_KEY = 'theme'; // 'dark' | 'light'

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const initial = saved === 'light' ? 'light' : 'dark'; // ברירת מחדל: dark
  document.documentElement.setAttribute('data-theme', initial);
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#e5e4e2',
            border: '1px solid #3a3a3a',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
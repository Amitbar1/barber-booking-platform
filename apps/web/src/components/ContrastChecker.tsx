import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ColorTest {
  name: string;
  bgClass: string;
  textClass: string;
  description: string;
}

const ContrastChecker = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const colorTests: ColorTest[] = [
    // כפתורים ראשיים
    { name: 'כפתור ראשי', bgClass: 'bg-primary', textClass: 'text-onPrimary', description: 'כפתור ראשי' },
    { name: 'כפתור משני', bgClass: 'bg-surface', textClass: 'text-text', description: 'כפתור משני' },
    { name: 'כפתור outline', bgClass: 'border-2 border-primary bg-transparent', textClass: 'text-primary', description: 'כפתור outline' },
    
    // טקסטים
    { name: 'טקסט ראשי', bgClass: 'bg-bg', textClass: 'text-text', description: 'טקסט על רקע' },
    { name: 'טקסט משני', bgClass: 'bg-bg', textClass: 'text-muted', description: 'טקסט משני' },
    { name: 'טקסט על משטח', bgClass: 'bg-surface', textClass: 'text-text', description: 'טקסט על משטח' },
    
    // סטטוסים - חזקים יותר
    { name: 'סטטוס הצלחה', bgClass: 'bg-success/30', textClass: 'text-success', description: 'סטטוס הצלחה' },
    { name: 'סטטוס אזהרה', bgClass: 'bg-warning/30', textClass: 'text-warning', description: 'סטטוס אזהרה' },
    { name: 'סטטוס שגיאה', bgClass: 'bg-error/30', textClass: 'text-error', description: 'סטטוס שגיאה' },
    
    // hover states
    { name: 'Hover כפתור', bgClass: 'bg-primary hover:bg-primary-hover', textClass: 'text-onPrimary', description: 'כפתור עם hover' },
    { name: 'Hover outline', bgClass: 'border-2 border-primary bg-transparent hover:bg-primary', textClass: 'text-primary hover:text-onPrimary', description: 'outline עם hover' },
  ];

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen p-8 bg-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text">בדיקת ניגודיות צבעים</h1>
          <button
            onClick={toggleTheme}
            className="bg-primary hover:bg-primary-hover text-onPrimary px-4 py-2 rounded-lg transition-all duration-200"
          >
            {theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorTests.map((test, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg border border-border ${test.bgClass}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className={`text-lg font-semibold mb-2 ${test.textClass}`}>
                {test.name}
              </h3>
              <p className={`text-sm mb-4 ${test.textClass}`}>
                {test.description}
              </p>
              <div className="space-y-2">
                <button className={`px-4 py-2 rounded ${test.bgClass} ${test.textClass} transition-all duration-200 hover:opacity-90`}>
                  כפתור לדוגמה
                </button>
                <div className={`p-2 rounded text-sm ${test.bgClass} ${test.textClass}`}>
                  טקסט לדוגמה
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-surface rounded-lg">
          <h2 className="text-2xl font-bold text-text mb-4">הערות לבדיקה</h2>
          <ul className="space-y-2 text-text">
            <li>• בדוק שכל הטקסטים נראים בבירור</li>
            <li>• בדוק שכל הכפתורים נראים בבירור</li>
            <li>• בדוק את מצב hover על כל הכפתורים</li>
            <li>• בדוק את מצב focus על כל הכפתורים</li>
            <li>• בדוק שצבעי הסטטוס נראים בבירור</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;

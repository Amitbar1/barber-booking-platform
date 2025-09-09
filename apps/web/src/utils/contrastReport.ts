// דוח ניגודיות מפורט
export const contrastReport = {
  issues: [
    {
      component: 'AdminDashboard - טאבים',
      issue: 'טקסט על רקע primary לא נראה טוב',
      current: 'bg-primary text-onPrimary',
      suggestion: 'השתמש ב-bg-accent text-onAccent לטאבים פעילים',
      severity: 'high'
    },
    {
      component: 'LandingPage - כפתורי ניווט',
      issue: 'hover state לא ברור מספיק',
      current: 'hover:bg-surface/50',
      suggestion: 'השתמש ב-hover:bg-primary/10 hover:text-primary',
      severity: 'medium'
    },
    {
      component: 'BookingPage - שדות קלט',
      issue: 'placeholder text לא נראה טוב',
      current: 'placeholder-muted',
      suggestion: 'השתמש ב-placeholder-text/60',
      severity: 'medium'
    },
    {
      component: 'SalonPage - תגיות קטגוריה',
      issue: 'טקסט על רקע שקוף לא ברור',
      current: 'bg-primary/20 text-primary',
      suggestion: 'השתמש ב-bg-primary text-onPrimary',
      severity: 'high'
    }
  ],
  
  recommendations: [
    'השתמש ב-bg-accent text-onAccent לטאבים פעילים',
    'הוסף hover:bg-primary/10 hover:text-primary לכפתורי ניווט',
    'השתמש ב-placeholder-text/60 לשדות קלט',
    'החלף bg-primary/20 text-primary ב-bg-primary text-onPrimary',
    'הוסף focus:ring-primary/30 לכל הכפתורים',
    'השתמש ב-border-primary/50 לגבולות עדינים'
  ],
  
  colorCombinations: {
    good: [
      'bg-primary text-onPrimary',
      'bg-accent text-onAccent', 
      'bg-success text-white',
      'bg-error text-white',
      'bg-surface text-text',
      'bg-bg text-text'
    ],
    problematic: [
      'bg-primary/20 text-primary',
      'bg-surface/50 text-muted',
      'hover:bg-surface/50 hover:text-text'
    ]
  }
};

export function generateContrastReport() {
  console.log('🔍 דוח ניגודיות צבעים');
  console.log('========================');
  
  contrastReport.issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.component}`);
    console.log(`   בעיה: ${issue.issue}`);
    console.log(`   נוכחי: ${issue.current}`);
    console.log(`   הצעה: ${issue.suggestion}`);
    console.log(`   חומרה: ${issue.severity}`);
    console.log('');
  });
  
  console.log('💡 המלצות כלליות:');
  contrastReport.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
}

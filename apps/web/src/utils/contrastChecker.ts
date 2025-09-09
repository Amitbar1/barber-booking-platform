// כלי בדיקה לניגודיות צבעים
export interface ColorPalette {
  dark: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    primary: string;
    onPrimary: string;
  };
  light: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    primary: string;
    onPrimary: string;
  };
}

export const colorPalette: ColorPalette = {
  dark: {
    bg: '#0f0f0f',        // --charcoal
    surface: '#1a1a1a',   // --steel
    text: '#f8fafc',      // --platinum
    muted: '#9ca3af',     // --text-muted
    border: '#374151',    // --border
    primary: '#d4af37',   // --gold
    onPrimary: '#0f0f0f'  // --charcoal
  },
  light: {
    bg: '#ffffff',        // --white
    surface: '#f8fafc',   // --surface
    text: '#0f0f0f',      // --charcoal
    muted: '#6b7280',     // --text-muted
    border: '#e5e7eb',    // --border
    primary: '#b8941f',   // --gold-dark
    onPrimary: '#ffffff'  // --white
  }
};

// פונקציה לחישוב ניגודיות
export function getContrastRatio(color1: string, color2: string): number {
  // המרה פשוטה - בפועל נצטרך ספרייה מתקדמת יותר
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// בדיקה אם הניגודיות מספקת
export function isGoodContrast(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

// בדיקת כל הצירופים הבעייתיים
export function checkAllContrasts(): { theme: 'dark' | 'light'; issue: string; suggestion: string }[] {
  const issues: { theme: 'dark' | 'light'; issue: string; suggestion: string }[] = [];
  
  // בדיקת מצב כהה
  const dark = colorPalette.dark;
  if (!isGoodContrast(dark.primary, dark.onPrimary)) {
    issues.push({
      theme: 'dark',
      issue: 'Primary button text not visible',
      suggestion: 'Use different primary color or onPrimary text color'
    });
  }
  
  if (!isGoodContrast(dark.surface, dark.text)) {
    issues.push({
      theme: 'dark',
      issue: 'Text on surface not visible',
      suggestion: 'Adjust surface color or text color'
    });
  }
  
  // בדיקת מצב בהיר
  const light = colorPalette.light;
  if (!isGoodContrast(light.primary, light.onPrimary)) {
    issues.push({
      theme: 'light',
      issue: 'Primary button text not visible',
      suggestion: 'Use different primary color or onPrimary text color'
    });
  }
  
  if (!isGoodContrast(light.surface, light.text)) {
    issues.push({
      theme: 'light',
      issue: 'Text on surface not visible',
      suggestion: 'Adjust surface color or text color'
    });
  }
  
  return issues;
}

// צירופי צבעים מומלצים לכפתורים
export const buttonVariants = {
  primary: {
    dark: 'bg-primary text-onPrimary hover:opacity-90',
    light: 'bg-primary text-onPrimary hover:opacity-90'
  },
  secondary: {
    dark: 'border-2 border-muted bg-transparent text-muted hover:bg-muted hover:text-bg',
    light: 'border-2 border-muted bg-transparent text-muted hover:bg-muted hover:text-bg'
  },
  outline: {
    dark: 'border-2 border-text bg-transparent text-text hover:bg-text hover:text-bg',
    light: 'border-2 border-text bg-transparent text-text hover:bg-text hover:text-bg'
  }
};

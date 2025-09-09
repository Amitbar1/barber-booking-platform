# מדריך Deployment - Barber

## הגדרת Environment Variables

### 1. Netlify (Frontend)
הוסף את המשתנים הבאים ב-Netlify Dashboard:
```
VITE_API_BASE_URL=https://your-railway-app.railway.app/api
NODE_VERSION=20
```

### 2. Railway (Backend)
הוסף את המשתנים הבאים ב-Railway Dashboard:
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=3001
```

### 3. GitHub Secrets
הוסף את המשתנים הבאים ב-GitHub Repository Settings > Secrets:
```
NETLIFY_AUTH_TOKEN=your-netlify-auth-token
NETLIFY_SITE_ID=your-netlify-site-id
RAILWAY_TOKEN=your-railway-token
RAILWAY_SERVICE=your-railway-service-name
VITE_API_BASE_URL=https://your-railway-app.railway.app/api
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
```

## תהליך Deployment

### אוטומטי (מומלץ)
1. Push ל-branch `main` יגרום ל-deployment אוטומטי
2. GitHub Actions יטפל ב-build ו-deployment
3. Frontend יועלה ל-Netlify
4. Backend יועלה ל-Railway

### ידני
1. **Frontend (Netlify):**
   ```bash
   npm ci
   npm run build
   # העלה את תיקיית apps/web/dist ל-Netlify
   ```

2. **Backend (Railway):**
   ```bash
   cd apps/api
   npm ci
   npm run build
   npm start
   ```

## פתרון בעיות נפוצות

### שגיאות Build
- ודא שכל ה-dependencies מותקנים: `npm ci`
- בדוק שה-environment variables מוגדרים נכון
- ודא שה-Node.js version תואם (20.x)

### שגיאות Database
- ודא שה-DATABASE_URL מוגדר נכון
- הרץ migrations: `npm run db:push`
- בדוק חיבור ל-database

### שגיאות API
- ודא שה-JWT_SECRET מוגדר
- בדוק שה-PORT זמין
- ודא שה-CORS מוגדר נכון

## בדיקת Deployment
1. Frontend: `https://your-netlify-site.netlify.app`
2. Backend API: `https://your-railway-app.railway.app/api/health`
3. Database: בדוק ב-Railway Dashboard

## תמיכה
אם נתקלת בבעיות, בדוק:
1. GitHub Actions logs
2. Netlify build logs
3. Railway deployment logs
4. Console errors בדפדפן

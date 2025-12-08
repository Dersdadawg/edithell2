# Complete Vercel Deployment Guide

This is a step-by-step guide to deploy both the frontend and backend to Vercel.

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ OpenAI API key
- ✅ Code pushed to GitHub repository

---

## Part 1: Deploy Backend to Vercel

### Step 1: Prepare Backend

The backend is already configured for Vercel with:
- ✅ `vercel.json` configuration file
- ✅ Server exports app for Vercel serverless functions
- ✅ Package.json with build script

**Verify these files exist:**
- `backend/vercel.json` ✓
- `backend/server.js` (exports app) ✓
- `backend/package.json` ✓

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub** (recommended)
4. Authorize Vercel to access your GitHub account

### Step 3: Deploy Backend

1. In Vercel dashboard, click **Add New Project**
2. Click **Import Git Repository**
3. Select your repository (`edithell2` or your repo name)
4. **Configure Project:**
   - **Project Name**: `copy-editor-backend` (or your choice)
   - **Framework Preset**: **Other**
   - **Root Directory**: Click **Edit** and set to: `backend`
   - **Build Command**: Leave empty (or `npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Environment Variables:**
   - Click **Environment Variables**
   - Add the following:
     - **Key**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key (starts with `sk-`)
     - **Environment**: Select all (Production, Preview, Development)
     - Click **Add**
   
   - **Optional**: Add `PORT` (Vercel handles this automatically, but you can set it if needed)

6. Click **Deploy**

7. Wait for deployment (usually 1-2 minutes)

8. **Copy your backend URL** - You'll see something like:
   ```
   https://copy-editor-backend.vercel.app
   ```
   **Save this URL!** You'll need it for the frontend.

### Step 4: Test Backend

1. Open your backend URL in browser: `https://your-backend.vercel.app`
2. You should see: `{"error":"Cannot GET /"}` - This is normal! The backend only has API routes.
3. Test an endpoint (optional):
   ```bash
   curl https://your-backend.vercel.app/api/style-guides -X POST \
     -H "Content-Type: application/json" \
     -d '{"name":"test","text":"test"}'
   ```

---

## Part 2: Deploy Frontend to Vercel

### Step 5: Update Frontend Configuration

Before deploying, we need to update the frontend to use the deployed backend URL.

**Option A: Update vite.config.js (Recommended for Vercel)**

The frontend uses a proxy in development. For production, we'll configure it to use the backend URL.

1. Check your `frontend/vite.config.js` - it should have the proxy setup
2. We'll set an environment variable in Vercel to point to your backend

**Option B: Create a config file (Alternative)**

If you prefer, we can create a config file, but for Vercel, environment variables work better.

### Step 6: Deploy Frontend

1. In Vercel dashboard, click **Add New Project** again
2. Click **Import Git Repository**
3. Select the **same repository** (`edithell2`)
4. **Configure Project:**
   - **Project Name**: `copy-editor-frontend` (or your choice)
   - **Framework Preset**: **Vite** (Vercel will auto-detect)
   - **Root Directory**: Click **Edit** and set to: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. **Environment Variables:**
   - Click **Environment Variables**
   - Add:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://your-backend.vercel.app/api` (use your actual backend URL from Step 3)
     - **Environment**: Select all (Production, Preview, Development)
     - Click **Add**

6. Click **Deploy**

7. Wait for deployment (usually 1-2 minutes)

8. **Copy your frontend URL** - You'll see something like:
   ```
   https://copy-editor-frontend.vercel.app
   ```

### Step 7: Update Frontend Code to Use Environment Variable

We need to update the frontend to use the `VITE_API_URL` environment variable.

**Update `frontend/vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  // Use environment variable for API URL in production
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '/api')
  }
});
```

**Create `frontend/src/config.ts`:**

```typescript
// API configuration
const getApiBaseUrl = () => {
  // Use environment variable if set (production on Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use the proxy
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
```

**Update all fetch calls to use `API_BASE_URL`:**

- `frontend/src/components/StyleGuideSection.tsx`
- `frontend/src/components/ArticleSetupSection.tsx`
- `frontend/src/components/GameEditorSection.tsx`

Change all instances of:
```typescript
fetch('/api/...')
```

To:
```typescript
import { API_BASE_URL } from '../config';
fetch(`${API_BASE_URL}/...`)
```

### Step 8: Test the Deployment

1. Open your frontend URL: `https://your-frontend.vercel.app`
2. Try uploading a style guide
3. Try generating an article
4. Everything should work!

---

## Part 3: Troubleshooting

### Backend Issues

**Problem**: Backend returns 404 or errors
- **Solution**: Check that `vercel.json` is in the `backend` folder
- **Solution**: Verify Root Directory is set to `backend` in Vercel settings
- **Solution**: Check environment variables are set correctly

**Problem**: OpenAI API errors
- **Solution**: Verify `OPENAI_API_KEY` is set in Vercel environment variables
- **Solution**: Check the key starts with `sk-` and is valid

### Frontend Issues

**Problem**: Frontend can't connect to backend
- **Solution**: Verify `VITE_API_URL` is set to your backend URL + `/api`
- **Solution**: Check CORS is enabled on backend (it should be with `cors()` middleware)
- **Solution**: Check browser console for errors

**Problem**: Build fails
- **Solution**: Check that Root Directory is set to `frontend`
- **Solution**: Verify all dependencies are in `package.json`
- **Solution**: Check build logs in Vercel dashboard

### CORS Issues

If you see CORS errors, the backend already has CORS enabled, but you might need to update it:

In `backend/server.js`, the CORS middleware should allow all origins:
```javascript
app.use(cors());
```

If you want to restrict it, you can update to:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000']
}));
```

---

## Part 4: Custom Domains (Optional)

### Add Custom Domain to Frontend

1. In Vercel project settings → **Domains**
2. Add your domain
3. Follow DNS configuration instructions

### Add Custom Domain to Backend

1. Same process for backend project
2. Update `VITE_API_URL` in frontend to use new backend domain

---

## Quick Checklist

### Backend Deployment
- [ ] Vercel account created
- [ ] Backend project created with Root Directory: `backend`
- [ ] Framework Preset: Other
- [ ] Environment variable `OPENAI_API_KEY` added
- [ ] Deployment successful
- [ ] Backend URL saved

### Frontend Deployment
- [ ] Frontend project created with Root Directory: `frontend`
- [ ] Framework Preset: Vite
- [ ] Environment variable `VITE_API_URL` set to backend URL + `/api`
- [ ] Code updated to use `API_BASE_URL` from config
- [ ] Deployment successful
- [ ] Frontend tested and working

---

## Summary

After completing these steps:

- **Backend**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app`

Both are live and connected! 🎉

---

## Need Help?

- Check Vercel deployment logs for errors
- Check browser console for frontend errors
- Verify all environment variables are set
- Make sure Root Directories are correct in both projects


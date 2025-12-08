# Quick Vercel Deployment Checklist

## ✅ Code is Ready!

All code changes are complete:
- ✅ Backend configured for Vercel (`vercel.json`, exports app)
- ✅ Frontend uses `API_BASE_URL` config
- ✅ All fetch calls updated to use config

## 🚀 Deployment Steps

### 1. Deploy Backend (5 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. **Add New Project** → Import your GitHub repo
3. **Settings:**
   - **Root Directory**: `backend`
   - **Framework Preset**: `Other`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
4. **Environment Variables:**
   - Add: `OPENAI_API_KEY` = `your-api-key-here`
5. **Deploy** → Copy the URL (e.g., `https://copy-editor-backend.vercel.app`)

### 2. Deploy Frontend (5 minutes)

1. **Add New Project** again → Import same repo
2. **Settings:**
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite` (auto-detected)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
3. **Environment Variables:**
   - Add: `VITE_API_URL` = `https://your-backend.vercel.app/api`
   - (Use the backend URL from step 1 + `/api`)
4. **Deploy** → Done! 🎉

## 📝 Important Notes

- Backend URL format: `https://your-backend.vercel.app`
- Frontend `VITE_API_URL` format: `https://your-backend.vercel.app/api` (with `/api` at the end)
- Both projects can use the same GitHub repo (different root directories)
- Environment variables are set per-project in Vercel

## 🧪 Test After Deployment

1. Open frontend URL
2. Upload a style guide
3. Generate an article
4. Everything should work!

## ❌ Troubleshooting

**Backend 404?** → Check Root Directory is `backend`
**Frontend can't connect?** → Check `VITE_API_URL` includes `/api` at the end
**OpenAI errors?** → Verify `OPENAI_API_KEY` is set correctly

---

**Full detailed guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`


# Localhost Development Setup

## Quick Start

### 1. Start Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3001
```

**Keep this terminal open!**

### 2. Start Frontend Server

Open a **new terminal** and run:
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### 3. Open in Browser

Go to: `http://localhost:3000`

## Troubleshooting Connection Errors

### Error: "Failed to fetch" or "Connection refused"

**Check 1: Is backend running?**
- Look at the backend terminal
- Should show: `Server running on http://localhost:3001`
- If not, start it: `cd backend && npm run dev`

**Check 2: Is frontend using the proxy?**
- Open browser console (F12)
- Look for: `API Base URL: /api`
- If it shows a full URL like `https://...`, the config is wrong

**Check 3: Check backend .env file**
- Make sure `backend/.env` exists
- Should have: `OPENAI_API_KEY=your-key-here`
- Backend won't work without this

**Check 4: Port conflicts**
- Backend uses port 3001
- Frontend uses port 3000
- If ports are in use, kill the process:
  ```bash
  # Kill process on port 3001
  lsof -ti:3001 | xargs kill -9
  
  # Kill process on port 3000
  lsof -ti:3000 | xargs kill -9
  ```

### Error: "Cannot GET /" on backend

This is normal! The backend only has API routes, not a homepage.

### Error: CORS errors

The backend has CORS enabled, so this shouldn't happen. If it does:
- Check backend is running
- Check backend terminal for errors

## Verify Everything is Working

1. **Backend**: Open `http://localhost:3001/api/style-guides` in browser
   - Should see: `{"error":"Name and text are required"}` (JSON)
   - If you see HTML or 404, backend isn't running correctly

2. **Frontend**: Open `http://localhost:3000`
   - Should load the app
   - Console should show: `API Base URL: /api`

3. **Test**: Try uploading a style guide
   - Should work if both servers are running

## Common Issues

### Issue: Frontend tries to connect to Vercel URL

**Problem**: Environment variable is set locally
**Fix**: 
- Check if you have a `.env` file in `frontend/` with `VITE_API_URL`
- Delete it or comment it out for local development
- The code now prioritizes development mode and uses `/api` proxy

### Issue: Backend won't start

**Problem**: Missing dependencies or .env file
**Fix**:
```bash
cd backend
npm install
# Make sure .env file exists with OPENAI_API_KEY
npm run dev
```

### Issue: Frontend won't start

**Problem**: Missing dependencies
**Fix**:
```bash
cd frontend
npm install
npm run dev
```

## Development vs Production

- **Development (localhost)**: Uses `/api` proxy → `http://localhost:3001`
- **Production (Vercel)**: Uses `VITE_API_URL` env var → `https://your-backend.vercel.app/api`

The code automatically detects which mode you're in!


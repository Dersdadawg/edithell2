# Debugging Steps for JSON Error

## Step 1: Check Browser Console

1. Open your deployed frontend in browser
2. Press **F12** (or Cmd+Option+I on Mac) to open Developer Tools
3. Go to **Console** tab
4. Look for:
   - `API Base URL: ...` - This shows what URL is being used
   - Any red error messages
   - The actual error with "The page c..."

## Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Clear the network log (trash icon)
3. Try uploading a style guide again
4. Look for the request to `/style-guides` or the full API URL
5. Click on that request
6. Check:
   - **Request URL** - What URL was called?
   - **Status Code** - What status code? (200, 404, 500, etc.)
   - **Response** tab - What does the response say?

## Step 3: Test Backend Directly

Test if your backend is working by calling it directly:

### Option A: In Browser
Open this URL (replace with your backend URL):
```
https://copy-editor-backend.vercel.app/api/style-guides
```

You should see: `{"error":"Name and text are required"}` - This is GOOD! It means the endpoint exists.

If you see HTML or "Cannot GET", the route might be wrong.

### Option B: Using curl (Terminal)
```bash
curl -X POST https://copy-editor-backend.vercel.app/api/style-guides \
  -H "Content-Type: application/json" \
  -d '{"name":"test","text":"test"}'
```

This should return JSON (either success or error, but JSON).

## Step 4: Verify Environment Variable

1. Go to Vercel → Your **Frontend** project
2. **Settings** → **Environment Variables**
3. Check:
   - Is `VITE_API_URL` set?
   - Value should be: `https://copy-editor-backend.vercel.app/api`
   - Make sure it includes `/api` at the end!
   - Make sure it's set for **Production** environment

## Step 5: Check Backend Routes

Verify your backend routes are correct. The backend should have:
- `POST /api/style-guides` ✓
- `POST /api/generate-article` ✓
- `POST /api/analyze-article` ✓
- `POST /api/submit-edits` ✓
- `POST /api/hint` ✓

## Step 6: Check CORS

The backend should have CORS enabled. Check `backend/server.js`:
```javascript
app.use(cors());
```

This should allow all origins. If you want to restrict it:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000']
}));
```

## Step 7: Check Vercel Routes

In your backend project on Vercel:
1. Check **Settings** → **Functions**
2. Make sure the routes are configured correctly
3. Check `vercel.json` in your backend folder

## Common Issues:

### Issue 1: Wrong API URL
- **Symptom**: Getting HTML instead of JSON
- **Fix**: Check `VITE_API_URL` includes `/api` at the end
- **Example**: `https://copy-editor-backend.vercel.app/api` ✓ (correct)
- **Wrong**: `https://copy-editor-backend.vercel.app` ✗ (missing /api)

### Issue 2: Backend Route Not Found
- **Symptom**: 404 error, HTML page
- **Fix**: Check `vercel.json` routes configuration
- **Check**: Backend should have route: `"src": "/(.*)", "dest": "server.js"`

### Issue 3: CORS Error
- **Symptom**: CORS error in console
- **Fix**: Make sure `cors()` middleware is in backend

### Issue 4: Environment Variable Not Set
- **Symptom**: Using `/api` instead of full URL
- **Fix**: Set `VITE_API_URL` in Vercel frontend project
- **Note**: After setting, you need to redeploy

## Quick Test Commands

Test backend endpoint:
```bash
curl -X POST https://copy-editor-backend.vercel.app/api/style-guides \
  -H "Content-Type: application/json" \
  -d '{"name":"test","text":"test style guide"}'
```

Expected: JSON response (either success or error object)

If you get HTML, the route is wrong or backend isn't deployed correctly.


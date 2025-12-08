# Verify Environment Variable is Working

## Check Console Output

After the frontend loads, check the browser console. You should see:

```
API Base URL: https://copy-editor-backend.vercel.app/api
VITE_API_URL env var: https://copy-editor-backend.vercel.app/api
```

If you see:
```
API Base URL: /api
VITE_API_URL env var: undefined
```

Then the environment variable is NOT being picked up.

## Common Issues:

### Issue 1: Variable Set But Not Redeployed
- **Problem**: You set the variable but didn't redeploy
- **Fix**: Go to Deployments → Latest deployment → Three dots → Redeploy

### Issue 2: Wrong Environment Selected
- **Problem**: Variable only set for Development, not Production
- **Fix**: In Environment Variables, make sure it's set for **Production** (and Preview/Development)

### Issue 3: Wrong Value
- **Problem**: Value might be missing `/api` or have wrong URL
- **Fix**: Should be exactly: `https://copy-editor-backend.vercel.app/api`

### Issue 4: Variable Name Wrong
- **Problem**: Typo in variable name
- **Fix**: Must be exactly: `VITE_API_URL` (case-sensitive, starts with VITE_)

### Issue 5: Set in Wrong Project
- **Problem**: Set in backend project instead of frontend
- **Fix**: Make sure it's set in the **frontend** project

## How to Check in Vercel:

1. Go to **Frontend** project (not backend)
2. **Settings** → **Environment Variables**
3. Verify:
   - Name: `VITE_API_URL`
   - Value: `https://copy-editor-backend.vercel.app/api`
   - Environments: Production ✓ (and Preview/Development if you want)

## Force Redeploy:

1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete
5. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)




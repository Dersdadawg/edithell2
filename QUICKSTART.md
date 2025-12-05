# Quick Start Guide

## ✅ Dependencies Installed!

The project dependencies have been installed. Follow these steps to run the application:

## Step 1: Add Your OpenAI API Key

1. Open `backend/.env` in a text editor
2. Replace `your_openai_api_key_here` with your actual OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   PORT=3001
   ```

## Step 2: Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see: `Server running on http://localhost:3001`

**Keep this terminal open!**

## Step 3: Start the Frontend Server

Open a **new terminal** and run:
```bash
cd frontend
npm run dev
```

You should see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 4: Open in Browser

Open your browser and go to: **http://localhost:3000**

## Troubleshooting

### "Cannot connect to backend" or API errors
- Make sure the backend is running on port 3001
- Check that `backend/.env` has a valid OpenAI API key
- Check the backend terminal for error messages

### "Port already in use"
- Another process is using port 3000 or 3001
- Kill the process or change the port in the config files

### Frontend shows errors
- Make sure both servers are running
- Check browser console (F12) for errors
- Verify the backend is accessible at http://localhost:3001

### OpenAI API errors
- Verify your API key is correct in `backend/.env`
- Check you have credits/access to OpenAI API
- Check the backend terminal for specific error messages

## Need Help?

Check the main README.md for more detailed information.


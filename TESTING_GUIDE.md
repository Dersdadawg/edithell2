# Testing Guide

## ✅ Current Status
- Backend: Running on port 3001
- Frontend: Running on port 3000

## Step-by-Step Testing

### 1. Open the Application
Open your browser and go to:
```
http://localhost:3000
```

You should see the Copy Editor Practice Game interface with:
- Style Guide section (left side)
- Article Setup section (right side)
- History section (left side, empty initially)

### 2. Test Style Guide Upload

**Option A: Upload a .txt file**
1. In the "Style Guide" section, enter a name (e.g., "AP Style Practice")
2. Click "Upload .txt File" and select a text file with style guide content
3. Click "Process Style Guide"
4. Wait for processing (may take 10-30 seconds)
5. You should see a "Rules Summary" appear below the form

**Option B: Paste text directly**
1. Enter a name
2. Paste your style guide text into the textarea
3. Click "Process Style Guide"
4. Wait for processing

**Expected Result:**
- The active style guide name appears at the top
- A rules summary is displayed
- No error messages

**Sample Style Guide Text (for testing):**
```
AP Style Guide Rules:

1. Capitalize job titles only when they appear before a person's name.
   Example: President Biden (correct) vs. the president (correct when not before name)

2. Use commas to separate items in a series, including before the final "and."
   Example: red, white, and blue

3. Spell out numbers one through nine. Use numerals for 10 and above.
   Example: five people, 15 people

4. Use "percent" instead of the % symbol in most cases.
   Example: 50 percent (not 50%)

5. Dates should be written as: Month Day, Year
   Example: January 15, 2024 (not Jan. 15, 2024 or 1/15/24)
```

### 3. Test Article Generation

1. After processing a style guide, go to the "Article Setup" section
2. Configure the article:
   - **Length**: Choose short (~300 words), medium (~600 words), or long (~900 words)
   - **Difficulty**: easy, medium, or hard
   - **Number of Errors**: Enter a number (e.g., 10-15 for testing)
   - **Subject**: e.g., "Local city politics" or "Technology news"
   - **Tone**: e.g., "AP-style news article" or "Casual blog post"
3. Click "Generate Article"
4. Wait for generation (may take 20-60 seconds)

**Expected Result:**
- A "Game Editor" section appears
- The article text is displayed in a large text editor
- The editor shows the number of errors to find
- You can see the article with intentional errors

### 4. Test Article Editing

1. In the "Game Editor" section, you'll see the article with errors
2. Read through the article and identify errors
3. Edit the text directly in the editor to fix errors
4. You can:
   - Fix spelling mistakes
   - Correct grammar
   - Fix style guide violations
   - Adjust punctuation

**Tip:** Try to find and fix as many errors as you can!

### 5. Test Hint Feature

1. While editing, click the "Get Hint" button
2. Wait a few seconds
3. A hint should appear above the editor

**Expected Result:**
- A blue hint box appears
- The hint points to a type of error and approximate location
- The hint doesn't reveal the exact solution

### 6. Test Scoring

1. After editing the article, click "Submit for Scoring"
2. Wait for evaluation (may take 15-30 seconds)
3. Review your results

**Expected Result:**
- A "Scoring Results" section appears
- Shows your score: X / Y (Z%)
- Lists each error with:
  - ✅ "Fixed" (green) or ❌ "Missed" (red)
  - A comment explaining why it's correct/incorrect
- Overall feedback about your performance
- The session is automatically saved to history

### 7. Test Session History

1. After completing a game, check the "Session History" section (left side)
2. You should see your completed session with:
   - Timestamp
   - Style guide name
   - Subject and difficulty
   - Your score percentage

**Expected Result:**
- Past sessions are listed with color-coded scores:
  - Green: 80% or higher
  - Yellow: 60-79%
  - Red: Below 60%

## Troubleshooting

### If style guide processing fails:
- Check that your OpenAI API key is set in `backend/.env`
- Check the backend terminal for error messages
- Try with a shorter style guide text first

### If article generation fails:
- Make sure a style guide is processed first
- Check that the number of errors is reasonable (5-50)
- Check the backend terminal for errors

### If scoring fails:
- Make sure you've edited the article (don't submit empty)
- Check the backend terminal for errors

### If nothing loads:
- Make sure both servers are running:
  - Backend: `cd backend && npm run dev`
  - Frontend: `cd frontend && npm run dev`
- Check browser console (F12) for errors
- Try refreshing the page

## Quick Test Checklist

- [ ] Frontend loads at http://localhost:3000
- [ ] Can upload/paste style guide
- [ ] Style guide processes successfully
- [ ] Can generate an article
- [ ] Article appears in editor
- [ ] Can edit the article text
- [ ] Can get hints
- [ ] Can submit for scoring
- [ ] Score results appear
- [ ] Session saved to history

## Tips for Testing

1. **Start small**: Use a short style guide (3-5 rules) and generate a short article with 5-10 errors
2. **Test incrementally**: Test each feature one at a time
3. **Check console**: Open browser DevTools (F12) to see any frontend errors
4. **Check backend logs**: Watch the terminal where the backend is running for error messages
5. **Test error cases**: Try submitting without a style guide, or with invalid inputs

## Sample Test Workflow

1. **Setup** (2 min)
   - Paste the sample style guide text above
   - Process it

2. **Generate** (1 min)
   - Set: Medium length, Medium difficulty, 10 errors
   - Subject: "Local news"
   - Generate article

3. **Edit** (5-10 min)
   - Read through the article
   - Fix errors you find
   - Use hints if stuck

4. **Score** (30 sec)
   - Submit for scoring
   - Review results
   - Check what you missed

5. **Repeat** (optional)
   - Try different difficulty levels
   - Try different subjects
   - Try different numbers of errors

Happy testing! 🎉


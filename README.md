# Copy Editor Practice Game

A single-page web application for practicing copy editing using AI-generated articles and custom style guides.

## Features

- Upload and process your own style guide (.txt format)
- Generate practice articles with configurable:
  - Length (short/medium/long or custom word count)
  - Difficulty (easy/medium/hard)
  - Number of errors
  - Subject and tone/style
- Edit articles directly in a text editor
- Get hints about remaining errors
- Receive detailed scoring and feedback
- View session history (stored in localStorage)

## Tech Stack

### Backend
- Node.js + Express
- OpenAI API (using smart pricing strategy)
- In-memory storage (easy to swap to database later)

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS (dark mode)
- localStorage for session history

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_api_key_here
PORT=3001
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3001`

## Usage

1. **Upload Style Guide**: 
   - Upload a .txt file or paste your style guide text
   - Click "Process Style Guide" to have AI extract and summarize the rules

2. **Generate Article**:
   - Configure article parameters (length, difficulty, number of errors, subject, tone)
   - Click "Generate Article" to create a practice article with intentional errors

3. **Edit Article**:
   - Edit the article text directly in the editor
   - Use "Get Hint" to receive guidance about remaining errors
   - Click "Submit for Scoring" when finished

4. **Review Results**:
   - View your score and detailed feedback
   - See which errors you fixed and which you missed
   - Session is automatically saved to history

## OpenAI Models Used

- **Style Summary**: `gpt-4o-mini` - For summarizing style guides
- **Article Generation**: `gpt-4o` - For generating realistic articles with errors
- **Evaluation/Hints**: `gpt-4o-mini` - For grading edits and generating hints

All API calls use JSON response format for structured output.

## Project Structure

```
GPTEDITHELL/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx        # Entry point
│   │   ├── types.ts        # TypeScript types
│   │   ├── components/     # React components
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Notes

- Style guides and game state are stored in-memory (will be lost on server restart)
- Session history is stored in browser localStorage
- No user accounts or authentication required
- All API calls use structured JSON responses from OpenAI


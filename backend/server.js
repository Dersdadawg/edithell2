import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory storage
const styleGuides = new Map();
const games = new Map();

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model constants
const STYLE_SUMMARY_MODEL = "gpt-4o-mini";
const ARTICLE_MODEL = "gpt-4o";
const EVAL_MODEL = "gpt-4o-mini";

// Helper: Attach character offsets to errors
function attachOffsets(article, errors) {
  const usedRanges = [];
  
  return errors.map(error => {
    const originalText = error.original_text;
    let startIndex = 0;
    
    while (true) {
      const index = article.indexOf(originalText, startIndex);
      if (index === -1) {
        // If exact match not found, try to find a close match
        console.warn(`Could not find exact match for: "${originalText}"`);
        return {
          ...error,
          start_char: -1,
          end_char: -1
        };
      }
      
      const endIndex = index + originalText.length;
      
      // Check if this range overlaps with any used range
      const overlaps = usedRanges.some(([start, end]) => 
        (index >= start && index < end) || 
        (endIndex > start && endIndex <= end) ||
        (index <= start && endIndex >= end)
      );
      
      if (!overlaps) {
        usedRanges.push([index, endIndex]);
        return {
          ...error,
          start_char: index,
          end_char: endIndex
        };
      }
      
      startIndex = index + 1;
    }
  });
}

// POST /api/style-guides
app.post('/api/style-guides', async (req, res) => {
  try {
    const { name, text } = req.body;
    
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and text are required' });
    }
    
    // Summarize style guide
    const response = await openai.chat.completions.create({
      model: STYLE_SUMMARY_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a style guide analyzer. Extract and summarize style rules from the provided style guide into concise, prescriptive bullet-style rules (300-600 words). Focus on actionable copy editing rules that can be used to identify errors in articles. Return your response as a JSON object with a 'summary' field containing the rules summary."
        },
        {
          role: "user",
          content: `Please analyze this style guide and create a concise summary of its rules:\n\n${text}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    
    // Validate response
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const content = response.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from OpenAI API');
    }
    
    // Parse JSON with error handling
    let summaryData;
    try {
      summaryData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response content:', content);
      // Fallback: use the content as-is if it's not valid JSON
      summaryData = { summary: content };
    }
    
    const rulesSummary = summaryData.summary || summaryData.rules || summaryData.content || content;
    
    const styleGuideId = uuidv4();
    styleGuides.set(styleGuideId, {
      name,
      rawText: text,
      rulesSummary: typeof rulesSummary === 'string' ? rulesSummary : JSON.stringify(rulesSummary)
    });
    
    res.json({
      styleGuideId,
      rulesSummary: typeof rulesSummary === 'string' ? rulesSummary : JSON.stringify(rulesSummary)
    });
  } catch (error) {
    console.error('Error processing style guide:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generate-article
app.post('/api/generate-article', async (req, res) => {
  try {
    const { 
      styleGuideId, 
      length = 'medium', 
      wordCount, 
      difficulty = 'medium', 
      numErrors = 10,
      subject = 'General news',
      tone = 'AP-style news article'
    } = req.body;
    
    if (!styleGuideId || !styleGuides.has(styleGuideId)) {
      return res.status(400).json({ error: 'Invalid styleGuideId' });
    }
    
    const styleGuide = styleGuides.get(styleGuideId);
    
    // Map length to word count if not provided
    let targetWords = wordCount;
    if (!targetWords) {
      switch (length) {
        case 'short': targetWords = 300; break;
        case 'medium': targetWords = 600; break;
        case 'long': targetWords = 900; break;
        default: targetWords = 600;
      }
    }
    
    // Ensure under 1000 words
    targetWords = Math.min(targetWords, 1000);
    
    const systemPrompt = `You are an article generator for a copy editing practice game. Generate a realistic article with intentional errors that violate both general grammar rules and the provided style guide rules.

Requirements:
- Article length: approximately ${targetWords} words (target under 1000 words)
- Subject: ${subject}
- Tone/Style: ${tone}
- Difficulty: ${difficulty}
- Number of errors: ${numErrors}

Error types to include:
- Grammar errors (subject-verb agreement, tense consistency, etc.)
- Spelling errors
- Punctuation errors
- Style guide violations (based on the provided style guide rules)
- Other common copy editing issues

Return a JSON object with this exact structure:
{
  "article": "full article text with errors",
  "errors": [
    {
      "id": "e1",
      "error_type": "grammar | spelling | punctuation | style_guide | other",
      "category": "short category like capitalization, comma, date_format, etc.",
      "rule_description": "Short description of the rule being broken",
      "original_text": "exact substring containing the error, exactly as in article",
      "suggested_correction": "corrected version of that substring",
      "explanation": "1-3 sentences explaining the rule and fix"
    }
  ]
}

Make sure each error's original_text appears exactly as written in the article.`;

    const userPrompt = `Style Guide Rules Summary:\n${styleGuide.rulesSummary}\n\nGenerate the article with ${numErrors} errors as specified.`;

    const response = await openai.chat.completions.create({
      model: ARTICLE_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });
    
    // Validate response
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const content = response.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from OpenAI API');
    }
    
    let articleData;
    try {
      articleData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response content:', content.substring(0, 500));
      throw new Error('Failed to parse article data from OpenAI response');
    }
    
    const { article, errors } = articleData;
    
    if (!article || !errors || !Array.isArray(errors)) {
      return res.status(500).json({ error: 'Invalid response format from OpenAI' });
    }
    
    // Attach offsets
    const errorsWithOffsets = attachOffsets(article, errors);
    
    const gameId = uuidv4();
    games.set(gameId, {
      styleGuideId,
      article,
      errors: errorsWithOffsets,
      createdAt: new Date().toISOString()
    });
    
    res.json({
      gameId,
      article,
      errors: errorsWithOffsets
    });
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/submit-edits
app.post('/api/submit-edits', async (req, res) => {
  try {
    const { gameId, editedArticle } = req.body;
    
    if (!gameId || !editedArticle) {
      return res.status(400).json({ error: 'gameId and editedArticle are required' });
    }
    
    if (!games.has(gameId)) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const game = games.get(gameId);
    const styleGuide = styleGuides.get(game.styleGuideId);
    
    // Prepare answer key without offsets for the prompt
    const answerKey = game.errors.map(({ id, error_type, category, rule_description, original_text, suggested_correction, explanation }) => ({
      id,
      error_type,
      category,
      rule_description,
      original_text,
      suggested_correction,
      explanation
    }));
    
    const systemPrompt = `You are a copy editing evaluator. Compare the original article (with errors) against the user's edited version and the answer key. Determine which errors from the answer key have been fixed and which remain.

CRITICAL EVALUATION RULES:
1. An error is considered FIXED if:
   - The incorrect text from the answer key is no longer present in the edited article
   - The user's correction addresses the same issue, even if worded differently
   - The user's correction is grammatically correct and follows the style guide rules
   - The user fixed the error in a different but equally valid way

2. An error is considered NOT FIXED if:
   - The original incorrect text still appears in the edited article
   - The error was partially fixed but still incorrect
   - The user introduced a different error in the same location

3. Be GENEROUS with scoring - if the user fixed the error correctly (even if not exactly matching the suggested correction), mark it as fixed.

4. Count the "foundErrors" by counting how many errors in the answer key have "fixed": true.

5. Do NOT penalize for alternative correct fixes - if the user's solution is correct, it counts as fixed.

Return JSON with this exact structure:
{
  "score": {
    "foundErrors": number of errors fixed (count of perError items with fixed: true),
    "totalErrors": total number of errors in answer key,
    "percentage": percentage score (0-100)
  },
  "perError": [
    {
      "id": "e1",
      "fixed": true or false,
      "comment": "Short explanation of why this is correct/incorrect. Be specific about what was fixed or what remains wrong."
    }
  ],
  "overallFeedback": "2-5 sentences of high-level feedback about the user's editing performance"
}`;

    const userPrompt = `Style Guide Rules Summary:
${styleGuide.rulesSummary}

Original Article (with errors):
${game.article}

Answer Key (errors that should be fixed):
${JSON.stringify(answerKey, null, 2)}

User's Edited Article:
${editedArticle}

Evaluate the user's edits and provide scoring.`;

    const response = await openai.chat.completions.create({
      model: EVAL_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    
    // Validate response
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const content = response.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from OpenAI API');
    }
    
    let evaluation;
    try {
      evaluation = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response content:', content.substring(0, 500));
      throw new Error('Failed to parse evaluation data from OpenAI response');
    }
    
    // Validate and fix score if needed
    if (evaluation.perError && Array.isArray(evaluation.perError)) {
      const actualFixedCount = evaluation.perError.filter(e => e.fixed === true).length;
      
      // If the score doesn't match, fix it
      if (!evaluation.score || evaluation.score.foundErrors !== actualFixedCount) {
        console.warn(`Score mismatch detected. Reported: ${evaluation.score?.foundErrors}, Actual: ${actualFixedCount}`);
        if (!evaluation.score) {
          evaluation.score = {};
        }
        evaluation.score.foundErrors = actualFixedCount;
        evaluation.score.totalErrors = evaluation.perError.length;
        evaluation.score.percentage = Math.round((actualFixedCount / evaluation.perError.length) * 100);
      }
    }
    
    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating edits:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/hint
app.post('/api/hint', async (req, res) => {
  try {
    const { gameId } = req.body;
    
    if (!gameId || !games.has(gameId)) {
      return res.status(400).json({ error: 'Invalid gameId' });
    }
    
    const game = games.get(gameId);
    const styleGuide = styleGuides.get(game.styleGuideId);
    
    const systemPrompt = `You are a hint generator for a copy editing practice game. Generate a helpful hint that points the user toward one of the remaining errors without revealing the exact solution.

The hint should:
- Reference the type of error and approximate location
- Not reveal the exact wording or direct solution
- Be encouraging and educational
- Point to a specific error from the answer key

Example hints:
- "Check the way the date is formatted in the first paragraph."
- "Look at capitalization of job titles in the second paragraph."
- "Review comma usage in the list near the end of the article."

Return JSON with this structure:
{
  "hint": "your hint text here"
}`;

    const userPrompt = `Style Guide Rules Summary:
${styleGuide.rulesSummary}

Article:
${game.article}

Answer Key (errors to find):
${JSON.stringify(game.errors.map(e => ({
  id: e.id,
  error_type: e.error_type,
  category: e.category,
  rule_description: e.rule_description
})), null, 2)}

Generate a helpful hint about one of the errors.`;

    const response = await openai.chat.completions.create({
      model: EVAL_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });
    
    // Validate response
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const content = response.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from OpenAI API');
    }
    
    let hintData;
    try {
      hintData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response content:', content.substring(0, 500));
      // Fallback hint
      hintData = { hint: "Look carefully for style guide violations and grammar errors throughout the article." };
    }
    
    res.json({
      hint: hintData.hint || "Look carefully for style guide violations and grammar errors throughout the article."
    });
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/style-guides/:id
app.get('/api/style-guides/:id', (req, res) => {
  const { id } = req.params;
  const guide = styleGuides.get(id);
  if (!guide) {
    return res.status(404).json({ error: 'Style guide not found' });
  }
  res.json({
    styleGuideId: id,
    name: guide.name,
    rulesSummary: guide.rulesSummary
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


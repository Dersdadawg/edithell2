import { useState } from 'react';
import { ArticleGenerationParams, GameData } from '../types';

interface ArticleSetupSectionProps {
  styleGuideId: string | null;
  onArticleGenerated: (gameData: GameData) => void;
}

export default function ArticleSetupSection({ styleGuideId, onArticleGenerated }: ArticleSetupSectionProps) {
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [wordCount, setWordCount] = useState<number>(600);

  // Update word count when length changes
  const handleLengthChange = (newLength: 'short' | 'medium' | 'long') => {
    setLength(newLength);
    if (newLength === 'short') {
      setWordCount(300);
    } else if (newLength === 'long') {
      setWordCount(900);
    } else {
      setWordCount(600);
    }
  };
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numErrors, setNumErrors] = useState<number>(10);
  const [subject, setSubject] = useState('Local city politics');
  const [tone, setTone] = useState('AP-style news article');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!styleGuideId) {
      setError('Please process a style guide first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: ArticleGenerationParams = {
        styleGuideId,
        length,
        wordCount: length === 'medium' ? undefined : wordCount, // Only send for short/long
        difficulty,
        numErrors,
        subject,
        tone,
      };

      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate article');
      }

      const data: GameData = await response.json();
      onArticleGenerated(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Article Setup</h2>

      {!styleGuideId && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-200">
          Please process a style guide first before generating an article.
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="length" className="block text-sm font-medium mb-2">
              Length
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => handleLengthChange(e.target.value as 'short' | 'medium' | 'long')}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="short">Short (~300 words)</option>
              <option value="medium">Medium (~600 words)</option>
              <option value="long">Long (~900 words)</option>
            </select>
          </div>

          {length !== 'medium' && (
            <div>
              <label htmlFor="word-count" className="block text-sm font-medium mb-2">
                Custom Word Count
              </label>
              <input
                id="word-count"
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value) || 600)}
                min="100"
                max="1000"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="num-errors" className="block text-sm font-medium mb-2">
              Number of Errors
            </label>
            <input
              id="num-errors"
              type="number"
              value={numErrors}
              onChange={(e) => setNumErrors(parseInt(e.target.value) || 10)}
              min="5"
              max="50"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Local city politics"
          />
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-medium mb-2">
            Tone / Style
          </label>
          <input
            id="tone"
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AP-style news article"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !styleGuideId}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
        >
          {loading ? 'Generating Article...' : 'Generate Article'}
        </button>
      </form>
    </div>
  );
}


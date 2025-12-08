import { useState } from 'react';
import { GameData, ScoreResult } from '../types';
import { API_BASE_URL } from '../config';

interface GameEditorSectionProps {
  game: GameData;
  styleGuideName: string;
  onScoreReceived: (score: ScoreResult, metadata: any) => void;
}

export default function GameEditorSection({ game, styleGuideName, onScoreReceived }: GameEditorSectionProps) {
  const [editedArticle, setEditedArticle] = useState(game.article);
  const [loading, setLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetHint = async () => {
    setHintLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/hint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: game.gameId }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned non-JSON response. Check API URL: ${API_BASE_URL}/hint`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to get hint (${response.status})`);
      }

      const data = await response.json();
      setCurrentHint(data.hint);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/submit-edits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.gameId,
          editedArticle,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned non-JSON response. Check API URL: ${API_BASE_URL}/submit-edits`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to submit edits (${response.status})`);
      }

      const score: ScoreResult = await response.json();
      onScoreReceived(score, {
        subject: 'Generated Article',
        difficulty: 'medium',
        numErrors: game.errors.length,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Game Editor</h2>
        <div className="text-sm text-slate-400">
          Style Guide: {styleGuideName} | Errors to find: {game.errors.length}
        </div>
      </div>

      {currentHint && (
        <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700 rounded">
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-semibold">💡 Hint:</span>
            <p className="text-blue-200 flex-1">{currentHint}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-200">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="article-editor" className="block text-sm font-medium mb-2">
          Edit the article below. Fix all errors you find, then submit for scoring.
        </label>
        <textarea
          id="article-editor"
          value={editedArticle}
          onChange={(e) => setEditedArticle(e.target.value)}
          rows={20}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
          placeholder="Article text will appear here..."
        />
        <div className="mt-2 text-sm text-slate-400">
          Word count: {editedArticle.split(/\s+/).filter(w => w.length > 0).length}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleGetHint}
          disabled={hintLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
        >
          {hintLoading ? 'Getting Hint...' : 'Get Hint'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit for Scoring'}
        </button>
      </div>
    </div>
  );
}


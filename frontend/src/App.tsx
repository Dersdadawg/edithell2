import { useState, useEffect } from 'react';
import StyleGuideSection from './components/StyleGuideSection';
import ArticleSetupSection from './components/ArticleSetupSection';
import GameEditorSection from './components/GameEditorSection';
import HistorySection from './components/HistorySection';
import { Session } from './types';

const API_BASE = '/api';

function App() {
  const [activeStyleGuideId, setActiveStyleGuideId] = useState<string | null>(null);
  const [activeStyleGuideName, setActiveStyleGuideName] = useState<string>('');
  const [currentGame, setCurrentGame] = useState<{
    gameId: string;
    article: string;
    errors: any[];
  } | null>(null);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Load session history from localStorage
    const saved = localStorage.getItem('copyEditorSessions');
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load sessions:', e);
      }
    }
  }, []);

  const saveSession = (session: Session) => {
    const updated = [session, ...sessions].slice(0, 50); // Keep last 50
    setSessions(updated);
    localStorage.setItem('copyEditorSessions', JSON.stringify(updated));
  };

  const handleStyleGuideProcessed = (styleGuideId: string, name: string) => {
    setActiveStyleGuideId(styleGuideId);
    setActiveStyleGuideName(name);
  };

  const handleArticleGenerated = (gameData: { gameId: string; article: string; errors: any[] }) => {
    setCurrentGame(gameData);
    setScoreResult(null);
  };

  const handleScoreReceived = (score: any, gameMetadata: any) => {
    setScoreResult(score);
    saveSession({
      timestamp: Date.now(),
      styleGuideName: activeStyleGuideName,
      subject: gameMetadata.subject || 'Unknown',
      difficulty: gameMetadata.difficulty || 'medium',
      numErrors: gameMetadata.numErrors || 0,
      score: score.score
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Copy Editor Practice Game</h1>
          <p className="text-slate-400">Practice copy editing with AI-generated articles and your own style guide</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <StyleGuideSection
              onStyleGuideProcessed={handleStyleGuideProcessed}
              activeStyleGuideName={activeStyleGuideName}
            />
            <HistorySection sessions={sessions} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <ArticleSetupSection
              styleGuideId={activeStyleGuideId}
              onArticleGenerated={handleArticleGenerated}
            />
            {currentGame && (
              <GameEditorSection
                game={currentGame}
                styleGuideName={activeStyleGuideName}
                onScoreReceived={handleScoreReceived}
              />
            )}
            {scoreResult && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-2xl font-bold mb-4">Scoring Results</h2>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {scoreResult.score.foundErrors} / {scoreResult.score.totalErrors} ({scoreResult.score.percentage}%)
                  </div>
                  <p className="text-slate-300">{scoreResult.overallFeedback}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Error Details:</h3>
                  {scoreResult.perError?.map((error: any) => (
                    <div
                      key={error.id}
                      className={`p-4 rounded border ${
                        error.fixed
                          ? 'bg-green-900/30 border-green-700'
                          : 'bg-red-900/30 border-red-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            error.fixed
                              ? 'bg-green-700 text-green-100'
                              : 'bg-red-700 text-red-100'
                          }`}
                        >
                          {error.fixed ? 'Fixed' : 'Missed'}
                        </span>
                        <span className="text-sm text-slate-400">Error {error.id}</span>
                      </div>
                      <p className="text-slate-200">{error.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


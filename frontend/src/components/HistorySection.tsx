import { Session } from '../types';

interface HistorySectionProps {
  sessions: Session[];
}

export default function HistorySection({ sessions }: HistorySectionProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">Session History</h2>
        <p className="text-slate-400 text-sm">No past sessions yet. Complete a game to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Session History</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sessions.map((session, index) => (
          <div
            key={index}
            className="p-4 bg-slate-700 rounded border border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">
                {new Date(session.timestamp).toLocaleString()}
              </span>
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  session.score.percentage >= 80
                    ? 'bg-green-700 text-green-100'
                    : session.score.percentage >= 60
                    ? 'bg-yellow-700 text-yellow-100'
                    : 'bg-red-700 text-red-100'
                }`}
              >
                {session.score.percentage}%
              </span>
            </div>
            <div className="text-sm text-slate-300 mb-1">
              <span className="font-semibold">{session.styleGuideName}</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Subject: {session.subject}</div>
              <div>Difficulty: {session.difficulty} | Errors: {session.numErrors}</div>
              <div>
                Score: {session.score.foundErrors} / {session.score.totalErrors}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


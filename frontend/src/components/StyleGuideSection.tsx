import { useState } from 'react';

interface StyleGuideSectionProps {
  onStyleGuideProcessed: (styleGuideId: string, name: string) => void;
  activeStyleGuideName: string;
}

export default function StyleGuideSection({ onStyleGuideProcessed, activeStyleGuideName }: StyleGuideSectionProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [rulesSummary, setRulesSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
        if (!name) {
          setName(file.name.replace('.txt', ''));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text.trim()) {
      setError('Name and text are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/style-guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process style guide');
      }

      const data = await response.json();
      setRulesSummary(data.rulesSummary);
      onStyleGuideProcessed(data.styleGuideId, name);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Style Guide</h2>
      
      {activeStyleGuideName && (
        <div className="mb-4 p-3 bg-slate-700 rounded">
          <p className="text-sm text-slate-400">Active:</p>
          <p className="font-semibold text-slate-200">{activeStyleGuideName}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="style-guide-name" className="block text-sm font-medium mb-2">
            Style Guide Name
          </label>
          <input
            id="style-guide-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AP Style Practice"
          />
        </div>

        <div>
          <label htmlFor="style-guide-file" className="block text-sm font-medium mb-2">
            Upload .txt File
          </label>
          <input
            id="style-guide-file"
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <div>
          <label htmlFor="style-guide-text" className="block text-sm font-medium mb-2">
            Or Paste Style Guide Text
          </label>
          <textarea
            id="style-guide-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Paste your style guide content here..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !name || !text.trim()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
        >
          {loading ? 'Processing...' : 'Process Style Guide'}
        </button>
      </form>

      {rulesSummary && (
        <div className="mt-6 p-4 bg-slate-700 rounded border border-slate-600">
          <h3 className="text-lg font-semibold mb-2">Rules Summary</h3>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{rulesSummary}</p>
        </div>
      )}
    </div>
  );
}


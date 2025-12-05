export interface Session {
  timestamp: number;
  styleGuideName: string;
  subject: string;
  difficulty: string;
  numErrors: number;
  score: {
    foundErrors: number;
    totalErrors: number;
    percentage: number;
  };
}

export interface StyleGuideResponse {
  styleGuideId: string;
  rulesSummary: string;
}

export interface ArticleGenerationParams {
  styleGuideId: string;
  length?: 'short' | 'medium' | 'long';
  wordCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  numErrors: number;
  subject: string;
  tone: string;
}

export interface Error {
  id: string;
  error_type: string;
  category: string;
  rule_description: string;
  original_text: string;
  suggested_correction: string;
  explanation: string;
  start_char?: number;
  end_char?: number;
}

export interface GameData {
  gameId: string;
  article: string;
  errors: Error[];
}

export interface ScoreResult {
  score: {
    foundErrors: number;
    totalErrors: number;
    percentage: number;
  };
  perError: Array<{
    id: string;
    fixed: boolean;
    comment: string;
  }>;
  overallFeedback: string;
}


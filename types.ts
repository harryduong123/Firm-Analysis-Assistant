export interface FinancialPeriod {
  periodLabel: string;
  type: 'year' | 'quarter' | 'month';
  year: string; // Used for grouping drill-down (e.g. "2023")
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  netIncome: number;
  totalAssets: number;
  totalEquity: number;
}

export interface AnalysisSection {
  summary: string;
  keyPoints: string[];
}

export interface FinancialReport {
  companyName: string;
  ticker: string;
  currency: string;
  reportingUnit: string; // e.g. "Billion" or "Million"
  periods: FinancialPeriod[];
  verticalAnalysis: AnalysisSection;
  horizontalAnalysis: AnalysisSection;
  executiveSummary: string;
  risks: string[];
  opportunities: string[];
  sources: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SearchState {
  query: string;
  status: AppState;
  error?: string;
  data?: FinancialReport;
}
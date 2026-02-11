import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, BarChart3, Globe, CalendarRange } from 'lucide-react';
import { AppState } from '../types';

interface DashboardProps {
  onSearch: (ticker: string, startYear: number, endYear: number) => void;
  status: AppState;
  error?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onSearch, status, error }) => {
  const currentYear = new Date().getFullYear();
  const [ticker, setTicker] = useState('');
  const [startYear, setStartYear] = useState(currentYear - 4);
  const [endYear, setEndYear] = useState(currentYear);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim(), startYear, endYear);
    }
  };

  const suggestions = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'VNM', 'AMZN'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <Sparkles className="w-4 h-4 mr-2" />
          <span className="text-xs font-semibold uppercase tracking-wide">Powered by Gemini 2.0 Flash</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-blue-800 mb-6">
          Firm Analysis Assistant
        </h1>
        <p className="text-lg text-slate-600">
          Provide quick overall information on a listed firm's financial status with automated analysis and visualizations.
        </p>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-xl relative group flex flex-col items-center">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 w-full h-full"></div>
        <form onSubmit={handleSubmit} className="relative w-full z-10">
          <div className="flex flex-col gap-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-slate-400" />
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Enter Ticker Symbol (e.g., AAPL, VNM)"
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 shadow-xl transition-all"
                disabled={status === AppState.LOADING}
              />
              <button 
                type="submit"
                disabled={status === AppState.LOADING || !ticker.trim()}
                className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze
              </button>
            </div>

            {/* Year Range Selector */}
            <div className="flex items-center justify-center gap-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm mx-auto w-fit">
              <div className="flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Period:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1990"
                  max={currentYear}
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value))}
                  className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
                <span className="text-slate-400 text-sm">to</span>
                <input
                  type="number"
                  min="1990"
                  max={currentYear}
                  value={endYear}
                  onChange={(e) => setEndYear(parseInt(e.target.value))}
                  className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm max-w-md text-center">
          {error}
        </div>
      )}

      {/* Suggestions */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <span className="text-slate-500 text-sm mr-2 py-1">Trending:</span>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => {
              setTicker(s);
              onSearch(s, startYear, endYear);
            }}
            className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-sm transition-colors shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all">
          <Globe className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Search Grounding</h3>
          <p className="text-slate-600 text-sm">Acquire data and information from financial statements and real-time news.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-200 hover:shadow-lg transition-all">
          <BarChart3 className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Automated Analysis</h3>
          <p className="text-slate-600 text-sm">Performs vertical and horizontal analysis automatically on retrieved financial data.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-green-200 hover:shadow-lg transition-all">
          <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Visual Insights</h3>
          <p className="text-slate-600 text-sm">Interactive charts and margin trends visualization to spot opportunities instantly.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
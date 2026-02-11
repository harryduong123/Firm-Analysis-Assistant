import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">Analyzing Financial Statements</h3>
        <p className="text-slate-500 max-w-md">
          Gemini is searching for the latest 10-K/10-Q data, performing vertical & horizontal analysis, and generating your report...
        </p>
      </div>
      
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingState;
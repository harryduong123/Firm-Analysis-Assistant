import React from 'react';
import { FinancialReport } from '../types';
import FinancialChart from './FinancialChart';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  FileText, 
  ExternalLink,
  DollarSign
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportViewProps {
  data: FinancialReport;
  onBack: () => void;
}

const Card: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
      {icon && <span className="text-blue-500">{icon}</span>}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    <div className="text-slate-600">
      {children}
    </div>
  </div>
);

const getSafeHostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return 'Source';
  }
};

const ReportView: React.FC<ReportViewProps> = ({ data, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-blue-600 mb-2 transition-colors flex items-center gap-1"
          >
            ← Back to Search
          </button>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{data.companyName}</h1>
            <span className="text-xl font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{data.ticker}</span>
          </div>
          <p className="text-slate-500 mt-1">Currency: {data.currency} • Units: {data.reportingUnit}</p>
        </div>
        <div className="flex gap-2">
          <div className="text-right">
             <p className="text-xs text-slate-500 uppercase tracking-wider">Latest Revenue</p>
             <p className="text-xl font-bold text-slate-900">
               {data.periods[data.periods.length - 1]?.revenue.toLocaleString()} <span className="text-sm font-normal text-slate-500">{data.reportingUnit}</span>
             </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Executive Summary" icon={<FileText className="w-5 h-5" />} className="lg:col-span-2">
          <div className="prose prose-slate prose-sm max-w-none">
            <ReactMarkdown>{data.executiveSummary}</ReactMarkdown>
          </div>
        </Card>

        {/* Risks & Opportunities */}
        <div className="space-y-6">
          <Card title="Key Opportunities" icon={<Target className="w-5 h-5" />} className="border-l-4 border-l-green-500">
            <ul className="space-y-2">
              {data.opportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Risk Factors" icon={<AlertTriangle className="w-5 h-5" />} className="border-l-4 border-l-red-500">
             <ul className="space-y-2">
              {data.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-blue-500" />
        Financial Visualization <span className="text-sm font-normal text-slate-400 ml-2">(Unit: {data.reportingUnit})</span>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Revenue & Net Income Trend" className="lg:col-span-1">
          <FinancialChart periods={data.periods} type="revenue-profit" unit={data.reportingUnit} />
        </Card>
        <Card title="Margin Analysis (%)" className="lg:col-span-1">
          <FinancialChart periods={data.periods} type="margins" unit={data.reportingUnit} />
        </Card>
        <Card title="Return on Assets & Equity (%)" className="lg:col-span-1">
          <FinancialChart periods={data.periods} type="ratios" unit={data.reportingUnit} />
        </Card>
      </div>

      {/* Deep Dive Analysis */}
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-purple-500" />
        Detailed Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Vertical Analysis" icon={<TrendingDown className="w-5 h-5" />}>
          <div className="prose prose-slate prose-sm mb-4">
             <ReactMarkdown>{data.verticalAnalysis.summary}</ReactMarkdown>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Key Takeaways</h4>
            <ul className="space-y-1">
              {data.verticalAnalysis.keyPoints.map((point, i) => (
                <li key={i} className="text-sm text-slate-600 pl-3 border-l-2 border-slate-200">{point}</li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="Horizontal Analysis" icon={<TrendingUp className="w-5 h-5" />}>
           <div className="prose prose-slate prose-sm mb-4">
             <ReactMarkdown>{data.horizontalAnalysis.summary}</ReactMarkdown>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Key Takeaways</h4>
            <ul className="space-y-1">
              {data.horizontalAnalysis.keyPoints.map((point, i) => (
                <li key={i} className="text-sm text-slate-600 pl-3 border-l-2 border-slate-200">{point}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card title={`Historical Data (Unit: ${data.reportingUnit})`} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3 text-right">Revenue</th>
                <th className="px-6 py-3 text-right">Gross Profit</th>
                <th className="px-6 py-3 text-right">Op. Income</th>
                <th className="px-6 py-3 text-right">Net Income</th>
                <th className="px-6 py-3 text-right hidden sm:table-cell">Total Assets</th>
                <th className="px-6 py-3 text-right hidden sm:table-cell">Total Equity</th>
              </tr>
            </thead>
            <tbody>
              {/* Simple sort to ensure chronological order if needed, but Gemini usually provides it sorted */}
              {[...data.periods]
                .filter(p => p.type !== 'quarter')
                .sort((a,b) => {
                 // Custom sort to keep years first, then quarters, or just display raw
                 // Displaying raw for now as table handles mixed types okay
                 return 0;
              }).map((p, i) => (
                <tr key={i} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${p.type === 'year' ? 'bg-slate-50/50 font-semibold' : ''}`}>
                  <td className="px-6 py-4">
                    {p.periodLabel}
                    <span className="ml-2 text-[10px] text-slate-400 uppercase tracking-wider px-1.5 py-0.5 rounded border border-slate-200">{p.type}</span>
                  </td>
                  <td className="px-6 py-4 text-right">{p.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">{p.grossProfit.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">{p.operatingIncome.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">{p.netIncome.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right hidden sm:table-cell text-slate-400">{p.totalAssets ? p.totalAssets.toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 text-right hidden sm:table-cell text-slate-400">{p.totalEquity ? p.totalEquity.toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
         <div className="mt-8 border-t border-slate-200 pt-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Sources & References</h4>
            <ul className="flex flex-wrap gap-4">
              {data.sources.map((source, i) => (
                <li key={i}>
                  <a 
                    href={source} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {getSafeHostname(source)}
                  </a>
                </li>
              ))}
            </ul>
         </div>
      )}
    </div>
  );
};

export default ReportView;
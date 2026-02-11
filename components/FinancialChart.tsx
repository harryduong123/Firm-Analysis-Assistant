import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
  CartesianGrid
} from 'recharts';
import { FinancialPeriod } from '../types';

interface FinancialChartProps {
  periods: FinancialPeriod[];
  type: 'revenue-profit' | 'margins' | 'ratios';
  unit: string;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded shadow-xl text-sm z-50">
        <p className="font-semibold text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500 capitalize">{entry.name}:</span>
            <span className="text-slate-900 font-mono">
              {entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {(entry.name.includes('%') || entry.name.includes('Ratio')) ? '%' : ` ${unit}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FinancialChart: React.FC<FinancialChartProps> = ({ periods, type, unit }) => {
  const availableTypes = useMemo(() => {
    // Filter out 'quarter' from the available visualization types
    const types = new Set(periods.filter(p => p.type !== 'quarter').map(p => p.type));
    
    // Sort order: year, month (quarter is excluded)
    const order: Record<string, number> = { year: 0, month: 1 };
    return Array.from(types).sort((a, b) => (order[a as string] || 0) - (order[b as string] || 0));
  }, [periods]);

  // Default to the first available type (usually 'year')
  const [viewType, setViewType] = useState<'year' | 'quarter' | 'month'>(
    (availableTypes[0] as 'year' | 'quarter' | 'month') || 'year'
  );

  const filteredData = useMemo(() => {
    // If the selected viewType isn't available (or is quarter), fall back to the first available one
    const activeType = availableTypes.includes(viewType) ? viewType : availableTypes[0];
    // Sort data chronologically for the chart
    return [...periods]
      .filter(p => p.type === activeType)
      .sort((a, b) => a.periodLabel.localeCompare(b.periodLabel));
  }, [periods, viewType, availableTypes]);

  const chartContent = () => {
    if (type === 'revenue-profit') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={filteredData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="periodLabel" 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{ value: unit, angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 10 } }}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: '#f1f5f9', opacity: 0.5 }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar 
              dataKey="revenue" 
              name="Revenue" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="netIncome" 
              name="Net Income" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
            />
            <Line type="monotone" dataKey="grossProfit" name="Gross Profit" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'ratios') {
      const ratioData = filteredData.map(p => ({
        ...p,
        roa: p.totalAssets ? (p.netIncome / p.totalAssets) * 100 : 0,
        roe: p.totalEquity ? (p.netIncome / p.totalEquity) * 100 : 0
      }));

      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ratioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="periodLabel" 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="roa" name="ROA %" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="roe" name="ROE %" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Margins
    const marginData = filteredData.map(p => ({
      ...p,
      grossMargin: (p.grossProfit / p.revenue) * 100,
      operatingMargin: (p.operatingIncome / p.revenue) * 100,
      netMargin: (p.netIncome / p.revenue) * 100
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={marginData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="periodLabel" 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="operatingMargin" name="Operating Margin %" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="netMargin" name="Net Margin %" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="h-full w-full relative">
      {/* View Selector */}
      {availableTypes.length > 1 && (
        <div className="absolute top-0 right-0 z-10 flex bg-slate-100 rounded-lg p-1">
          {availableTypes.map((t) => (
            <button
              key={t}
              onClick={() => setViewType(t as any)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewType === t || (!availableTypes.includes(viewType) && t === availableTypes[0])
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      {/* Chart container */}
      <div className="h-80 w-full pt-8">
         {filteredData.length > 0 ? chartContent() : (
           <div className="h-full flex items-center justify-center text-slate-400 text-sm">
             No data available for this view.
           </div>
         )}
      </div>
    </div>
  );
};

export default FinancialChart;
import React from 'react';
import { KPIMetric } from '../types/dashboard';

interface ScorecardsRowProps {
  kpis: {
    acceptanceRate: KPIMetric;
    responseRate: KPIMetric;
    meetingConversionRate: KPIMetric;
    qualificationRate: KPIMetric;
  };
  comparePreviousPeriod: boolean;
}

const SparklineSVG: React.FC<{ points: number[]; positive: boolean }> = ({ points, positive }) => {
  const width = 96;
  const height = 40;
  const min = Math.min(...points, 0);
  const max = Math.max(...points, 100);
  const range = Math.max(max - min, 1);

  const coords = points.map((val, idx) => {
    const x = (idx / Math.max(points.length - 1, 1)) * (width - 8) + 4;
    const y = height - 6 - ((val - min) / range) * (height - 12);
    return { x, y };
  });

  const pathData = coords
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const areaData = `${pathData} L ${coords[coords.length - 1].x.toFixed(1)} ${height} L ${coords[0].x.toFixed(1)} ${height} Z`;
  const strokeColor = positive ? '#10B981' : '#F59E0B';
  const gradId = `spark-${positive ? 'pos' : 'neg'}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaData} fill={`url(#${gradId})`} />
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ScorecardsRow: React.FC<ScorecardsRowProps> = ({ kpis, comparePreviousPeriod }) => {
  const cards: { metric: KPIMetric; accentBadge: string }[] = [
    { metric: kpis.acceptanceRate, accentBadge: 'bg-blue-50 text-blue-700 border-blue-200/70' },
    { metric: kpis.responseRate, accentBadge: 'bg-teal-50 text-teal-700 border-teal-200/70' },
    { metric: kpis.meetingConversionRate, accentBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200/70' },
    { metric: kpis.qualificationRate, accentBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map(({ metric, accentBadge }) => {
        const isPositive = metric.deltaPercent >= 0;
        return (
          <div
            key={metric.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all p-5 flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-600">{metric.label}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${accentBadge}`}
              >
                {metric.numerator} / {metric.denominator} {metric.numeratorLabel.toLowerCase()}
              </span>
            </div>

            {/* Big KPI Number */}
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {metric.rate.toFixed(1)}%
              </span>
              <span className="text-xs font-medium text-slate-400">
                ({metric.numerator} {metric.numeratorLabel})
              </span>
            </div>

            {/* Bottom Row: Period-over-Period Growth & Sparkline (exact SaaS reference style) */}
            <div className="flex items-end justify-between pt-1">
              <div>
                <span className="block text-[11px] font-medium text-slate-400">
                  {comparePreviousPeriod ? 'Var. periodo prev.' : 'Base acumulada'}
                </span>
                {comparePreviousPeriod ? (
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-bold mt-0.5 ${
                      isPositive ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    <span>{isPositive ? '▲' : '▼'}</span>
                    <span>{Math.abs(metric.deltaPercent).toFixed(1)}%</span>
                    <span className="text-[11px] font-normal text-slate-400 ml-0.5">
                      (prev. {metric.previousRate}%)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-600">
                    De {metric.denominator} {metric.denominatorLabel.toLowerCase()}
                  </span>
                )}
              </div>

              <SparklineSVG points={metric.sparkline} positive={isPositive} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

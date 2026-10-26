import React, { useState } from 'react';
import {
  StudySession,
  Habit,
  DailyTask,
  UserProfile,
  VisionGoal,
  YearlyGoal,
  MonthlyMilestone,
  WeeklySprint,
  TODAY_STR,
} from '../types';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';

interface VisualGraphsViewProps {
  user: UserProfile;
  sessions: StudySession[];
  habits: Habit[];
  tasks: DailyTask[];
  visions: VisionGoal[];
  yearlyGoals: YearlyGoal[];
  monthlyMilestones: MonthlyMilestone[];
  weeklySprints: WeeklySprint[];
}

export const VisualGraphsView: React.FC<VisualGraphsViewProps> = ({
  user,
  sessions,
  habits,
  tasks,
  visions,
  yearlyGoals,
  monthlyMilestones,
  weeklySprints,
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '14'>('14');

  // Days array for the selected range
  const numDays = timeRange === '7' ? 7 : 14;
  const daysList: { dateStr: string; label: string; weekday: string }[] = [];

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    daysList.push({
      dateStr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
    });
  }

  // Calculate daily study minutes per day
  const dailyStudyData = daysList.map(item => {
    const daySessions = sessions.filter(s => s.date === item.dateStr);
    const totalMins = daySessions.reduce((acc, s) => acc + s.durationMins, 0);
    const hours = Number((totalMins / 60).toFixed(1));
    return {
      ...item,
      totalMins,
      hours,
    };
  });

  const targetHours = user.dailyStudyTargetHours;
  const maxStudyHour = Math.max(...dailyStudyData.map(d => d.hours), targetHours + 2, 8);

  // Subject distribution
  const subjectTotals: Record<string, number> = {};
  sessions.forEach(s => {
    subjectTotals[s.subject] = (subjectTotals[s.subject] || 0) + s.durationMins;
  });

  const totalAllMins = Object.values(subjectTotals).reduce((a, b) => a + b, 0) || 1;
  const subjectColors: Record<string, string> = {
    'Data Structures': '#4F46E5', // indigo
    'Operating Systems': '#0D9488', // teal
    'Mathematics': '#D97706', // amber
    'Computer Networks': '#2563EB', // blue
    'Web Development': '#7C3AED', // violet
    'General Revision': '#64748B', // slate
  };

  const subjectEntries = Object.entries(subjectTotals).map(([name, mins]) => ({
    name,
    mins,
    hours: (mins / 60).toFixed(1),
    percent: Math.round((mins / totalAllMins) * 100),
    color: subjectColors[name] || '#6366F1',
  }));

  // Average study hours per day
  const avgHours = (
    dailyStudyData.reduce((acc, d) => acc + d.hours, 0) / (dailyStudyData.length || 1)
  ).toFixed(1);

  // Productivity Trend line (last 14 days)
  const productivityTrend = daysList.map(item => {
    const daySessions = sessions.filter(s => s.date === item.dateStr);
    const studyM = daySessions.reduce((acc, s) => acc + s.durationMins, 0);
    const studyRatio = Math.min(1, studyM / (targetHours * 60 || 1));

    const habitsDone = habits.filter(h => h.history[item.dateStr]).length;
    const habitRatio = habits.length > 0 ? habitsDone / habits.length : 1;

    const score = Math.round(((studyRatio * 0.6) + (habitRatio * 0.4)) * 100);
    return {
      date: item.label,
      score,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Quantitative Analytics &amp; Visual Progress</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Visual Graphs &amp; Performance Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            14-Day Average Study Time:{' '}
            <span className="font-bold text-indigo-600 font-mono tabular-nums">{avgHours} hours/day</span>
          </p>
        </div>

        {/* Range Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setTimeRange('7')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              timeRange === '7' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('14')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              timeRange === '14' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 14 Days
          </button>
        </div>
      </div>

      {/* Graph 1: Daily Study Hours Bar Chart with Target Line */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Daily Study Hours vs Target
            </h3>
            <p className="text-xs text-slate-500">
              Dashed red line represents Vivek&apos;s daily {targetHours}.0h target
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-indigo-600" />
              <span>Target Met (≥{targetHours}h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-amber-500" />
              <span>Partial Session</span>
            </div>
          </div>
        </div>

        {/* Responsive SVG Bar Chart */}
        <div className="relative h-64 w-full">
          {/* Target Reference Line */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-rose-400 z-10 flex items-center justify-end pr-2 pointer-events-none"
            style={{
              bottom: `${(targetHours / maxStudyHour) * 100}%`,
            }}
          >
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-mono">
              Target: {targetHours}h
            </span>
          </div>

          {/* Bars Container */}
          <div className="h-full flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-6">
            {dailyStudyData.map(day => {
              const heightPercent = Math.min(100, Math.max(4, (day.hours / maxStudyHour) * 100));
              const isTargetReached = day.hours >= targetHours;
              const isToday = day.dateStr === TODAY_STR;

              return (
                <div
                  key={day.dateStr}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Hover Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono pointer-events-none whitespace-nowrap z-20 shadow-md">
                    {day.label}: {day.hours}h ({day.totalMins}m)
                  </div>

                  {/* Value label on top of bar */}
                  <span className="text-[10px] font-mono tabular-nums text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.hours}h
                  </span>

                  {/* Bar element */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isTargetReached
                        ? 'bg-indigo-600 group-hover:bg-indigo-500'
                        : 'bg-amber-500 group-hover:bg-amber-400'
                    } ${isToday ? 'ring-2 ring-indigo-400' : ''}`}
                  />

                  {/* Date label at bottom */}
                  <span className="text-[10px] text-slate-500 mt-2 font-mono whitespace-nowrap truncate w-full text-center">
                    {day.weekday}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Split: Subject Distribution & Hierarchy Progress Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Donut / Breakdown Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                Subject Distribution
              </h3>
              <p className="text-xs text-slate-500">Time allocated per curriculum domain</p>
            </div>
            <span className="text-xs font-mono tabular-nums font-bold text-slate-700">
              {(totalAllMins / 60).toFixed(1)} hrs total
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {subjectEntries.map(entry => (
              <div key={entry.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="font-semibold text-slate-800">{entry.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-600">
                    {entry.hours} hrs ({entry.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${entry.percent}%`,
                      backgroundColor: entry.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hierarchy Progress Waterfall (Vision -> Day) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Vision to Day Rollup Progress
              </h3>
              <p className="text-xs text-slate-500">How each hierarchy layer compounds into the big vision</p>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            {/* Level 1: Vision */}
            <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-indigo-900">3-Year Long Vision</span>
                <span className="font-mono tabular-nums font-bold text-indigo-700">42%</span>
              </div>
              <p className="text-xs text-slate-600">{visions[0]?.title}</p>
              <div className="w-full bg-indigo-200/60 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            {/* Level 2: Year 1 */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-900">Year 1 (2026) Foundation</span>
                <span className="font-mono tabular-nums font-bold text-slate-700">68%</span>
              </div>
              <p className="text-xs text-slate-600">{yearlyGoals[0]?.title}</p>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Level 3: Month */}
            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-900">November 2026 Milestone</span>
                <span className="font-mono tabular-nums font-bold text-emerald-700">74%</span>
              </div>
              <p className="text-xs text-slate-600">{monthlyMilestones[0]?.title}</p>
              <div className="w-full bg-emerald-200/60 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '74%' }} />
              </div>
            </div>

            {/* Level 4: Weekly Sprint */}
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-900">Week 43 Sprint</span>
                <span className="font-mono tabular-nums font-bold text-amber-700">79%</span>
              </div>
              <p className="text-xs text-slate-600">{weeklySprints[0]?.title}</p>
              <div className="w-full bg-amber-200/60 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '79%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph 3: 14-Day Productivity Score Trend Line */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              14-Day Execution Consistency Index
            </h3>
            <p className="text-xs text-slate-500">Composite score based on study hours, habit checkoffs, and daily tasks</p>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="relative h-48 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Guide Gridlines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />

            {/* Polyline Path */}
            {(() => {
              const points = productivityTrend.map((d, idx) => {
                const x = (idx / (productivityTrend.length - 1)) * 500;
                const y = 110 - (d.score / 100) * 90;
                return `${x},${y}`;
              });
              const pointsStr = points.join(' ');
              const areaStr = `0,120 ${pointsStr} 500,120`;

              return (
                <>
                  <polygon points={areaStr} fill="url(#gradientArea)" />
                  <polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsStr}
                  />
                  {productivityTrend.map((d, idx) => {
                    const x = (idx / (productivityTrend.length - 1)) * 500;
                    const y = 110 - (d.score / 100) * 90;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3.5"
                        className="fill-white stroke-indigo-600 stroke-2 hover:r-5 transition-all"
                      />
                    );
                  })}
                </>
              );
            })()}
          </svg>

          {/* Dates bottom labels */}
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
            {productivityTrend.map((d, idx) => (
              <span key={idx} className={idx % 2 === 0 ? 'inline' : 'hidden sm:inline'}>
                {d.date}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

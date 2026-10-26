import React, { useState } from 'react';
import { Habit, TODAY_STR } from '../types';
import {
  CheckCircle2,
  Circle,
  Flame,
  Award,
  Plus,
  Calendar,
  Sun,
  BookOpen,
  Code,
  Activity,
  Brain,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HabitsViewProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'history'>) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'discipline' | 'study' | 'health' | 'mindset'>('discipline');
  const [reminderTime, setReminderTime] = useState('07:00');

  // Filter habits
  const filteredHabits = habits.filter(
    h => selectedCategory === 'all' || h.category === selectedCategory
  );

  const completedTodayCount = habits.filter(h => h.history[TODAY_STR]).length;
  const overallRate = Math.round((completedTodayCount / habits.length) * 100);

  // Generate 60 days dates array for heatmap
  const past60Days: string[] = [];
  for (let i = 59; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    past60Days.push(d.toISOString().split('T')[0]);
  }

  // Calculate day completion rate for heatmap
  const getDayScore = (dateStr: string) => {
    const done = habits.filter(h => h.history[dateStr]).length;
    return Math.round((done / habits.length) * 100);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;
    onAddHabit({
      title: habitTitle.trim(),
      category: habitCategory,
      icon: 'CheckSquare',
      targetFrequency: 'daily',
      reminderTime: reminderTime,
    });
    setHabitTitle('');
    setShowAddModal(false);
    soundManager.playCheckmarkSound();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <Award className="w-4 h-4" />
            <span>Daily Discipline &amp; Consistency Tracker</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Habit Mastery Station
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Today: <span className="font-semibold text-slate-900 font-mono tabular-nums">{completedTodayCount} of {habits.length}</span> habits completed ({overallRate}%).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Daily Habit</span>
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Habits' },
          { id: 'discipline', label: 'Discipline & Routine' },
          { id: 'study', label: 'Study & Academics' },
          { id: 'health', label: 'Health & Energy' },
          { id: 'mindset', label: 'Mindset & Evening Review' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map(habit => {
          const isDoneToday = habit.history[TODAY_STR];
          return (
            <div
              key={habit.id}
              className={`rounded-xl border p-5 transition-all ${
                isDoneToday
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    {habit.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                    {habit.title}
                  </h3>
                </div>
                <button
                  onClick={() => onToggleHabit(habit.id)}
                  className={`p-2 rounded-lg transition-all ${
                    isDoneToday
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-300 text-slate-300 hover:text-emerald-600 hover:border-emerald-400'
                  }`}
                  title={isDoneToday ? 'Completed today' : 'Mark complete for today'}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>

              {/* Streaks & Reminder info */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 font-mono tabular-nums text-amber-700 font-bold">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                  <span>{habit.currentStreak} Day Streak</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                  Best: {habit.bestStreak}d
                </span>
              </div>

              {/* Mini 7-day past status dots */}
              <div className="flex items-center justify-between gap-1 mt-3 pt-2">
                {[6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
                  const d = new Date();
                  d.setDate(d.getDate() - daysAgo);
                  const dateKey = d.toISOString().split('T')[0];
                  const done = habit.history[dateKey];
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
                  return (
                    <div key={daysAgo} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-slate-400">{dayName}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {done ? '✓' : '·'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 60-Day Habit Consistency Heatmap */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">60-Day Consistency Heatmap</h3>
            <p className="text-xs text-slate-500">Visual proof of Vivek&apos;s daily routine and momentum</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Less</span>
            <span className="w-3 h-3 rounded-xs bg-slate-100" />
            <span className="w-3 h-3 rounded-xs bg-emerald-200" />
            <span className="w-3 h-3 rounded-xs bg-emerald-400" />
            <span className="w-3 h-3 rounded-xs bg-emerald-600" />
            <span>More</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
          {past60Days.map(dateStr => {
            const score = getDayScore(dateStr);
            const isToday = dateStr === TODAY_STR;
            let bgClass = 'bg-slate-200';
            if (score === 0) bgClass = 'bg-slate-200/70';
            else if (score < 40) bgClass = 'bg-emerald-200';
            else if (score < 75) bgClass = 'bg-emerald-400';
            else bgClass = 'bg-emerald-600';

            return (
              <div
                key={dateStr}
                title={`${dateStr}: ${score}% habits completed`}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs transition-transform hover:scale-125 cursor-pointer ${bgClass} ${
                  isToday ? 'ring-2 ring-indigo-600 ring-offset-1' : ''
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create New Daily Habit</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a regular habit to Vivek&apos;s daily routine.
            </p>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 15 pages of Technical Book"
                  value={habitTitle}
                  onChange={e => setHabitTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={habitCategory}
                  onChange={e => setHabitCategory(e.target.value as 'discipline' | 'study' | 'health' | 'mindset')}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  <option value="discipline">Discipline &amp; Routine</option>
                  <option value="study">Study &amp; Academics</option>
                  <option value="health">Health &amp; Energy</option>
                  <option value="mindset">Mindset &amp; Evening Review</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Daily Reminder Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={e => setReminderTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  UserProfile,
  DailyTask,
  Habit,
  StudySession,
  MotivationQuote,
  TODAY_STR,
} from '../types';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Plus,
  RefreshCw,
  Award,
  Zap,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface DashboardViewProps {
  user: UserProfile;
  tasks: DailyTask[];
  habits: Habit[];
  sessions: StudySession[];
  quotes: MotivationQuote[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<DailyTask, 'id'>) => void;
  onToggleHabit: (habitId: string) => void;
  onNavigateTab: (tab: string) => void;
  onStartFocus: (durationMinutes: number) => void;
  onOpenMotivation: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  tasks,
  habits,
  sessions,
  quotes,
  onToggleTask,
  onAddTask,
  onToggleHabit,
  onNavigateTab,
  onStartFocus,
  onOpenMotivation,
}) => {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Data Structures');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newTaskMins, setNewTaskMins] = useState(60);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Time of day greeting in Hinglish / English
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Shubh Prabhat' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Metrics for Today
  const todaySessions = sessions.filter(s => s.date === TODAY_STR);
  const todayStudyMins = todaySessions.reduce((acc, s) => acc + s.durationMins, 0);
  const todayStudyHours = (todayStudyMins / 60).toFixed(1);
  const studyTargetMins = user.dailyStudyTargetHours * 60;
  const studyProgressPercent = Math.min(100, Math.round((todayStudyMins / studyTargetMins) * 100));

  const todayTasks = tasks.filter(t => t.date === TODAY_STR);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const taskPercent = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

  const completedHabits = habits.filter(h => h.history[TODAY_STR]).length;
  const habitPercent = Math.round((completedHabits / habits.length) * 100);

  // Best streak among habits
  const currentStreak = Math.max(...habits.map(h => h.currentStreak), 14);

  const currentQuote = quotes[activeQuoteIndex % quotes.length];

  const handleNextQuote = () => {
    setActiveQuoteIndex(prev => (prev + 1) % quotes.length);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      priority: newTaskPriority,
      estimatedMins: newTaskMins,
      completedMins: 0,
      completed: false,
      date: TODAY_STR,
    });
    setNewTaskTitle('');
    setIsAddingTask(false);
    soundManager.playCheckmarkSound();
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Vision Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-6 sm:p-8">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('/src/assets/images/vision_future_horizon_1793054681078.jpg')` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
              <span>{timeGreeting}, Vivek!</span>
              <span aria-hidden="true">·</span>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold">Focus Mode Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Aaj ka Target Fateh Karo, Vivek.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              &ldquo;{user.visionStatement}&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="text-slate-400">Target Goal:</span>
              <span className="font-semibold text-white">{user.targetExam}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Wake Time:</span>
              <span className="font-mono tabular-nums text-white">{user.wakeTime}</span>
            </div>
          </div>

          {/* Quick Start Focus Action */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => onStartFocus(25)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start 25m Pomodoro</span>
            </button>
            <button
              onClick={() => onNavigateTab('summary')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
            >
              <span>Daily Summary & Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics (Single Elevation, Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study Hours Metric */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Today&apos;s Study Time</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{todayStudyHours}</span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">/ {user.dailyStudyTargetHours}h</span>
            </div>
            <span className="mt-2 text-xs text-indigo-600 font-medium block">
              {studyProgressPercent}% of daily goal
            </span>
          </div>
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600 transition-all duration-500"
                strokeDasharray={`${studyProgressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Habit Completion Metric */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Habit Consistency</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{completedHabits}</span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">/ {habits.length} habits</span>
            </div>
            <span className="mt-2 text-xs text-emerald-600 font-medium block">
              {habitPercent}% completed today
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Priority Tasks Metric */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Action Items (Today)</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{completedTasks}</span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">/ {todayTasks.length} tasks</span>
            </div>
            <span className="mt-2 text-xs text-indigo-600 font-medium block">
              {taskPercent}% execution rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Streak Counter Metric */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Unbroken Streak</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{currentStreak}</span>
              <span className="text-xs text-slate-400">days active</span>
            </div>
            <span className="mt-2 text-xs text-amber-700 font-medium block">
              Discipline compound effect
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Tasks & Habits) | Right Column (Daily Motivation & Vision Anchor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Tasks & Habits Strip */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Tasks Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today&apos;s Target Tasks</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>Linked to Sprint W43</span>
                  <span aria-hidden="true">·</span>
                  <span>{todayTasks.filter(t => !t.completed).length} pending</span>
                </div>
              </div>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingTask ? 'Cancel' : 'Add Task'}</span>
              </button>
            </div>

            {/* Quick Add Task Form */}
            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="mb-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <input
                  type="text"
                  placeholder="Task title (e.g. Solve 5 problems on Binary Trees)"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
                  autoFocus
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Subject</label>
                    <select
                      value={newTaskSubject}
                      onChange={e => setNewTaskSubject(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 bg-white border border-slate-300 rounded-md"
                    >
                      <option value="Data Structures">Data Structures</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Computer Networks">Computer Networks</option>
                      <option value="Web Development">Web Development</option>
                      <option value="General Study">General Study</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={e => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                      className="w-full text-xs px-2 py-1.5 bg-white border border-slate-300 rounded-md"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Normal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Est. Minutes</label>
                    <input
                      type="number"
                      min={10}
                      step={5}
                      value={newTaskMins}
                      onChange={e => setNewTaskMins(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Task Items List */}
            <div className="space-y-2">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No tasks scheduled for today. Click &quot;Add Task&quot; above to set your study goals!
                </div>
              ) : (
                todayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-slate-50/70 border-slate-200/60 opacity-70'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-snug ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>{task.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.estimatedMins} min</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-medium ${
                            task.priority === 'high'
                              ? 'text-rose-600'
                              : task.priority === 'medium'
                              ? 'text-amber-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Habits Fast-Check Strip */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today&apos;s Habit Checklist</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>Daily Discipline System</span>
                  <span aria-hidden="true">·</span>
                  <span>{completedHabits} of {habits.length} done</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('habits')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Habit Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {habits.map(habit => {
                const isDone = habit.history[TODAY_STR];
                return (
                  <button
                    key={habit.id}
                    onClick={() => onToggleHabit(habit.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${
                          isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium truncate">{habit.title}</span>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 shrink-0 ml-2">
                      {habit.currentStreak}d 🔥
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Daily Motivation & Hierarchy Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          {/* Motivation Quote Spotlight */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-xl border border-slate-800 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs text-indigo-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Vivek&apos;s Daily Prerna</span>
              </div>
              <button
                onClick={handleNextQuote}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors"
                title="Next inspirational thought"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Naya Vichar</span>
              </button>
            </div>

            {/* Hindi Shloka / Quote */}
            <p className="text-sm font-semibold text-amber-200/90 leading-relaxed italic mb-2">
              &ldquo;{currentQuote.hindiText}&rdquo;
            </p>

            {/* English translation */}
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {currentQuote.quote}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="font-semibold text-white">— {currentQuote.author}</span>
              <button
                onClick={onOpenMotivation}
                className="text-[11px] text-indigo-300 hover:text-indigo-200 font-medium underline underline-offset-2"
              >
                Instant Reset & Zen
              </button>
            </div>
          </div>

          {/* Long Vision to Daily Steps Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Vision Breakdown Path</h3>
                <div className="text-xs text-slate-500">Long Vision → Day Execution</div>
              </div>
              <button
                onClick={() => onNavigateTab('vision')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Vision Level */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-indigo-600">3-YEAR VISION (2026-2029)</span>
                  <span className="font-mono tabular-nums">42%</span>
                </div>
                <p className="text-xs font-medium text-slate-800">
                  Academic Honors & Dream Software Career
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              {/* Year 1 Milestone */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-indigo-600">YEAR 1 (2026) MILESTONE</span>
                  <span className="font-mono tabular-nums">68%</span>
                </div>
                <p className="text-xs font-medium text-slate-800">
                  CS Fundamentals, 350 DSA Problems & CGPA &gt; 9.0
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Current Month Milestone */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-emerald-600">MONTHLY (NOV 2026)</span>
                  <span className="font-mono tabular-nums">74%</span>
                </div>
                <p className="text-xs font-medium text-slate-800">
                  Trees, Graphs & OS Memory Management
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '74%' }} />
                </div>
              </div>

              {/* Current Week Sprint */}
              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center justify-between text-[11px] text-indigo-700 mb-1">
                  <span className="font-semibold">WEEK 43 SPRINT</span>
                  <span className="font-mono tabular-nums">28.5 / 36h (79%)</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  25 Problems + OS Memory + 36 Study Hours
                </p>
                <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '79%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Study Focus Timer Quick Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                Focus Mode & Pomodoro
              </span>
              <p className="text-xs text-slate-500">
                Built-in timer with ambient study sounds (Rain, 40Hz)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('study')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Open Timer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

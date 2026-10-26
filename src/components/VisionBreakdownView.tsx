import React, { useState } from 'react';
import {
  VisionGoal,
  YearlyGoal,
  MonthlyMilestone,
  WeeklySprint,
  DailyTask,
  TODAY_STR,
} from '../types';
import {
  Target,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowDown,
  Trash2,
  Check,
  Edit2,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface VisionBreakdownViewProps {
  visions: VisionGoal[];
  yearlyGoals: YearlyGoal[];
  monthlyMilestones: MonthlyMilestone[];
  weeklySprints: WeeklySprint[];
  dailyTasks: DailyTask[];
  onAddVision: (vision: Omit<VisionGoal, 'id' | 'progress'>) => void;
  onAddYearlyGoal: (goal: Omit<YearlyGoal, 'id' | 'progress'>) => void;
  onAddMonthlyMilestone: (milestone: Omit<MonthlyMilestone, 'id' | 'progress'>) => void;
  onAddWeeklySprint: (sprint: Omit<WeeklySprint, 'id' | 'progress' | 'completedStudyHours'>) => void;
  onAddTask: (task: Omit<DailyTask, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const VisionBreakdownView: React.FC<VisionBreakdownViewProps> = ({
  visions,
  yearlyGoals,
  monthlyMilestones,
  weeklySprints,
  dailyTasks,
  onAddVision,
  onAddYearlyGoal,
  onAddMonthlyMilestone,
  onAddWeeklySprint,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  // Selected IDs for active drilldown
  const [selectedVisionId, setSelectedVisionId] = useState<string>(visions[0]?.id || '');
  const [selectedYearId, setSelectedYearId] = useState<string>(yearlyGoals[0]?.id || '');
  const [selectedMonthId, setSelectedMonthId] = useState<string>(monthlyMilestones[0]?.id || '');
  const [selectedSprintId, setSelectedSprintId] = useState<string>(weeklySprints[0]?.id || '');

  // Modal / Form states
  const [showAddModal, setShowAddModal] = useState<null | 'vision' | 'yearly' | 'monthly' | 'sprint' | 'task'>(null);

  // Form temporary inputs
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formYear, setFormYear] = useState(2026);
  const [formMetric, setFormMetric] = useState('');
  const [formHours, setFormHours] = useState(35);
  const [formSubject, setFormSubject] = useState('Data Structures');

  // Filtered children based on active hierarchy selections
  const currentVision = visions.find(v => v.id === selectedVisionId) || visions[0];
  const relevantYearlyGoals = yearlyGoals.filter(y => y.visionId === selectedVisionId);
  const currentYearlyGoal = yearlyGoals.find(y => y.id === selectedYearId) || relevantYearlyGoals[0];
  
  const relevantMonths = monthlyMilestones.filter(m => m.yearlyGoalId === (currentYearlyGoal?.id || ''));
  const currentMonth = monthlyMilestones.find(m => m.id === selectedMonthId) || relevantMonths[0];

  const relevantSprints = weeklySprints.filter(w => w.monthlyMilestoneId === (currentMonth?.id || ''));
  const currentSprint = weeklySprints.find(w => w.id === selectedSprintId) || relevantSprints[0];

  const relevantTasks = dailyTasks.filter(t => t.sprintId === currentSprint?.id);

  // Handlers for adding items
  const handleCreateVision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    onAddVision({
      title: formTitle.trim(),
      horizonYears: formDesc || '2026 - 2029 (3 Years)',
      description: formDesc || 'Long-term goal and vision',
      category: 'Career & Academics',
      targetDate: '2029-12-31',
      color: '#4F46E5',
    });
    setFormTitle('');
    setFormDesc('');
    setShowAddModal(null);
    soundManager.playCheckmarkSound();
  };

  const handleCreateYearlyGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !selectedVisionId) return;
    onAddYearlyGoal({
      visionId: selectedVisionId,
      year: Number(formYear),
      title: formTitle.trim(),
      keyOutcomes: [formDesc || 'Core target completed'],
      targetMetric: formMetric || 'Academic & Skill goals reached',
      status: 'in_progress',
    });
    setFormTitle('');
    setFormDesc('');
    setShowAddModal(null);
    soundManager.playCheckmarkSound();
  };

  const handleCreateMonthlyMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !currentYearlyGoal) return;
    onAddMonthlyMilestone({
      yearlyGoalId: currentYearlyGoal.id,
      year: currentYearlyGoal.year,
      month: 11,
      monthName: formTitle.trim(),
      title: formTitle.trim(),
      focusArea: formDesc || 'Target subject mastery',
      status: 'in_progress',
    });
    setFormTitle('');
    setFormDesc('');
    setShowAddModal(null);
    soundManager.playCheckmarkSound();
  };

  const handleCreateWeeklySprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !currentMonth) return;
    onAddWeeklySprint({
      monthlyMilestoneId: currentMonth.id,
      weekNumber: 44,
      startDate: TODAY_STR,
      endDate: TODAY_STR,
      title: formTitle.trim(),
      targetStudyHours: Number(formHours),
      status: 'in_progress',
    });
    setFormTitle('');
    setShowAddModal(null);
    soundManager.playCheckmarkSound();
  };

  const handleCreateDailyTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    onAddTask({
      sprintId: currentSprint?.id,
      title: formTitle.trim(),
      subject: formSubject,
      priority: 'high',
      estimatedMins: 60,
      completedMins: 0,
      completed: false,
      date: TODAY_STR,
    });
    setFormTitle('');
    setShowAddModal(null);
    soundManager.playCheckmarkSound();
  };

  return (
    <div className="space-y-6">
      {/* Header & Concept Explainer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <Layers className="w-4 h-4" />
              <span>Hierarchical Breakdown Architecture</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Vivek&apos;s Vision Cascade: Long Vision → 1-Year → Month → Week → Day
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              &ldquo;Koi bhi bada lakshya tab asan hota hai jab use 1-1 saal ke milestones, mahino ke topics, hafte ke sprints aur roz ke 2-3 ghante ke action tasks me baant diya jaye.&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal('vision')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Long Vision</span>
            </button>
          </div>
        </div>

        {/* Visual Breadcrumb Cascade of Current Active Selection */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Active Hierarchy Path:</span>
          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
            {currentVision?.title || '3-Year Vision'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {currentYearlyGoal?.title || 'Year 1 (2026)'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            {currentMonth?.title || 'November 2026'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            {currentSprint?.title || 'Week 43 Sprint'}
          </span>
        </div>
      </div>

      {/* 5-Level Cascade Drilldown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Levels 1, 2, 3 Selector */}
        <div className="lg:col-span-5 space-y-6">
          {/* Level 1: Long Vision (3-5 Years) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Level 1 · Long Vision (3-5 Yrs)
                </span>
              </div>
              <span className="text-xs text-slate-500">{visions.length} Visions</span>
            </div>

            <div className="space-y-2">
              {visions.map(v => {
                const isSelected = v.id === selectedVisionId;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVisionId(v.id);
                      const matchingYear = yearlyGoals.find(y => y.visionId === v.id);
                      if (matchingYear) setSelectedYearId(matchingYear.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-900">{v.title}</span>
                      <span className="font-mono tabular-nums text-indigo-600 font-bold">{v.progress}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{v.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                      <span>{v.horizonYears}</span>
                      <span aria-hidden="true">·</span>
                      <span>Target: {v.targetDate}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 2: 1-Year Milestones (1 Year at a time) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Level 2 · 1-Year Breakdown
                </span>
                <p className="text-[11px] text-slate-400">Broken into 1-Year sequential targets</p>
              </div>
              <button
                onClick={() => setShowAddModal('yearly')}
                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                title="Add 1-Year Goal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {relevantYearlyGoals.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No 1-year goals for this vision. Click + to add Year 1.
                </div>
              ) : (
                relevantYearlyGoals.map(y => {
                  const isSelected = y.id === selectedYearId;
                  return (
                    <button
                      key={y.id}
                      onClick={() => {
                        setSelectedYearId(y.id);
                        const matchingMonth = monthlyMilestones.find(m => m.yearlyGoalId === y.id);
                        if (matchingMonth) setSelectedMonthId(matchingMonth.id);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold">{y.title}</span>
                        <span className={`font-mono tabular-nums text-xs ${isSelected ? 'text-indigo-300' : 'text-indigo-600'}`}>
                          {y.progress}%
                        </span>
                      </div>
                      <div className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        Target: {y.targetMetric}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Level 3: Monthly Milestones */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Level 3 · Monthly Focus
                </span>
                <p className="text-[11px] text-slate-400">Curriculum &amp; topic sprint for the month</p>
              </div>
              <button
                onClick={() => setShowAddModal('monthly')}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                title="Add Monthly Milestone"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {relevantMonths.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No monthly milestone set. Click + to add month.
                </div>
              ) : (
                relevantMonths.map(m => {
                  const isSelected = m.id === selectedMonthId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMonthId(m.id);
                        const matchingSprint = weeklySprints.find(s => s.monthlyMilestoneId === m.id);
                        if (matchingSprint) setSelectedSprintId(matchingSprint.id);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{m.title}</span>
                        <span className="font-mono tabular-nums text-emerald-600 font-bold">{m.progress}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Focus: {m.focusArea}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Levels 4 & 5 (Weekly Sprint & Daily Execution Tasks) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Level 4: Weekly Sprint */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Level 4 · Weekly Sprint
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {currentSprint?.title || 'Weekly Sprint Target'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal('sprint')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Sprint</span>
              </button>
            </div>

            {/* Weekly Target Progress bar */}
            {currentSprint && (
              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80 mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Weekly Study Hours Target</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">
                    {currentSprint.completedStudyHours}h / {currentSprint.targetStudyHours}h ({currentSprint.progress}%)
                  </span>
                </div>
                <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, currentSprint.progress)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Sprint switcher tabs if multiple sprints exist */}
            {relevantSprints.length > 1 && (
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {relevantSprints.map(sprint => (
                  <button
                    key={sprint.id}
                    onClick={() => setSelectedSprintId(sprint.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                      sprint.id === currentSprint?.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Week {sprint.weekNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level 5: Daily Action Items (The Daily Execution Layer) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Level 5 · Daily Action Tasks
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Day Execution Engine ({relevantTasks.filter(t => t.completed).length}/{relevantTasks.length} Done)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Completing these tasks directly rolls up into Sprint &amp; Monthly progress!
                </p>
              </div>
              <button
                onClick={() => setShowAddModal('task')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Daily Task</span>
              </button>
            </div>

            {/* Daily Tasks List */}
            <div className="space-y-2">
              {relevantTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No daily tasks assigned to this weekly sprint yet. Click &quot;Add Daily Task&quot; above!
                </div>
              ) : (
                relevantTasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between gap-3 p-3.5 rounded-lg border transition-all ${
                      task.completed
                        ? 'bg-slate-50/70 border-slate-200/60 opacity-70'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">{task.subject}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{task.estimatedMins} min</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              task.priority === 'high'
                                ? 'text-rose-600 font-semibold'
                                : task.priority === 'medium'
                                ? 'text-amber-600'
                                : 'text-slate-500'
                            }
                          >
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 transition-colors shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Creation Modal for Any Level */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {showAddModal === 'vision' && 'Add Long-Term Vision (3-5 Years)'}
              {showAddModal === 'yearly' && 'Add 1-Year Goal Milestone'}
              {showAddModal === 'monthly' && 'Add Monthly Milestone'}
              {showAddModal === 'sprint' && 'Add Weekly Sprint'}
              {showAddModal === 'task' && 'Add Daily Task'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter target details below to keep Vivek&apos;s study roadmap aligned.
            </p>

            <form
              onSubmit={
                showAddModal === 'vision'
                  ? handleCreateVision
                  : showAddModal === 'yearly'
                  ? handleCreateYearlyGoal
                  : showAddModal === 'monthly'
                  ? handleCreateMonthlyMilestone
                  : showAddModal === 'sprint'
                  ? handleCreateWeeklySprint
                  : handleCreateDailyTask
              }
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Title / Milestone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Operating Systems & Networking"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
                  autoFocus
                />
              </div>

              {showAddModal === 'yearly' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Target Year</label>
                    <input
                      type="number"
                      value={formYear}
                      onChange={e => setFormYear(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Target Metric</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% syllabus + 300 DSA"
                      value={formMetric}
                      onChange={e => setFormMetric(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                </div>
              )}

              {showAddModal === 'sprint' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Weekly Target Study Hours</label>
                  <input
                    type="number"
                    min={10}
                    max={80}
                    value={formHours}
                    onChange={e => setFormHours(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono tabular-nums"
                  />
                </div>
              )}

              {showAddModal === 'task' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    <option value="Data Structures">Data Structures</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Web Development">Web Development</option>
                    <option value="General Revision">General Revision</option>
                  </select>
                </div>
              )}

              {showAddModal !== 'task' && showAddModal !== 'sprint' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Focus / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of key outcome..."
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save to Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

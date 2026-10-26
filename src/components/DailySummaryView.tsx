import React, { useState } from 'react';
import {
  DailySummary,
  DailyTask,
  Habit,
  StudySession,
  UserProfile,
  TODAY_STR,
} from '../types';
import {
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Save,
  Copy,
  Calendar,
  Flame,
  Star,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface DailySummaryViewProps {
  user: UserProfile;
  tasks: DailyTask[];
  habits: Habit[];
  sessions: StudySession[];
  summaries: DailySummary[];
  onSaveSummary: (summary: DailySummary) => void;
}

export const DailySummaryView: React.FC<DailySummaryViewProps> = ({
  user,
  tasks,
  habits,
  sessions,
  summaries,
  onSaveSummary,
}) => {
  // Today's metrics computation
  const todaySessions = sessions.filter(s => s.date === TODAY_STR);
  const studyMinsToday = todaySessions.reduce((acc, s) => acc + s.durationMins, 0);
  const studyTargetMins = user.dailyStudyTargetHours * 60;

  const todayTasks = tasks.filter(t => t.date === TODAY_STR);
  const completedTasks = todayTasks.filter(t => t.completed).length;

  const completedHabits = habits.filter(h => h.history[TODAY_STR]).length;

  // Auto-calculated score
  const studyRatio = Math.min(1, studyMinsToday / (studyTargetMins || 1));
  const habitRatio = habits.length > 0 ? completedHabits / habits.length : 1;
  const taskRatio = todayTasks.length > 0 ? completedTasks / todayTasks.length : 1;
  const compositeScore = Math.round(((studyRatio * 0.45) + (habitRatio * 0.3) + (taskRatio * 0.25)) * 100);

  let grade: 'A+' | 'A' | 'B+' | 'B' | 'Needs Focus' = 'A';
  if (compositeScore >= 90) grade = 'A+';
  else if (compositeScore >= 80) grade = 'A';
  else if (compositeScore >= 70) grade = 'B+';
  else if (compositeScore >= 60) grade = 'B';
  else grade = 'Needs Focus';

  // State for evening reflection form
  const existingTodaySummary = summaries.find(s => s.date === TODAY_STR);

  const [reflectionWin, setReflectionWin] = useState(
    existingTodaySummary?.reflectionWin || 'Completed core DSA problems and focused 4+ hours uninterrupted.'
  );
  const [reflectionImprovement, setReflectionImprovement] = useState(
    existingTodaySummary?.reflectionImprovement || 'Keep phone strictly in another room during the afternoon session.'
  );
  const [priority1, setPriority1] = useState(existingTodaySummary?.tomorrowPriorities[0] || 'Graph Traversal Algorithms');
  const [priority2, setPriority2] = useState(existingTodaySummary?.tomorrowPriorities[1] || 'Operating Systems Semaphores Practice');
  const [priority3, setPriority3] = useState(existingTodaySummary?.tomorrowPriorities[2] || '30 Min Morning Workout & Run');
  const [energyRating, setEnergyRating] = useState(existingTodaySummary?.energyRating || 5);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [expandedSummaryDate, setExpandedSummaryDate] = useState<string | null>(null);

  // Motivational AI/Coaching synthesis based on data
  const getMotivationalFeedback = () => {
    if (compositeScore >= 85) {
      return `Zabardast kaam, Vivek! Aaj aapne ${((studyMinsToday / 60)).toFixed(1)} ghante study aur ${completedHabits} habits complete kiye. Ye consistency hi topper banati hai. Kal isi momentum ko banaye rakhein!`;
    } else if (compositeScore >= 70) {
      return `Solid effort today, Vivek! Aapne ${(studyMinsToday / 60).toFixed(1)} ghante padhai ki. Thoda sa distraction control aur kal 6:00 AM session hit karke 90%+ score achieve ho jayega.`;
    } else {
      return `Vivek, haar nahi manna hai! Jo thoda bacha hai, use kal subah early slot me cover karein. Ek naya din, ek naya sankalp. Focus on tomorrow's first 2 hours.`;
    }
  };

  const handleSave = () => {
    const summary: DailySummary = {
      date: TODAY_STR,
      studyMinutes: studyMinsToday,
      studyTargetMinutes: studyTargetMins,
      habitsCompleted: completedHabits,
      habitsTotal: habits.length,
      tasksCompleted: completedTasks,
      tasksTotal: todayTasks.length,
      reflectionWin,
      reflectionImprovement,
      tomorrowPriorities: [priority1, priority2, priority3].filter(p => p.trim() !== ''),
      energyRating,
      grade,
      quote: getMotivationalFeedback(),
      savedAt: new Date().toISOString(),
    };
    onSaveSummary(summary);
    soundManager.playSuccessFanfare();
  };

  const handleCopyReport = () => {
    const reportText = `📋 *LAKSHYA DAILY BRIEFING - ${TODAY_STR}*
👤 *Student:* ${user.name}
🎯 *Grade:* ${grade} (${compositeScore}/100)
⏱️ *Study Hours:* ${(studyMinsToday / 60).toFixed(1)}h / ${user.dailyStudyTargetHours}h target
✅ *Habits Done:* ${completedHabits}/${habits.length}
📝 *Tasks Completed:* ${completedTasks}/${todayTasks.length}

🏆 *Biggest Win:* ${reflectionWin}
⚠️ *Lesson/Improvement:* ${reflectionImprovement}
🚀 *Tomorrow's Top 3 Targets:*
1. ${priority1}
2. ${priority2}
3. ${priority3}

💡 *Motivation:* "${getMotivationalFeedback()}"`;

    navigator.clipboard.writeText(reportText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
    soundManager.playCheckmarkSound();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Daily Performance &amp; Reflection Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Vivek&apos;s Daily Executive Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Auto-synthesized briefing for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedNotice ? 'Copied to Clipboard!' : 'Copy Daily Report'}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Summary</span>
          </button>
        </div>
      </div>

      {/* Today's Auto-Generated Executive Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-1">
              Today&apos;s Performance Evaluation
            </div>
            <h2 className="text-2xl font-bold text-white">
              Daily Grade: <span className="text-amber-400">{grade}</span> ({compositeScore}/100)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {getMotivationalFeedback()}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Execution Rate</span>
              <span className="text-2xl font-mono tabular-nums font-bold text-white">
                {compositeScore}%
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 block">Study Hours</span>
            <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
              {(studyMinsToday / 60).toFixed(1)}h / {user.dailyStudyTargetHours}h
            </div>
            <span className="text-[11px] text-indigo-300 block mt-1">
              {studyRatio >= 1 ? '100% Target Met' : `${Math.round(studyRatio * 100)}% of goal`}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 block">Habits Checked</span>
            <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
              {completedHabits} / {habits.length}
            </div>
            <span className="text-[11px] text-emerald-300 block mt-1">
              {Math.round(habitRatio * 100)}% Consistency
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 block">Action Tasks Done</span>
            <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
              {completedTasks} / {todayTasks.length}
            </div>
            <span className="text-[11px] text-amber-300 block mt-1">
              {Math.round(taskRatio * 100)}% Task completion
            </span>
          </div>
        </div>
      </div>

      {/* Evening Reflection & Next Day Planning Inputs */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Evening Reflection &amp; Tomorrow&apos;s Battle Plan
            </h3>
            <p className="text-xs text-slate-500">
              Take 2 minutes to review your day like a top performer.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-2">Energy:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setEnergyRating(star)}
                className="text-amber-400 hover:scale-110 transition-transform"
              >
                <Star className={`w-4 h-4 ${star <= energyRating ? 'fill-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              🏆 Aaj ka sabse bada win kya tha? (Today&apos;s Victory)
            </label>
            <textarea
              rows={3}
              value={reflectionWin}
              onChange={e => setReflectionWin(e.target.value)}
              placeholder="e.g. Mastered BST traversals and stayed focused without opening social media."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              ⚠️ Kahan time leak hua aur kal kaise sudharein? (Improvement Area)
            </label>
            <textarea
              rows={3}
              value={reflectionImprovement}
              onChange={e => setReflectionImprovement(e.target.value)}
              placeholder="e.g. Spent 30 minutes scrolling after lunch. Tomorrow, leave desk immediately and take a walk."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tomorrow's Top 3 Non-Negotiables */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            🚀 Kal Ke Top 3 Non-Negotiable Targets (Tomorrow&apos;s Priorities)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Priority 1: e.g. Graph BFS problems"
              value={priority1}
              onChange={e => setPriority1(e.target.value)}
              className="text-xs p-2.5 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Priority 2: e.g. OS Semaphores"
              value={priority2}
              onChange={e => setPriority2(e.target.value)}
              className="text-xs p-2.5 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Priority 3: e.g. 30m Workout"
              value={priority3}
              onChange={e => setPriority3(e.target.value)}
              className="text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Lock In Today&apos;s Summary</span>
          </button>
        </div>
      </div>

      {/* Archive of Past Summaries */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Past Summaries Archive
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Review past days to verify your compounding consistency.
        </p>

        <div className="space-y-3">
          {summaries.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No previous daily summaries saved yet. Save today&apos;s summary above!
            </div>
          ) : (
            summaries.map(s => {
              const isExpanded = expandedSummaryDate === s.date;
              return (
                <div
                  key={s.date}
                  className="rounded-lg border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedSummaryDate(isExpanded ? null : s.date)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900">{s.date}</span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                        Grade {s.grade}
                      </span>
                      <span className="text-xs text-slate-500 font-mono tabular-nums">
                        {(s.studyMinutes / 60).toFixed(1)}h study · {s.habitsCompleted}/{s.habitsTotal} habits
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white space-y-3 border-t border-slate-200 text-xs text-slate-700">
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">Big Win:</span>
                        <p className="text-slate-600">{s.reflectionWin}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">Improvement Note:</span>
                        <p className="text-slate-600">{s.reflectionImprovement}</p>
                      </div>
                      {s.tomorrowPriorities && s.tomorrowPriorities.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-900 block mb-0.5">Target Priorities:</span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                            {s.tomorrowPriorities.map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

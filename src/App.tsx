/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  VisionGoal,
  YearlyGoal,
  MonthlyMilestone,
  WeeklySprint,
  DailyTask,
  Habit,
  StudySession,
  DailySummary,
  ReminderItem,
  MotivationQuote,
  TODAY_STR,
} from './types';
import { storage, MOTIVATION_QUOTES } from './utils/storage';
import { soundManager } from './utils/sound';
import { notificationSystem } from './utils/notifications';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { VisionBreakdownView } from './components/VisionBreakdownView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { HabitsView } from './components/HabitsView';
import { VisualGraphsView } from './components/VisualGraphsView';
import { DailySummaryView } from './components/DailySummaryView';
import { RemindersModal } from './components/RemindersModal';
import { MotivationModal } from './components/MotivationModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modals
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isMotivationOpen, setIsMotivationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Core Data States
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [visions, setVisions] = useState<VisionGoal[]>(() => storage.getVisions());
  const [yearlyGoals, setYearlyGoals] = useState<YearlyGoal[]>(() => storage.getYearlyGoals());
  const [monthlyMilestones, setMonthlyMilestones] = useState<MonthlyMilestone[]>(() => storage.getMonthlyMilestones());
  const [weeklySprints, setWeeklySprints] = useState<WeeklySprint[]>(() => storage.getWeeklySprints());
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => storage.getDailyTasks());
  const [habits, setHabits] = useState<Habit[]>(() => storage.getHabits());
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => storage.getStudySessions());
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>(() => storage.getDailySummaries());
  const [reminders, setReminders] = useState<ReminderItem[]>(() => storage.getReminders());

  // In-app toast banner if a notification fires
  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);

  // Setup Notification Watcher
  useEffect(() => {
    notificationSystem.startReminderWatcher(() => reminders);
    const unsubscribe = notificationSystem.onNotification(msg => {
      setActiveToast({ title: msg.title, body: msg.body });
      setTimeout(() => setActiveToast(null), 6000);
    });

    return () => {
      unsubscribe();
      notificationSystem.stopReminderWatcher();
    };
  }, [reminders]);

  // Sync to localStorage whenever states change
  useEffect(() => {
    storage.saveUser(user);
  }, [user]);

  useEffect(() => {
    storage.saveVisions(visions);
  }, [visions]);

  useEffect(() => {
    storage.saveYearlyGoals(yearlyGoals);
  }, [yearlyGoals]);

  useEffect(() => {
    storage.saveMonthlyMilestones(monthlyMilestones);
  }, [monthlyMilestones]);

  useEffect(() => {
    storage.saveWeeklySprints(weeklySprints);
  }, [weeklySprints]);

  useEffect(() => {
    storage.saveDailyTasks(dailyTasks);
  }, [dailyTasks]);

  useEffect(() => {
    storage.saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    storage.saveStudySessions(studySessions);
  }, [studySessions]);

  useEffect(() => {
    storage.saveDailySummaries(dailySummaries);
  }, [dailySummaries]);

  useEffect(() => {
    storage.saveReminders(reminders);
  }, [reminders]);

  // Reload all data (used after JSON import or Reset)
  const reloadAllData = () => {
    setUser(storage.getUser());
    setVisions(storage.getVisions());
    setYearlyGoals(storage.getYearlyGoals());
    setMonthlyMilestones(storage.getMonthlyMilestones());
    setWeeklySprints(storage.getWeeklySprints());
    setDailyTasks(storage.getDailyTasks());
    setHabits(storage.getHabits());
    setStudySessions(storage.getStudySessions());
    setDailySummaries(storage.getDailySummaries());
    setReminders(storage.getReminders());
  };

  // Handlers for Tasks with Progress Rollup
  const handleToggleTask = (taskId: string) => {
    soundManager.playCheckmarkSound();
    setDailyTasks(prev => {
      const updated = prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      
      // Rollup calculation for the associated sprint
      const targetTask = updated.find(t => t.id === taskId);
      if (targetTask?.sprintId) {
        const sprintTasks = updated.filter(t => t.sprintId === targetTask.sprintId);
        const done = sprintTasks.filter(t => t.completed).length;
        const newProgress = Math.round((done / sprintTasks.length) * 100);

        setWeeklySprints(prevSprints =>
          prevSprints.map(s => (s.id === targetTask.sprintId ? { ...s, progress: newProgress } : s))
        );
      }
      return updated;
    });
  };

  const handleAddTask = (taskData: Omit<DailyTask, 'id'>) => {
    const newTask: DailyTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setDailyTasks(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setDailyTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Handlers for Habits
  const handleToggleHabit = (habitId: string) => {
    soundManager.playCheckmarkSound();
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const currentDone = !!h.history[TODAY_STR];
        const nextDone = !currentDone;
        const nextHistory = { ...h.history, [TODAY_STR]: nextDone };
        const nextStreak = nextDone ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
        const nextBest = Math.max(h.bestStreak, nextStreak);

        return {
          ...h,
          currentStreak: nextStreak,
          bestStreak: nextBest,
          history: nextHistory,
        };
      })
    );
  };

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'history'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      bestStreak: 0,
      history: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  // Handlers for Study Sessions
  const handleAddStudySession = (sessionData: Omit<StudySession, 'id' | 'timestamp'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setStudySessions(prev => [newSession, ...prev]);

    // Also update Weekly Sprint completed hours
    setWeeklySprints(prev =>
      prev.map(s => {
        if (s.id === 'sprint-w43') {
          const addedHours = Number((sessionData.durationMins / 60).toFixed(1));
          const newHours = Number((s.completedStudyHours + addedHours).toFixed(1));
          const newProgress = Math.min(100, Math.round((newHours / s.targetStudyHours) * 100));
          return {
            ...s,
            completedStudyHours: newHours,
            progress: newProgress,
          };
        }
        return s;
      })
    );
  };

  // Handlers for Vision Hierarchy
  const handleAddVision = (v: Omit<VisionGoal, 'id' | 'progress'>) => {
    const newVision: VisionGoal = {
      ...v,
      id: `vision-${Date.now()}`,
      progress: 0,
    };
    setVisions(prev => [...prev, newVision]);
  };

  const handleAddYearlyGoal = (y: Omit<YearlyGoal, 'id' | 'progress'>) => {
    const newYearly: YearlyGoal = {
      ...y,
      id: `year-${Date.now()}`,
      progress: 0,
    };
    setYearlyGoals(prev => [...prev, newYearly]);
  };

  const handleAddMonthlyMilestone = (m: Omit<MonthlyMilestone, 'id' | 'progress'>) => {
    const newMonth: MonthlyMilestone = {
      ...m,
      id: `month-${Date.now()}`,
      progress: 0,
    };
    setMonthlyMilestones(prev => [...prev, newMonth]);
  };

  const handleAddWeeklySprint = (w: Omit<WeeklySprint, 'id' | 'progress' | 'completedStudyHours'>) => {
    const newSprint: WeeklySprint = {
      ...w,
      id: `sprint-${Date.now()}`,
      completedStudyHours: 0,
      progress: 0,
    };
    setWeeklySprints(prev => [...prev, newSprint]);
  };

  // Handlers for Daily Summary
  const handleSaveSummary = (summary: DailySummary) => {
    setDailySummaries(prev => {
      const filtered = prev.filter(s => s.date !== summary.date);
      return [summary, ...filtered];
    });
  };

  // Handlers for Reminders
  const handleToggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleAddReminder = (remData: Omit<ReminderItem, 'id'>) => {
    const newRem: ReminderItem = {
      ...remData,
      id: `rem-${Date.now()}`,
    };
    setReminders(prev => [...prev, newRem]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const currentStreak = Math.max(...habits.map(h => h.currentStreak), 14);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenMotivation={() => setIsMotivationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        streakCount={currentStreak}
      />

      {/* In-app Toast for Reminders */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 max-w-sm flex items-start gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            ⏰
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white">{activeToast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5">{activeToast.body}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            user={user}
            tasks={dailyTasks}
            habits={habits}
            sessions={studySessions}
            quotes={MOTIVATION_QUOTES}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onToggleHabit={handleToggleHabit}
            onNavigateTab={setCurrentTab}
            onStartFocus={duration => {
              setCurrentTab('study');
            }}
            onOpenMotivation={() => setIsMotivationOpen(true)}
          />
        )}

        {currentTab === 'vision' && (
          <VisionBreakdownView
            visions={visions}
            yearlyGoals={yearlyGoals}
            monthlyMilestones={monthlyMilestones}
            weeklySprints={weeklySprints}
            dailyTasks={dailyTasks}
            onAddVision={handleAddVision}
            onAddYearlyGoal={handleAddYearlyGoal}
            onAddMonthlyMilestone={handleAddMonthlyMilestone}
            onAddWeeklySprint={handleAddWeeklySprint}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'study' && (
          <StudyPlannerView
            sessions={studySessions}
            onAddSession={handleAddStudySession}
            targetDailyHours={user.dailyStudyTargetHours}
          />
        )}

        {currentTab === 'habits' && (
          <HabitsView
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
          />
        )}

        {currentTab === 'graphs' && (
          <VisualGraphsView
            user={user}
            sessions={studySessions}
            habits={habits}
            tasks={dailyTasks}
            visions={visions}
            yearlyGoals={yearlyGoals}
            monthlyMilestones={monthlyMilestones}
            weeklySprints={weeklySprints}
          />
        )}

        {currentTab === 'summary' && (
          <DailySummaryView
            user={user}
            tasks={dailyTasks}
            habits={habits}
            sessions={studySessions}
            summaries={dailySummaries}
            onSaveSummary={handleSaveSummary}
          />
        )}
      </main>

      {/* Footer (Quiet copyright and student affirmation) */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lakshya OS · Crafted for Vivek Yadav</span>
          <span className="text-slate-400">
            &ldquo;Discipline is choosing between what you want now and what you want most.&rdquo;
          </span>
        </div>
      </footer>

      {/* Modals */}
      {isRemindersOpen && (
        <RemindersModal
          reminders={reminders}
          onToggleReminder={handleToggleReminder}
          onAddReminder={handleAddReminder}
          onDeleteReminder={handleDeleteReminder}
          onClose={() => setIsRemindersOpen(false)}
        />
      )}

      {isMotivationOpen && (
        <MotivationModal
          quotes={MOTIVATION_QUOTES}
          user={user}
          onClose={() => setIsMotivationOpen(false)}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          user={user}
          onUpdateUser={setUser}
          onReloadAllData={reloadAllData}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}

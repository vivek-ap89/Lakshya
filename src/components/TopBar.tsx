import React from 'react';
import { Target, Bell, Flame, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  onOpenReminders: () => void;
  onOpenMotivation: () => void;
  onOpenProfile: () => void;
  streakCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenReminders,
  onOpenMotivation,
  onOpenProfile,
  streakCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'vision', label: 'Vision Breakdown' },
    { id: 'study', label: 'Study & Timer' },
    { id: 'habits', label: 'Habits' },
    { id: 'graphs', label: 'Visual Graphs' },
    { id: 'summary', label: 'Daily Summary' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-slate-900 group hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
              Lakshya OS
            </span>
            <span className="text-[11px] font-medium text-slate-500 block leading-tight">
              {user.name}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, concise) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak indicator */}
          <div
            title="Consistent days streak"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-md text-xs font-semibold tabular-nums"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{streakCount}d</span>
          </div>

          {/* Quick Motivation modal trigger */}
          <button
            onClick={onOpenMotivation}
            title="Instant Motivation Boost"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Reminders trigger */}
          <button
            onClick={onOpenReminders}
            title="Notification Reminders"
            className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
          </button>

          {/* Profile / Settings */}
          <button
            onClick={onOpenProfile}
            title="Vivek's Profile & Data Backup"
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
              onError={e => {
                // fallback to avatar icon if image path fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-nav strip for narrow screens */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-100 bg-slate-50/80">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
              currentTab === item.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

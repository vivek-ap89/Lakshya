import React, { useState } from 'react';
import { ReminderItem } from '../types';
import {
  Bell,
  Clock,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { notificationSystem } from '../utils/notifications';

interface RemindersModalProps {
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (rem: Omit<ReminderItem, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
  onClose: () => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  onClose,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(
    notificationSystem.getPermissionStatus()
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('17:00');
  const [newSound, setNewSound] = useState(true);

  const handleRequestPermission = async () => {
    const granted = await notificationSystem.requestPermission();
    setPermissionStatus(notificationSystem.getPermissionStatus());
    if (granted) {
      notificationSystem.send(
        '🔔 Lakshya Reminders Active!',
        'Vivek, notifications are enabled. You will receive study & habit alerts on time.',
        true
      );
    }
  };

  const handleTestSound = () => {
    soundManager.playTimerBell();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReminder({
      title: newTitle.trim(),
      time: newTime,
      type: 'custom',
      active: true,
      days: [0, 1, 2, 3, 4, 5, 6],
      soundEnabled: newSound,
    });
    setNewTitle('');
    setIsAdding(false);
    soundManager.playCheckmarkSound();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Notification &amp; Reminder System
              </h2>
              <span className="text-xs text-slate-500">
                Scheduled study alerts &amp; habit prompts for Vivek
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Prompt Banner */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              {permissionStatus === 'granted' ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              )}
              Browser Desktop Notifications
            </span>
            <p className="text-[11px] text-slate-500">
              {permissionStatus === 'granted'
                ? 'Desktop alerts are enabled for scheduled alarms.'
                : 'Enable browser permission to receive alerts even when app is in another tab.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {permissionStatus !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Enable Alerts
              </button>
            )}
            <button
              onClick={handleTestSound}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3 text-indigo-600" />
              <span>Test Bell</span>
            </button>
          </div>
        </div>

        {/* Add Reminder Toggle */}
        <div className="flex items-center justify-between my-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active Scheduled Alarms
          </span>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Cancel' : 'Add Custom Reminder'}</span>
          </button>
        </div>

        {/* New Reminder Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 mb-4 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Reminder Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Physics Formula Sheet Revision"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Alarm Time
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={newSound}
                    onChange={e => setNewSound(e.target.checked)}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Audio Chime</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Save Reminder
              </button>
            </div>
          </form>
        )}

        {/* Reminders List */}
        <div className="space-y-2.5">
          {reminders.map(rem => (
            <div
              key={rem.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                rem.active
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    rem.active ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      rem.active ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {rem.title}
                    </span>
                    {rem.soundEnabled && (
                      <Volume2 className="w-3 h-3 text-indigo-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    Daily at {rem.time}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDeleteReminder(rem.id)}
                className="text-slate-300 hover:text-rose-600 p-1.5 transition-colors shrink-0"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

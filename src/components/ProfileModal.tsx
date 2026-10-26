import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  User,
  Save,
  Download,
  Upload,
  RotateCcw,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/sound';

interface ProfileModalProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onReloadAllData: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onUpdateUser,
  onReloadAllData,
  onClose,
}) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [targetExam, setTargetExam] = useState(user.targetExam);
  const [targetHours, setTargetHours] = useState(user.dailyStudyTargetHours);
  const [wakeTime, setWakeTime] = useState(user.wakeTime);
  const [visionStatement, setVisionStatement] = useState(user.visionStatement);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim(),
      role: role.trim(),
      targetExam: targetExam.trim(),
      dailyStudyTargetHours: Number(targetHours),
      wakeTime,
      visionStatement: visionStatement.trim(),
    });
    soundManager.playCheckmarkSound();
    onClose();
  };

  const handleExport = () => {
    const jsonStr = storage.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lakshya_backup_vivek_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    soundManager.playCheckmarkSound();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = storage.importDataJson(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        soundManager.playSuccessFanfare();
        setTimeout(() => {
          onReloadAllData();
          onClose();
        }, 1200);
      } else {
        setImportStatus('Invalid JSON file. Please try again.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to default demo state?')) {
      storage.resetAll();
      onReloadAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Student Profile &amp; Settings
              </h2>
              <span className="text-xs text-slate-500">
                Personalized configuration for Vivek Yadav
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

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Student Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Exam / Goal</label>
            <input
              type="text"
              required
              value={targetExam}
              onChange={e => setTargetExam(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Daily Study Target (Hours)</label>
              <input
                type="number"
                min={2}
                max={16}
                value={targetHours}
                onChange={e => setTargetHours(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Morning Wake Time</label>
              <input
                type="text"
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Personal Vision / Why I Study</label>
            <textarea
              rows={2}
              value={visionStatement}
              onChange={e => setVisionStatement(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>

        {/* Data Backup & Restore Section */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Data Safety &amp; Backup
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Data (JSON)</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Backup JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          {importStatus && (
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{importStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

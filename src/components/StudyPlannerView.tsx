import React, { useState, useEffect, useRef } from 'react';
import { StudySession, TODAY_STR } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle,
  CloudRain,
  Radio,
  Zap,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface StudyPlannerViewProps {
  sessions: StudySession[];
  onAddSession: (session: Omit<StudySession, 'id' | 'timestamp'>) => void;
  targetDailyHours: number;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  sessions,
  onAddSession,
  targetDailyHours,
}) => {
  // Timer State
  const [timerMode, setTimerMode] = useState<'pomodoro25' | 'deep50' | 'stopwatch' | 'custom'>('pomodoro25');
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<'study' | 'break'>('study');
  const [activeSubject, setActiveSubject] = useState('Data Structures');
  const [activeTopic, setActiveTopic] = useState('');

  // Ambient sound state
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whitenoise' | 'binaural40'>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.25);

  // Manual Session Log modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualSubject, setManualSubject] = useState('Data Structures');
  const [manualTopic, setManualTopic] = useState('');
  const [manualDuration, setManualDuration] = useState(60);
  const [manualNotes, setManualNotes] = useState('');

  // Timer interval ref
  const intervalRef = useRef<number | null>(null);

  // Handle ambient sound changes
  useEffect(() => {
    if (ambientSound === 'none') {
      soundManager.stopAmbient();
    } else {
      soundManager.startAmbient(ambientSound, ambientVolume);
    }
    return () => {
      soundManager.stopAmbient();
    };
  }, [ambientSound]);

  useEffect(() => {
    soundManager.setAmbientVolume(ambientVolume);
  }, [ambientVolume]);

  // Timer countdown loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (timerMode === 'stopwatch') {
            return prev + 1;
          }
          if (prev <= 1) {
            // Timer Finished!
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            soundManager.playTimerBell();

            if (timerType === 'study') {
              // Auto-log session
              const loggedMinutes = Math.round(initialSeconds / 60);
              onAddSession({
                subject: activeSubject,
                topic: activeTopic || `${activeSubject} Focus Sprint`,
                durationMins: loggedMinutes > 0 ? loggedMinutes : 25,
                date: TODAY_STR,
                notes: 'Completed timer sprint.',
                mood: 'focused',
              });
              // Prompt break
              setTimerType('break');
              setSecondsLeft(5 * 60);
              setInitialSeconds(5 * 60);
            } else {
              // Break finished
              setTimerType('study');
              setSecondsLeft(25 * 60);
              setInitialSeconds(25 * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timerMode, timerType, initialSeconds, activeSubject, activeTopic, onAddSession]);

  const setMode = (mode: 'pomodoro25' | 'deep50' | 'stopwatch' | 'custom') => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimerType('study');
    if (mode === 'pomodoro25') {
      setInitialSeconds(25 * 60);
      setSecondsLeft(25 * 60);
    } else if (mode === 'deep50') {
      setInitialSeconds(50 * 60);
      setSecondsLeft(50 * 60);
    } else if (mode === 'stopwatch') {
      setInitialSeconds(0);
      setSecondsLeft(0);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Progress for circle
  const progressRatio =
    timerMode === 'stopwatch'
      ? 1
      : initialSeconds > 0
      ? (initialSeconds - secondsLeft) / initialSeconds
      : 0;

  // Manual Session Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTopic.trim()) return;
    onAddSession({
      subject: manualSubject,
      topic: manualTopic.trim(),
      durationMins: Number(manualDuration),
      date: TODAY_STR,
      notes: manualNotes.trim(),
      mood: 'focused',
    });
    setManualTopic('');
    setManualNotes('');
    setShowManualModal(false);
    soundManager.playCheckmarkSound();
  };

  // Calculate subject-wise metrics
  const todaySessions = sessions.filter(s => s.date === TODAY_STR);
  const totalMinsToday = todaySessions.reduce((acc, s) => acc + s.durationMins, 0);

  const subjectStats: Record<string, number> = {};
  sessions.forEach(s => {
    subjectStats[s.subject] = (subjectStats[s.subject] || 0) + s.durationMins;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Clock className="w-4 h-4" />
            <span>Focus Deep Work Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Study Planner &amp; Pomodoro Focus Station
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Today logged: <span className="font-semibold text-slate-900 font-mono tabular-nums">{(totalMinsToday / 60).toFixed(1)} hrs</span> of{' '}
            <span className="font-semibold text-slate-900 font-mono tabular-nums">{targetDailyHours} hrs</span> target.
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Offline Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Timer & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col items-center">
            {/* Mode Selectors */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-lg mb-8">
              <button
                onClick={() => setMode('pomodoro25')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  timerMode === 'pomodoro25' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                25m Pomodoro
              </button>
              <button
                onClick={() => setMode('deep50')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  timerMode === 'deep50' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                50m Deep Work
              </button>
              <button
                onClick={() => setMode('stopwatch')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  timerMode === 'stopwatch' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stopwatch
              </button>
            </div>

            {/* Circular Timer Visual Display */}
            <div className="relative w-64 h-64 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-100"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className={`transition-all duration-300 ${
                    timerType === 'break' ? 'stroke-emerald-500' : 'stroke-indigo-600'
                  }`}
                  strokeWidth="5"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 * (1 - progressRatio)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {timerType === 'break' ? '🌴 Break Time' : `📖 ${activeSubject}`}
                </span>
                <span className="text-5xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-xs text-slate-500 mt-2 max-w-[180px] truncate">
                  {activeTopic || 'Deep Focus Sprint'}
                </span>
              </div>
            </div>

            {/* Play, Pause, Reset Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  setIsRunning(!isRunning);
                  soundManager.playCheckmarkSound();
                }}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{secondsLeft === initialSeconds ? 'Start Session' : 'Resume'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                title="Reset timer"
                className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Target Topic & Subject Inputs */}
            <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Current Subject</label>
                <select
                  value={activeSubject}
                  onChange={e => setActiveSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Data Structures">Data Structures</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Web Development">Web Development</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Topic / Problem Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Graph BFS Traversal"
                  value={activeTopic}
                  onChange={e => setActiveTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* Ambient Sound Synthesizer Controls */}
            <div className="w-full max-w-md mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-indigo-600" />
                  Focus Noise Synthesizer
                </span>
                {ambientSound !== 'none' && (
                  <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                <button
                  onClick={() => setAmbientSound('none')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md ${
                    ambientSound === 'none' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Mute
                </button>
                <button
                  onClick={() => setAmbientSound('rain')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md ${
                    ambientSound === 'rain' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Rain
                </button>
                <button
                  onClick={() => setAmbientSound('whitenoise')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md ${
                    ambientSound === 'whitenoise' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => setAmbientSound('binaural40')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md ${
                    ambientSound === 'binaural40' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  40Hz Gamma
                </button>
              </div>

              {ambientSound !== 'none' && (
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200 text-xs text-slate-500">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={ambientVolume}
                    onChange={e => setAmbientVolume(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <span className="font-mono tabular-nums text-[11px]">{Math.round(ambientVolume * 100)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Subject Stats & Log History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Subject Time Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Subject Time Allocation</h3>
            <p className="text-xs text-slate-500 mb-4">Total focused study logged across subjects</p>

            <div className="space-y-3">
              {Object.entries(subjectStats).map(([subject, mins]) => {
                const hours = (mins / 60).toFixed(1);
                const percent = Math.min(100, Math.round((mins / (sessions.reduce((a, s) => a + s.durationMins, 0) || 1)) * 100));
                return (
                  <div key={subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{subject}</span>
                      <span className="font-mono tabular-nums text-slate-600">{hours} hrs ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Study Log Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today&apos;s Sessions Log</h3>
                <span className="text-xs text-slate-500">{todaySessions.length} sessions completed</span>
              </div>
              <span className="font-mono tabular-nums text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {(totalMinsToday / 60).toFixed(1)} hrs total
              </span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {todaySessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No study sessions recorded yet today. Start the timer to log your first session!
                </div>
              ) : (
                todaySessions.map(session => (
                  <div key={session.id} className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{session.subject}</span>
                      <span className="font-mono tabular-nums text-indigo-600 font-semibold">
                        {session.durationMins} mins
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{session.topic}</p>
                    {session.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">&ldquo;{session.notes}&rdquo;</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Session Log Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Log Offline Study Session</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add study hours completed from textbooks, library sessions, or offline classes.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={manualSubject}
                  onChange={e => setManualSubject(e.target.value)}
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

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Topic Covered</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Page Replacement Algorithms"
                  value={manualTopic}
                  onChange={e => setManualTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min={15}
                  step={5}
                  required
                  value={manualDuration}
                  onChange={e => setManualDuration(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Key Takeaways</label>
                <textarea
                  rows={2}
                  placeholder="Solved 10 previous year questions..."
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

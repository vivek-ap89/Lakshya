import React, { useState, useEffect } from 'react';
import { MotivationQuote, UserProfile } from '../types';
import {
  Sparkles,
  X,
  Volume2,
  Wind,
  Target,
  Quote,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface MotivationModalProps {
  quotes: MotivationQuote[];
  user: UserProfile;
  onClose: () => void;
}

export const MotivationModal: React.FC<MotivationModalProps> = ({
  quotes,
  user,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'zen' | 'sankalp'>('quotes');
  const [selectedQuoteIdx, setSelectedQuoteIdx] = useState(0);

  // Breathing exercise states
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isBreathingActive) {
      timer = window.setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  const handlePlayFanfare = () => {
    soundManager.playSuccessFanfare();
  };

  const currentQuote = quotes[selectedQuoteIdx % quotes.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-slate-900 text-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Vivek&apos;s Motivation &amp; Mindset Hub
              </h2>
              <span className="text-xs text-slate-400">
                Inspiration, focus reset &amp; personal vision
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg my-5">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'quotes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Inspiration
          </button>
          <button
            onClick={() => setActiveTab('zen')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'zen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Min Focus Reset (Zen)
          </button>
          <button
            onClick={() => setActiveTab('sankalp')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'sankalp' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mera Sankalp
          </button>
        </div>

        {/* Tab 1: Quotes Carousel */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-950/70 border border-slate-700/80 relative">
              <Quote className="w-8 h-8 text-indigo-400/30 absolute top-4 right-4" />
              
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-3">
                {currentQuote.category}
              </div>

              {/* Hindi thought */}
              <p className="text-base sm:text-lg font-bold text-amber-100 leading-relaxed mb-3">
                &ldquo;{currentQuote.hindiText}&rdquo;
              </p>

              {/* English thought */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-4">
                &ldquo;{currentQuote.quote}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs">
                <span className="font-semibold text-white">— {currentQuote.author}</span>
                <span className="text-[11px] text-slate-400">
                  {selectedQuoteIdx + 1} of {quotes.length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePlayFanfare}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Play Energy Chime</span>
              </button>

              <button
                onClick={() => setSelectedQuoteIdx(prev => (prev + 1) % quotes.length)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Agla Vichar (Next Quote)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: 1-Min Focus Reset (4-7-8 Breathing Circle) */}
        {activeTab === 'zen' && (
          <div className="flex flex-col items-center text-center py-4 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" />
                4-7-8 Focus Breath Reset
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Clear exam anxiety, reduce dopamine fatigue, and bring 100% focus back to the present moment.
              </p>
            </div>

            {/* Breathing Animated Visual */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div
                className={`w-40 h-40 rounded-full border-4 border-cyan-400/40 flex items-center justify-center transition-all duration-1000 ${
                  isBreathingActive && breathPhase === 'Inhale'
                    ? 'scale-110 bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                    : isBreathingActive && breathPhase === 'Hold'
                    ? 'scale-110 bg-indigo-500/20'
                    : 'scale-90 bg-slate-800'
                }`}
              >
                <div className="text-center">
                  <span className="text-xs uppercase font-bold text-cyan-300 tracking-wider block">
                    {isBreathingActive ? breathPhase : 'Ready'}
                  </span>
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                    {isBreathingActive ? breathCount : '—'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                isBreathingActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isBreathingActive ? 'Stop Exercise' : 'Start 1-Min Reset'}
            </button>
          </div>
        )}

        {/* Tab 3: Mera Sankalp (Personal Vision Board) */}
        {activeTab === 'sankalp' && (
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Target className="w-4 h-4" />
                <span>Vivek&apos;s Prime Objective</span>
              </div>
              <h3 className="text-lg font-bold text-white">{user.targetExam}</h3>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{user.visionStatement}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900/60 space-y-2">
              <span className="text-xs font-bold text-indigo-300 block">
                3 Golden Rules for Vivek:
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Never compromise on the 06:00 AM morning rise.</li>
                <li>When distraction calls, remember why you started.</li>
                <li>Daily 5 hours of deep study compounds into extraordinary results.</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

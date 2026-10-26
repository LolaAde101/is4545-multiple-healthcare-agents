import React from 'react';
import { AgentId, AgentStatus } from '../types';

interface AgentAvatarProps {
  agentId: AgentId;
  status: AgentStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentId,
  status,
  size = 'lg',
  showBadge = true,
  className = '',
}) => {
  const isWorking = status === 'Processing';

  // Dimension classes
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 md:w-28 md:h-28',
    xl: 'w-32 h-32 md:w-36 md:h-36',
  }[size];

  // Colors & Themes
  const getTheme = () => {
    switch (agentId) {
      case 'agent-1':
        return {
          glow: 'shadow-[0_0_25px_rgba(20,184,166,0.5)] border-teal-400',
          ring: 'text-teal-400',
          badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          gradient: 'from-emerald-900/60 via-teal-950/80 to-slate-900',
          iconColor: '#14b8a6',
        };
      case 'agent-2':
        return {
          glow: 'shadow-[0_0_25px_rgba(59,130,246,0.5)] border-blue-400',
          ring: 'text-blue-400',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          gradient: 'from-blue-900/60 via-indigo-950/80 to-slate-900',
          iconColor: '#3b82f6',
        };
      case 'agent-3':
        return {
          glow: 'shadow-[0_0_25px_rgba(244,63,94,0.5)] border-rose-400',
          ring: 'text-rose-400',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          gradient: 'from-rose-900/60 via-pink-950/80 to-slate-900',
          iconColor: '#f43f5e',
        };
      case 'agent-4':
        return {
          glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)] border-purple-400',
          ring: 'text-purple-400',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          gradient: 'from-purple-900/60 via-violet-950/80 to-slate-900',
          iconColor: '#a855f7',
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Animated Glowing Ring when Processing */}
      {isWorking && (
        <>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/20 via-blue-500/20 to-purple-500/20 animate-ping opacity-60" />
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 opacity-70 blur-md animate-pulse" />
        </>
      )}

      {/* Main Avatar Container */}
      <div
        className={`relative ${dimensions} rounded-2xl p-1 bg-gradient-to-b ${theme.gradient} border border-slate-700/80 transition-all duration-300 overflow-hidden flex items-center justify-center ${
          isWorking ? `${theme.glow} scale-105 border-2` : status === 'Selected' ? 'ring-2 ring-teal-400/70 border-teal-500/50' : 'hover:border-slate-500'
        }`}
      >
        {/* Ambient Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* Detailed Character SVG Illustrations */}
        {agentId === 'agent-1' && (
          // Dr. Evelyn Vance - MD Clinical Quality Director (Coat, Stethoscope, Warm Direct Gaze)
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Soft backdrop halo */}
            <circle cx="60" cy="60" r="50" fill="#0d9488" fillOpacity="0.15" />
            {/* Hair back */}
            <path d="M34 50 C32 30, 88 30, 86 50 C86 75, 82 85, 82 85 L38 85 C38 85, 34 75, 34 50 Z" fill="#3f2e24" />
            {/* Neck */}
            <path d="M52 64 L68 64 L68 76 L52 76 Z" fill="#e0a98b" />
            {/* Face */}
            <path d="M42 42 C42 30, 78 30, 78 42 C78 60, 72 68, 60 70 C48 68, 42 60, 42 42 Z" fill="#f5cbb1" />
            {/* Hair bangs */}
            <path d="M38 38 C45 30, 60 28, 82 36 C78 42, 70 38, 60 38 C48 38, 42 42, 38 38 Z" fill="#543c30" />
            {/* Eyes & Brows */}
            <ellipse cx="51" cy="46" rx="3" ry="2.2" fill="#2d3748" />
            <ellipse cx="69" cy="46" rx="3" ry="2.2" fill="#2d3748" />
            <circle cx="52" cy="45" r="0.8" fill="#fff" />
            <circle cx="70" cy="45" r="0.8" fill="#fff" />
            <path d="M48 42 Q52 40 55 42" stroke="#3f2e24" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M65 42 Q68 40 72 42" stroke="#3f2e24" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Nose & Smile */}
            <path d="M60 48 L60 53 L62 54" stroke="#d49377" strokeWidth="1" strokeLinecap="round" fill="none" />
            <path d="M54 59 Q60 63 66 59" stroke="#be5d5d" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Teal Scrubs Inner */}
            <path d="M46 76 L74 76 L78 110 L42 110 Z" fill="#0d9488" />
            <path d="M60 76 L60 88" stroke="#115e59" strokeWidth="1.5" />
            {/* White Doctor Coat */}
            <path d="M30 84 Q42 76 52 76 L48 115 L24 115 Z" fill="#f8fafc" />
            <path d="M90 84 Q78 76 68 76 L72 115 L96 115 Z" fill="#f8fafc" />
            <path d="M48 76 L52 98 L44 115" stroke="#cbd5e1" strokeWidth="1" fill="none" />
            <path d="M72 76 L68 98 L76 115" stroke="#cbd5e1" strokeWidth="1" fill="none" />
            {/* Stethoscope around neck */}
            <path d="M48 74 C46 86, 46 96, 54 99 C58 100, 62 100, 66 99 C74 96, 74 86, 72 74" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="103" r="4.5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            <circle cx="60" cy="103" r="2" fill="#0ea5e9" />
          </svg>
        )}

        {agentId === 'agent-2' && (
          // Marcus Reed, MPH - Public Health & Systems Specialist (Blazer, Glasses, Lanyard, Modern Analyst)
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="50" fill="#2563eb" fillOpacity="0.15" />
            {/* Neck */}
            <path d="M52 64 L68 64 L68 76 L52 76 Z" fill="#8c5838" />
            {/* Face */}
            <path d="M42 40 C42 28, 78 28, 78 40 C78 58, 72 68, 60 70 C48 68, 42 58, 42 40 Z" fill="#9f6642" />
            {/* Hair - Short cropped fade */}
            <path d="M40 38 C40 24, 80 24, 80 38 C80 38, 76 27, 60 27 C44 27, 40 38, 40 38 Z" fill="#1e1815" />
            <path d="M39 36 L43 45 L41 47 Z" fill="#1e1815" />
            <path d="M81 36 L77 45 L79 47 Z" fill="#1e1815" />
            {/* Modern Glasses */}
            <rect x="46" y="42" width="12" height="9" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="62" y="42" width="12" height="9" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="58" y1="46" x2="62" y2="46" stroke="#0f172a" strokeWidth="1.5" />
            {/* Eyes */}
            <circle cx="52" cy="46" r="2" fill="#1e293b" />
            <circle cx="68" cy="46" r="2" fill="#1e293b" />
            {/* Beard & Smile */}
            <path d="M48 56 C52 66, 68 66, 72 56 C72 65, 66 70, 60 70 C54 70, 48 65, 48 56 Z" fill="#1e1815" fillOpacity="0.8" />
            <path d="M55 58 Q60 61 65 58" stroke="#f1a788" strokeWidth="1.2" fill="none" />
            {/* Crisp Oxford Shirt & Navy Blazer */}
            <path d="M48 76 L72 76 L76 115 L44 115 Z" fill="#e2e8f0" />
            <path d="M28 82 Q44 76 50 76 L44 115 L22 115 Z" fill="#1e3a8a" />
            <path d="M92 82 Q76 76 70 76 L76 115 L98 115 Z" fill="#1e3a8a" />
            {/* Hospital ID Lanyard */}
            <path d="M54 76 L58 102 L62 102 L66 76" fill="none" stroke="#3b82f6" strokeWidth="1.8" />
            <rect x="55" y="100" width="10" height="14" rx="1.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
            <rect x="57" y="102" width="6" height="3" fill="#3b82f6" />
          </svg>
        )}

        {agentId === 'agent-3' && (
          // Sarah Lin, RN, CPHQ - Patient Safety & Triage Nurse (Scrubs, Clinical Headset, Focused Urgent Stance)
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="50" fill="#f43f5e" fillOpacity="0.15" />
            {/* Hair Bun Back */}
            <circle cx="60" cy="24" r="12" fill="#1c1917" />
            {/* Neck */}
            <path d="M52 64 L68 64 L68 76 L52 76 Z" fill="#edd0bd" />
            {/* Face */}
            <path d="M43 41 C43 29, 77 29, 77 41 C77 59, 72 68, 60 70 C48 68, 43 59, 43 41 Z" fill="#fae1d0" />
            {/* Hair Front */}
            <path d="M41 38 C48 30, 72 30, 79 38 C75 42, 60 35, 41 38 Z" fill="#1c1917" />
            {/* Eyes - Alert and Sharp */}
            <ellipse cx="51" cy="46" rx="3.2" ry="2" fill="#1c1917" />
            <ellipse cx="69" cy="46" rx="3.2" ry="2" fill="#1c1917" />
            <circle cx="52" cy="45" r="0.8" fill="#fff" />
            <circle cx="70" cy="45" r="0.8" fill="#fff" />
            <path d="M48 41 Q52 39 55 41" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M65 41 Q68 39 72 41" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Clinical Communications Headset */}
            <path d="M41 44 C38 32, 82 32, 79 44" fill="none" stroke="#475569" strokeWidth="1.8" />
            <circle cx="41" cy="46" r="3.5" fill="#0f172a" />
            <path d="M41 48 Q44 56 50 56" fill="none" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="50" cy="56" r="1.5" fill="#f43f5e" />
            {/* Nose & Firm Lip */}
            <path d="M60 48 L60 53 L62 54" stroke="#d59e87" strokeWidth="1" strokeLinecap="round" fill="none" />
            <path d="M55 60 Q60 62 65 60" stroke="#be4d5b" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            {/* Hospital Rose-Red Triage Scrubs */}
            <path d="M32 82 Q46 75 60 75 Q74 75 88 82 L94 115 L26 115 Z" fill="#9f1239" />
            <path d="M52 75 L60 88 L68 75 Z" fill="#881337" />
            {/* Triage Badge Clip */}
            <rect x="70" y="86" width="12" height="18" rx="2" fill="#ffffff" stroke="#e11d48" strokeWidth="1" />
            <rect x="73" y="89" width="6" height="4" fill="#e11d48" />
            <line x1="73" y1="96" x2="79" y2="96" stroke="#94a3b8" strokeWidth="1" />
            <line x1="73" y1="99" x2="77" y2="99" stroke="#94a3b8" strokeWidth="1" />
          </svg>
        )}

        {agentId === 'agent-4' && (
          // David Sterling, FACHE - Hospital Management Executive Support (Executive Charcoal Suit, Silver temples, Leader)
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="50" fill="#8b5cf6" fillOpacity="0.15" />
            {/* Neck */}
            <path d="M52 64 L68 64 L68 76 L52 76 Z" fill="#e6b89c" />
            {/* Face */}
            <path d="M42 41 C42 29, 78 29, 78 41 C78 59, 72 69, 60 70 C48 69, 42 59, 42 41 Z" fill="#f2cbaf" />
            {/* Hair - Executive Silver & Slate */}
            <path d="M40 39 C40 25, 80 25, 80 39 C80 37, 76 27, 60 27 C44 27, 40 37, 40 39 Z" fill="#64748b" />
            <path d="M39 37 L42 45 L40 47 Z" fill="#94a3b8" />
            <path d="M81 37 L78 45 L80 47 Z" fill="#94a3b8" />
            {/* Eyes */}
            <ellipse cx="51" cy="46" rx="2.8" ry="2" fill="#1e293b" />
            <ellipse cx="69" cy="46" rx="2.8" ry="2" fill="#1e293b" />
            <circle cx="52" cy="45" r="0.8" fill="#fff" />
            <circle cx="70" cy="45" r="0.8" fill="#fff" />
            <path d="M47 41 Q52 40 55 42" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M65 42 Q68 40 73 41" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Smile line */}
            <path d="M60 48 L60 54 L62 55" stroke="#c9977c" strokeWidth="1" strokeLinecap="round" fill="none" />
            <path d="M54 61 Q60 63 66 61" stroke="#a05252" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            {/* Charcoal Executive Suit & Violet Tie */}
            <path d="M48 76 L72 76 L76 115 L44 115 Z" fill="#f8fafc" />
            <path d="M28 82 Q44 76 50 76 L44 115 L22 115 Z" fill="#334155" />
            <path d="M92 82 Q76 76 70 76 L76 115 L98 115 Z" fill="#334155" />
            {/* Silk Violet Tie */}
            <path d="M58 76 L62 76 L64 96 L60 102 L56 96 Z" fill="#7c3aed" />
            {/* Gold Lapel Pin (FACHE Fellow) */}
            <circle cx="42" cy="88" r="2.2" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
          </svg>
        )}

        {/* Working Animation Overlay (Radar waves, typing indicators) */}
        {isWorking && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-end p-1.5 animate-fadeIn">
            {/* Data Scanning Bar */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-purple-400 animate-[moveX_1.5s_infinite_linear]"
                style={{ width: '40%' }}
              />
            </div>
            {/* Neural activity dots */}
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Status Pill Badge */}
      {showBadge && (
        <div
          className={`absolute -bottom-2 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border shadow-md flex items-center gap-1 ${
            status === 'Processing'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
              : status === 'Completed'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : status === 'Selected'
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
              : status === 'Error'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
              : 'bg-slate-800/90 text-slate-400 border-slate-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status === 'Processing'
                ? 'bg-amber-400 animate-ping'
                : status === 'Completed'
                ? 'bg-emerald-400'
                : status === 'Selected'
                ? 'bg-teal-400'
                : status === 'Error'
                ? 'bg-rose-400'
                : 'bg-slate-500'
            }`}
          />
          {status}
        </div>
      )}
    </div>
  );
};

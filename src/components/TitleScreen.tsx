import { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { DifficultyMode } from '../data/posters';

interface TitleScreenProps {
  difficulty: DifficultyMode;
  roundCount: number;
  bestScore: number;
  isMuted: boolean;
  onSelectDifficulty: (mode: DifficultyMode) => void;
  onSelectRoundCount: (count: number) => void;
  onToggleMute: () => void;
  onStart: () => void;
}

export function TitleScreen({
  difficulty,
  roundCount,
  bestScore,
  isMuted,
  onSelectDifficulty,
  onSelectRoundCount,
  onToggleMute,
  onStart,
}: TitleScreenProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === 'BUTTON') return;
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#111111] text-[#F0F0F0]">
      {/* Brand atmospheric glow matching godubdub.com obsidian + flame orange */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,105,34,0.16)_0%,rgba(27,27,27,0.45)_42%,rgba(17,17,17,1)_80%)]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-[48vh] w-full opacity-20"
      >
        <polygon points="600,0 160,600 1040,600" fill="url(#dubdubBeam)" />
        <defs>
          <linearGradient id="dubdubBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F96922" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F96922" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Minimal top-right audio control */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="font-mono text-xs text-[#9F9FAA] tabular-nums">
          {bestScore > 0 ? `Best Score · ${bestScore}` : 'Bollywood Poster Trivia'}
        </div>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#2D2D2D] bg-[#1B1B1B] text-[#F0F0F0]/85 transition-colors hover:border-[#F96922]/60 hover:text-[#F0F0F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F96922]"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Center-bottom bespoke lockup and start controls */}
      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-5 pb-8 pt-10 text-center sm:pb-14">
        {/* Bespoke SVG Title Lockup */}
        <svg
          viewBox="0 0 360 110"
          className="mb-3 h-20 w-auto sm:h-24"
          role="img"
          aria-label="PARDA"
        >
          <rect
            x="16"
            y="14"
            width="328"
            height="82"
            rx="8"
            fill="#1B1B1B"
            fillOpacity="0.55"
            stroke="#2D2D2D"
            strokeWidth="1.5"
          />
          <path
            d="M28 28 L28 20 L38 20 M332 28 L332 20 L322 20 M28 82 L28 90 L38 90 M332 82 L332 90 L322 90"
            fill="none"
            stroke="#F96922"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text
            x="180"
            y="69"
            textAnchor="middle"
            fill="#F0F0F0"
            fontFamily="'Onest', system-ui, sans-serif"
            fontWeight="800"
            fontSize="52"
            letterSpacing="10"
          >
            PARDA
          </text>
        </svg>

        <h1 className="max-w-md text-balance text-base font-medium leading-relaxed text-[#9F9FAA] sm:text-lg">
          Guess the Bollywood film from a zoomed-in frame of its real movie poster.
        </h1>

        {/* Game setup options */}
        <div className="mt-7 flex w-full max-w-md flex-col gap-3 rounded-xl border border-[#2D2D2D] bg-[#1B1B1B] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#9F9FAA]">Zoom Cut</span>
            <div className="flex items-center gap-1 rounded-lg bg-[#111111] p-1">
              <button
                type="button"
                onClick={() => onSelectDifficulty('classic')}
                className={`min-h-[38px] whitespace-nowrap rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#F96922] ${
                  difficulty === 'classic'
                    ? 'bg-[#F96922] text-[#111111]'
                    : 'text-[#9F9FAA] hover:text-[#F0F0F0]'
                }`}
              >
                Classic Cut
              </button>
              <button
                type="button"
                onClick={() => onSelectDifficulty('director')}
                className={`min-h-[38px] whitespace-nowrap rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#F96922] ${
                  difficulty === 'director'
                    ? 'bg-[#F96922] text-[#111111]'
                    : 'text-[#9F9FAA] hover:text-[#F0F0F0]'
                }`}
              >
                Director&apos;s Cut (1.5x)
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-[#2D2D2D]" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#9F9FAA]">Reel Length</span>
            <div className="flex items-center gap-1 rounded-lg bg-[#111111] p-1">
              {[
                { count: 5, label: '5' },
                { count: 10, label: '10' },
                { count: 24, label: 'All 24' },
              ].map(({ count, label }) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onSelectRoundCount(count)}
                  className={`min-h-[38px] whitespace-nowrap rounded-md px-3 text-xs font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-[#F96922] ${
                    roundCount === count
                      ? 'bg-[#F0F0F0] text-[#111111]'
                      : 'text-[#9F9FAA] hover:text-[#F0F0F0]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-5 min-h-[52px] w-full max-w-md whitespace-nowrap rounded-xl bg-[#F96922] px-8 py-3.5 text-base font-bold text-[#111111] shadow-lg transition-all duration-150 hover:bg-[#FF7D3B] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0F0F0]"
        >
          Start Game
        </button>

        <p className="mt-4 font-mono text-xs text-[#71717D]">
          Tap or Keys 1–4 Answer · H Zoom Clue · Esc Pause
        </p>
      </main>
    </div>
  );
}

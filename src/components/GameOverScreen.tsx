import { Check, RotateCcw, X } from 'lucide-react';
import { DifficultyMode, MoviePoster } from '../data/posters';

export interface RoundResult {
  poster: MoviePoster;
  correct: boolean;
  pointsAwarded: number;
  clueUsed: boolean;
}

interface GameOverScreenProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  bestStreak: number;
  difficulty: DifficultyMode;
  results: RoundResult[];
  onPlayAgain: () => void;
  onTitleScreen: () => void;
}

export function GameOverScreen({
  score,
  bestScore,
  isNewBest,
  bestStreak,
  difficulty,
  results,
  onPlayAgain,
  onTitleScreen,
}: GameOverScreenProps) {
  const correctCount = results.filter((r) => r.correct).length;
  const accuracy =
    results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#111111] px-4 py-8 text-[#F0F0F0]">
      <div className="w-full max-w-2xl rounded-2xl border border-[#2D2D2D] bg-[#1B1B1B] p-5 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs text-[#F96922]">
            Final Curtain · {difficulty === 'director' ? "Director's Cut" : 'Classic Cut'}
            {isNewBest ? ' · New Personal Best' : ''}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#F0F0F0] sm:text-4xl">
            {score} Points
          </h1>

          {/* Clean unboxed summary metrics */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-[#9F9FAA] tabular-nums sm:text-sm">
            <span>
              Accuracy{' '}
              <strong className="text-[#F0F0F0]">
                {correctCount}/{results.length} ({accuracy}%)
              </strong>
            </span>
            <span aria-hidden="true" className="text-[#71717D]">
              ·
            </span>
            <span>
              Best Streak <strong className="text-[#F0F0F0]">{bestStreak}</strong>
            </span>
            <span aria-hidden="true" className="text-[#71717D]">
              ·
            </span>
            <span>
              High Score <strong className="text-[#F96922]">{bestScore}</strong>
            </span>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-[#2D2D2D]" />

        {/* Poster Reel Recap */}
        <h2 className="mb-3 text-xs font-semibold text-[#9F9FAA]">
          Poster Reel Recap
        </h2>
        <div className="grid max-h-[38dvh] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {results.map((item, idx) => (
            <div
              key={`${item.poster.id}-${idx}`}
              className="flex items-center gap-3 rounded-xl border border-[#2D2D2D] bg-[#111111] p-2.5"
            >
              <img
                src={item.poster.imagePath}
                alt={item.poster.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-14 w-11 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#F0F0F0]">
                  {item.poster.title}
                </p>
                <p className="font-mono text-[11px] text-[#9F9FAA] tabular-nums">
                  {item.poster.year} ·{' '}
                  {item.correct ? `+${item.pointsAwarded} pts` : 'Missed'}
                </p>
              </div>
              <span
                aria-label={item.correct ? 'Correct' : 'Incorrect'}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  item.correct
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {item.correct ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <X className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#F96922] px-5 py-3 text-sm font-bold text-[#111111] transition-colors hover:bg-[#FF7D3B] focus-visible:outline-2 focus-visible:outline-[#F0F0F0]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Play Again</span>
          </button>
          <button
            type="button"
            onClick={onTitleScreen}
            className="min-h-[48px] flex-1 whitespace-nowrap rounded-xl border border-[#2D2D2D] bg-[#242428] px-5 py-3 text-sm font-semibold text-[#F0F0F0] transition-colors hover:border-[#F96922]/60 focus-visible:outline-2 focus-visible:outline-[#F96922]"
          >
            Title Screen
          </button>
        </div>
      </div>
    </div>
  );
}

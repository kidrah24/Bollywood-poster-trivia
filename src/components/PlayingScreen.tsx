import { useEffect } from 'react';
import {
  ArrowRight,
  Check,
  Pause,
  Volume2,
  VolumeX,
  X,
  ZoomOut,
} from 'lucide-react';
import { DifficultyMode, TriviaQuestion } from '../data/posters';
import { PosterViewport } from './PosterViewport';

interface PlayingScreenProps {
  question: TriviaQuestion;
  roundIndex: number;
  totalRounds: number;
  score: number;
  streak: number;
  difficulty: DifficultyMode;
  clueUsed: boolean;
  selectedOption: string | null;
  lastPointsAwarded: number;
  isMuted: boolean;
  isPaused: boolean;
  onUseClue: () => void;
  onSelectAnswer: (option: string) => void;
  onNext: () => void;
  onPause: () => void;
  onToggleMute: () => void;
}

export function PlayingScreen({
  question,
  roundIndex,
  totalRounds,
  score,
  streak,
  difficulty,
  clueUsed,
  selectedOption,
  lastPointsAwarded,
  isMuted,
  isPaused,
  onUseClue,
  onSelectAnswer,
  onNext,
  onPause,
  onToggleMute,
}: PlayingScreenProps) {
  const isRevealed = selectedOption !== null;
  const isCorrect = isRevealed && selectedOption === question.poster.title;
  const isLastRound = roundIndex + 1 >= totalRounds;

  useEffect(() => {
    if (isPaused) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onPause();
        return;
      }

      if (!isRevealed) {
        if (e.key === 'h' || e.key === 'H') {
          if (!clueUsed) {
            e.preventDefault();
            onUseClue();
          }
          return;
        }
        const keyIndex = ['1', '2', '3', '4'].indexOf(e.key);
        if (keyIndex !== -1 && question.options[keyIndex]) {
          e.preventDefault();
          onSelectAnswer(question.options[keyIndex]);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPaused,
    isRevealed,
    clueUsed,
    question.options,
    onUseClue,
    onSelectAnswer,
    onNext,
    onPause,
  ]);

  const cutLabel = difficulty === 'director' ? "Director's Cut" : 'Classic Cut';

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#111111] text-[#F0F0F0]">
      {/* Unobtrusive Top Perimeter HUD */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 border-b border-[#2D2D2D] px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-[#9F9FAA] tabular-nums sm:text-sm">
          <span className="font-semibold text-[#F0F0F0]">
            {String(roundIndex + 1).padStart(2, '0')}/
            {String(totalRounds).padStart(2, '0')}
          </span>
          <span aria-hidden="true" className="text-[#71717D]">
            ·
          </span>
          <span className="hidden text-[#9F9FAA] sm:inline">{cutLabel}</span>
          <span className="font-semibold text-[#F96922] sm:hidden">
            {score} pts
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 font-mono text-sm tabular-nums sm:flex">
            <span className="text-[#9F9FAA]">
              Score <strong className="text-[#F96922]">{score}</strong>
            </span>
            <span aria-hidden="true" className="text-[#71717D]">
              ·
            </span>
            <span className="text-[#9F9FAA]">
              Streak <strong className="text-[#F0F0F0]">{streak}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#9F9FAA] tabular-nums sm:hidden">
            <span>Streak {streak}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-[#2D2D2D] bg-[#1B1B1B] text-[#F0F0F0]/80 transition-colors hover:border-[#F96922]/60 hover:text-[#F0F0F0] focus-visible:outline-2 focus-visible:outline-[#F96922]"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onPause}
              aria-label="Pause game"
              className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-[#2D2D2D] bg-[#1B1B1B] text-[#F0F0F0]/80 transition-colors hover:border-[#F96922]/60 hover:text-[#F0F0F0] focus-visible:outline-2 focus-visible:outline-[#F96922]"
            >
              <Pause className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Playfield */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-3 sm:px-6 md:py-6">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[auto_1fr] md:gap-10 lg:gap-14">
          {/* Left / Top: Poster Crop Viewport */}
          <PosterViewport
            key={`${question.poster.id}-${question.crop.id}`}
            poster={question.poster}
            crop={question.crop}
            difficulty={difficulty}
            clueUsed={clueUsed}
            isRevealed={isRevealed}
            wasCorrect={isRevealed ? isCorrect : null}
          />

          {/* Right / Bottom: Question Prompt, Clue & 4 Choices */}
          <div className="mx-auto flex w-full max-w-lg flex-col">
            <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-3">
              <h2 className="font-display text-lg font-bold tracking-tight text-[#F0F0F0] sm:text-2xl">
                Which movie is this?
              </h2>
              {!isRevealed && (
                <button
                  type="button"
                  onClick={onUseClue}
                  disabled={clueUsed}
                  className={`flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#F96922] ${
                    clueUsed
                      ? 'cursor-default border-[#2D2D2D] bg-[#1B1B1B]/60 text-[#71717D]'
                      : 'border-[#F96922]/55 bg-[#1B1B1B] text-[#F96922] hover:border-[#F96922] hover:bg-[#F96922]/12'
                  }`}
                >
                  <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{clueUsed ? 'Clue Used' : 'Zoom Out Clue'}</span>
                </button>
              )}
            </div>

            {/* Four Multiple-Choice Options */}
            <div
              className="grid grid-cols-1 gap-2 sm:gap-2.5"
              role="group"
              aria-label="Movie choices"
            >
              {question.options.map((option, idx) => {
                const isThisCorrect = option === question.poster.title;
                const isThisSelected = option === selectedOption;

                let buttonStyle =
                  'border-[#2D2D2D] bg-[#1B1B1B] text-[#F0F0F0] hover:border-[#F96922]/75 hover:bg-[#242428]';
                let indexStyle =
                  'border-[#303030] bg-[#111111] text-[#9F9FAA]';
                let motionClass = '';

                if (isRevealed) {
                  if (isThisCorrect) {
                    buttonStyle =
                      'border-emerald-400/80 bg-emerald-950/50 text-[#F0F0F0]';
                    indexStyle =
                      'border-emerald-400/60 bg-emerald-500/20 text-emerald-300';
                    if (isThisSelected) {
                      motionClass = 'animate-pop-correct';
                    }
                  } else if (isThisSelected) {
                    buttonStyle =
                      'border-rose-400/80 bg-rose-950/50 text-[#F0F0F0]';
                    indexStyle =
                      'border-rose-400/60 bg-rose-500/20 text-rose-300';
                    motionClass = 'animate-shake-wrong';
                  } else {
                    buttonStyle =
                      'border-[#232326] bg-[#161618] text-[#71717D]';
                    indexStyle =
                      'border-[#232326] bg-[#111111] text-[#71717D]';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isRevealed}
                    onClick={() => onSelectAnswer(option)}
                    className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F96922] sm:min-h-[54px] sm:px-4 ${buttonStyle} ${motionClass}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border font-mono text-xs font-semibold tabular-nums ${indexStyle}`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold leading-snug sm:text-base">
                        {option}
                      </span>
                    </span>

                    {isRevealed && isThisCorrect && (
                      <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-emerald-300">
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>{isThisSelected ? 'Correct' : 'Answer'}</span>
                      </span>
                    )}

                    {isRevealed && isThisSelected && !isThisCorrect && (
                      <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-rose-300">
                        <X className="h-4 w-4" aria-hidden="true" />
                        <span>Wrong</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Reveal: Netflix-style Movie Info & Next CTA */}
            {isRevealed ? (
              <div className="mt-3 flex flex-col gap-2.5 rounded-xl border border-[#2D2D2D] bg-[#1B1B1B] p-4 sm:mt-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {isCorrect ? (
                      <>
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span className="text-emerald-300">
                          Spot on! +{lastPointsAwarded} pts
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 shrink-0 text-rose-400" />
                        <span className="text-rose-300">
                          Correct answer: {question.poster.title}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-px w-full bg-[#2D2D2D]" />

                <div>
                  <h3 className="font-display text-lg font-bold text-[#F0F0F0]">
                    {question.poster.title}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-[#F96922] tabular-nums">
                    <span>{question.poster.year}</span>
                    <span aria-hidden="true" className="text-[#71717D]">
                      ·
                    </span>
                    <span>{question.poster.runtime}</span>
                    <span aria-hidden="true" className="text-[#71717D]">
                      ·
                    </span>
                    <span className="text-[#F0F0F0]/85">
                      {question.poster.genre}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#F0F0F0]/85">
                    {question.poster.synopsis}
                  </p>
                  <p className="mt-1.5 text-[11px] text-[#9F9FAA]">
                    Starring {question.poster.starring} · Dir.{' '}
                    {question.poster.director}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onNext}
                  className="mt-1 flex min-h-[46px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#F96922] px-5 py-2.5 text-sm font-bold text-[#111111] transition-all duration-150 hover:bg-[#FF7D3B] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#F0F0F0]"
                >
                  <span>{isLastRound ? 'View Final Score' : 'Next Poster'}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <p className="mt-3 text-center font-mono text-[11px] text-[#9F9FAA] sm:text-left">
                {clueUsed
                  ? `Clue: ${question.poster.clueHint}`
                  : 'Identify the movie from the poster crop, or use Zoom Out Clue.'}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

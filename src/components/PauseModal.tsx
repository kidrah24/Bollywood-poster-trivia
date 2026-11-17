import { useEffect } from 'react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToTitle: () => void;
}

export function PauseModal({
  onResume,
  onRestart,
  onQuitToTitle,
}: PauseModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-[#2D2D2D] bg-[#1B1B1B] p-6 text-center shadow-2xl">
        <h2
          id="pause-title"
          className="font-display text-2xl font-bold text-[#F0F0F0]"
        >
          Intermission
        </h2>
        <p className="mt-1.5 text-sm text-[#9F9FAA]">
          Game paused. Ready to return to the reel?
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="min-h-[48px] w-full whitespace-nowrap rounded-xl bg-[#F96922] px-5 py-3 text-sm font-bold text-[#111111] transition-colors hover:bg-[#FF7D3B] focus-visible:outline-2 focus-visible:outline-[#F0F0F0]"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="min-h-[48px] w-full whitespace-nowrap rounded-xl border border-[#2D2D2D] bg-[#242428] px-5 py-3 text-sm font-semibold text-[#F0F0F0] transition-colors hover:border-[#F96922]/60 focus-visible:outline-2 focus-visible:outline-[#F96922]"
          >
            Restart Reel
          </button>
          <button
            type="button"
            onClick={onQuitToTitle}
            className="min-h-[48px] w-full whitespace-nowrap rounded-xl border border-transparent px-5 py-3 text-sm font-medium text-[#9F9FAA] transition-colors hover:text-[#F0F0F0] focus-visible:outline-2 focus-visible:outline-[#F96922]"
          >
            Title Screen
          </button>
        </div>
      </div>
    </div>
  );
}

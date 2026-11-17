import { useLayoutEffect, useRef, useState } from 'react';
import { Film } from 'lucide-react';
import { CropSpot, DifficultyMode, MoviePoster } from '../data/posters';

interface PosterViewportProps {
  poster: MoviePoster;
  crop: CropSpot;
  difficulty: DifficultyMode;
  clueUsed: boolean;
  isRevealed: boolean;
  wasCorrect: boolean | null;
}

export function PosterViewport({
  poster,
  crop,
  difficulty,
  clueUsed,
  isRevealed,
  wasCorrect,
}: PosterViewportProps) {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [poster.imagePath]);

  const initialScale =
    difficulty === 'director' ? crop.directorScale : crop.classicScale;
  const activeScale = isRevealed ? 1 : clueUsed ? crop.clueScale : initialScale;

  const frameBorderClass = isRevealed
    ? wasCorrect
      ? 'border-emerald-400/75 shadow-[0_0_32px_-8px_rgba(16,185,129,0.35)]'
      : 'border-rose-400/75 shadow-[0_0_32px_-8px_rgba(244,63,94,0.3)]'
    : 'border-[#2D2D2D] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        style={{ aspectRatio: `${poster.width} / ${poster.height}` }}
        className={`relative h-[36dvh] min-h-[220px] max-h-[320px] sm:h-[42dvh] sm:max-h-[380px] md:h-[62vh] md:max-h-[560px] w-auto overflow-hidden rounded-lg border bg-[#1B1B1B] transition-colors duration-200 ${frameBorderClass}`}
      >
        {!imgError ? (
          <>
            <img
              ref={imgRef}
              src={poster.imagePath}
              alt={
                isRevealed
                  ? `${poster.title} (${poster.year}) official movie poster`
                  : 'Zoomed-in Bollywood movie poster clue'
              }
              decoding="async"
              fetchPriority="high"
              referrerPolicy="no-referrer"
              draggable={false}
              onLoad={() => setIsLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                transformOrigin: `${crop.originX}% ${crop.originY}%`,
                transform: `scale(${activeScale})`,
              }}
              className="h-full w-full select-none object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-[#232326] via-[#1B1B1B] to-[#232326] transition-opacity duration-150 ${
                isLoaded ? 'opacity-0' : 'animate-pulse opacity-100'
              }`}
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#232326] to-[#111111] p-6 text-center">
            <Film className="h-10 w-10 text-[#F96922]/80" aria-hidden="true" />
            <p className="font-display text-lg font-bold text-[#F0F0F0]">
              {isRevealed ? poster.title : 'Poster Clue'}
            </p>
            <p className="text-xs text-[#9F9FAA]">{poster.synopsis}</p>
          </div>
        )}

        {/* Viewfinder corner reticles while guessing */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            isRevealed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 border-[#F96922]/90" />
          <span className="absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 border-[#F96922]/90" />
          <span className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-[#F96922]/90" />
          <span className="absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r-2 border-b-2 border-[#F96922]/90" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30" />
        </div>
      </div>

      <p className="mt-2 font-mono text-[11px] tracking-wide text-[#9F9FAA] tabular-nums">
        {isRevealed
          ? `${poster.year} · Dir. ${poster.director}`
          : clueUsed
            ? `Clue View · ${crop.label} · ${crop.clueScale.toFixed(1)}x`
            : `Poster Crop · ${activeScale.toFixed(1)}x Zoom`}
      </p>
    </div>
  );
}

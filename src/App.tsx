/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { GameOverScreen, RoundResult } from './components/GameOverScreen';
import { PauseModal } from './components/PauseModal';
import { PlayingScreen } from './components/PlayingScreen';
import { TitleScreen } from './components/TitleScreen';
import {
  buildTriviaDeck,
  DifficultyMode,
  TriviaQuestion,
} from './data/posters';
import { soundEngine } from './utils/sound';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

const BEST_SCORE_STORAGE_KEY = 'parda_bollywood_best_score_v1';

function readBestScore(): number {
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number): void {
  try {
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('classic');
  const [roundCount, setRoundCount] = useState<number>(5);
  const [deck, setDeck] = useState<TriviaQuestion[]>(() => buildTriviaDeck(5));
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => readBestScore());
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [clueUsed, setClueUsed] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [lastPointsAwarded, setLastPointsAwarded] = useState<number>(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const startNewGame = useCallback(
    (overrideDifficulty?: DifficultyMode, overrideCount?: number) => {
      const activeDifficulty = overrideDifficulty ?? difficulty;
      const activeCount = overrideCount ?? roundCount;
      soundEngine.playTap();
      setDeck(buildTriviaDeck(activeCount));
      setRoundIndex(0);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setIsNewBest(false);
      setClueUsed(false);
      setSelectedOption(null);
      setLastPointsAwarded(0);
      setResults([]);
      if (overrideDifficulty) setDifficulty(activeDifficulty);
      if (overrideCount) setRoundCount(activeCount);
      setGameState('PLAYING');
    },
    [difficulty, roundCount]
  );

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const handleUseClue = useCallback(() => {
    if (selectedOption !== null || clueUsed) return;
    soundEngine.playClueZoom();
    setClueUsed(true);
  }, [selectedOption, clueUsed]);

  const handleSelectAnswer = useCallback(
    (option: string) => {
      if (selectedOption !== null) return;
      const currentQuestion = deck[roundIndex];
      if (!currentQuestion) return;

      const isCorrect = option === currentQuestion.poster.title;
      setSelectedOption(option);

      let pointsAwarded = 0;
      let nextStreak = 0;

      if (isCorrect) {
        const basePoints = clueUsed ? 60 : 100;
        const modeMultiplier = difficulty === 'director' ? 1.5 : 1;
        nextStreak = streak + 1;
        const streakBonus = Math.min((nextStreak - 1) * 15, 60);
        pointsAwarded = Math.round(basePoints * modeMultiplier) + streakBonus;

        const nextScore = score + pointsAwarded;
        setScore(nextScore);
        setStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));
        soundEngine.playCorrect(nextStreak);

        if (nextScore > bestScore) {
          setBestScore(nextScore);
          setIsNewBest(true);
          saveBestScore(nextScore);
        }
      } else {
        setStreak(0);
        soundEngine.playIncorrect();
      }

      setLastPointsAwarded(pointsAwarded);
      setResults((prev) => [
        ...prev,
        {
          poster: currentQuestion.poster,
          correct: isCorrect,
          pointsAwarded,
          clueUsed,
        },
      ]);
    },
    [selectedOption, deck, roundIndex, clueUsed, difficulty, streak, score, bestScore]
  );

  const handleNext = useCallback(() => {
    if (roundIndex + 1 >= deck.length) {
      soundEngine.playFinale();
      setGameState('GAME_OVER');
      return;
    }
    soundEngine.playTap();
    setRoundIndex((prev) => prev + 1);
    setClueUsed(false);
    setSelectedOption(null);
    setLastPointsAwarded(0);
  }, [roundIndex, deck.length]);

  const currentQuestion = deck[roundIndex];

  if (gameState === 'TITLE_MENU') {
    return (
      <TitleScreen
        difficulty={difficulty}
        roundCount={roundCount}
        bestScore={bestScore}
        isMuted={isMuted}
        onSelectDifficulty={(mode) => {
          soundEngine.playTap();
          setDifficulty(mode);
        }}
        onSelectRoundCount={(count) => {
          soundEngine.playTap();
          setRoundCount(count);
        }}
        onToggleMute={handleToggleMute}
        onStart={() => startNewGame()}
      />
    );
  }

  if (gameState === 'GAME_OVER') {
    return (
      <GameOverScreen
        score={score}
        bestScore={bestScore}
        isNewBest={isNewBest}
        bestStreak={bestStreak}
        difficulty={difficulty}
        results={results}
        onPlayAgain={() => startNewGame()}
        onTitleScreen={() => {
          soundEngine.playTap();
          setGameState('TITLE_MENU');
        }}
      />
    );
  }

  return (
    <>
      {currentQuestion && (
        <PlayingScreen
          question={currentQuestion}
          roundIndex={roundIndex}
          totalRounds={deck.length}
          score={score}
          streak={streak}
          difficulty={difficulty}
          clueUsed={clueUsed}
          selectedOption={selectedOption}
          lastPointsAwarded={lastPointsAwarded}
          isMuted={isMuted}
          isPaused={gameState === 'PAUSED'}
          onUseClue={handleUseClue}
          onSelectAnswer={handleSelectAnswer}
          onNext={handleNext}
          onPause={() => {
            soundEngine.playTap();
            setGameState('PAUSED');
          }}
          onToggleMute={handleToggleMute}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={() => {
            soundEngine.playTap();
            setGameState('PLAYING');
          }}
          onRestart={() => startNewGame()}
          onQuitToTitle={() => {
            soundEngine.playTap();
            setGameState('TITLE_MENU');
          }}
        />
      )}
    </>
  );
}

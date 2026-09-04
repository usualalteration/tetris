import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TetrisBoard } from './TetrisBoard';
import { NextPiece } from './NextPiece';
import { ScoreBoard } from './ScoreBoard';
import { GameOverModal } from './GameOverModal';
import { TetrominoPreview } from './TetrominoPreview';
import { useTetris } from '@/hooks/useTetris';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * A touch button that fires its action once on press and then repeats while
 * held down — used for move/soft-drop on mobile so holding the button works.
 */
function HoldButton({
  onPress,
  className = '',
  label,
  children,
}: {
  onPress: () => void;
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    onPress();
    stop();
    timer.current = setInterval(onPress, 90);
  };

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      className={`flex items-center justify-center rounded-xl bg-gray-800 text-white text-2xl font-bold border border-gray-700 select-none touch-manipulation active:bg-gray-600 active:scale-95 transition-transform ${className}`}
    >
      {children}
    </button>
  );
}

export function TetrisGame() {
  const {
    board,
    currentPiece,
    nextPiece,
    position,
    score,
    lines,
    level,
    gameOver,
    paused,
    startGame,
    resetGame,
    togglePause,
    move,
    rotate,
    hardDropAction,
  } = useTetris();

  const isMobile = useIsMobile();
  const formatScore = (num: number) => num.toString().padStart(6, '0');

  const boardWithOverlay = (className: string) => (
    <div className={`relative ${className}`}>
      <TetrisBoard
        board={board}
        currentPiece={
          currentPiece
            ? { shape: currentPiece.shape, color: currentPiece.color }
            : undefined
        }
        position={position || undefined}
      />
      {paused && !gameOver && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center rounded-lg">
          <span className="text-3xl font-bold text-white">Paused</span>
        </div>
      )}
    </div>
  );

  // ---- Mobile layout: full-height, no page scroll, big touch controls ----
  if (isMobile) {
    return (
      <div className="flex flex-col h-[100svh] bg-gradient-to-br from-gray-900 via-gray-800 to-black p-2 gap-2 overflow-hidden select-none">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link to="/">Back</Link>
          </Button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
            Tetris
          </h1>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              onClick={gameOver ? startGame : togglePause}
              className={`h-9 ${paused || gameOver ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {gameOver ? 'Start' : paused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              size="sm"
              onClick={resetGame}
              disabled={gameOver}
              className="h-9 bg-red-600 hover:bg-red-700"
            >
              Restart
            </Button>
          </div>
        </div>

        {/* Stats + next piece */}
        <div className="flex items-center justify-between gap-2 shrink-0 text-white">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 px-2 py-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Score</p>
              <p className="text-base font-bold font-mono leading-tight">{formatScore(score)}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 px-2 py-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Lines</p>
              <p className="text-base font-bold font-mono leading-tight">{lines}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 px-2 py-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Level</p>
              <p className="text-base font-bold font-mono leading-tight">{level + 1}</p>
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-800/50 rounded-lg border border-gray-700/50 px-2 py-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Next</p>
            <div className="scale-75 origin-center h-8 flex items-center">
              {nextPiece ? (
                <TetrominoPreview shape={nextPiece.shape} color={nextPiece.color} />
              ) : (
                <span className="text-xs text-gray-500">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Board — fills remaining height, keeps 10:20 aspect ratio */}
        <div className="flex-1 min-h-0 flex items-center justify-center">
          {boardWithOverlay('h-full aspect-[1/2] max-w-full')}
        </div>

        {/* Touch controls */}
        <div className="shrink-0 flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2">
            <HoldButton onPress={() => move('left')} label="Move left" className="h-14">
              ◀
            </HoldButton>
            <button
              type="button"
              aria-label="Rotate"
              onClick={() => rotate()}
              onContextMenu={(e) => e.preventDefault()}
              className="flex items-center justify-center rounded-xl bg-gray-800 text-white text-2xl font-bold border border-gray-700 select-none touch-manipulation active:bg-gray-600 active:scale-95 transition-transform h-14"
            >
              ⟳
            </button>
            <HoldButton onPress={() => move('down')} label="Soft drop" className="h-14">
              ▼
            </HoldButton>
            <HoldButton onPress={() => move('right')} label="Move right" className="h-14">
              ▶
            </HoldButton>
          </div>
          <button
            type="button"
            aria-label="Hard drop"
            onClick={() => hardDropAction()}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-12 rounded-xl bg-indigo-600 active:bg-indigo-700 text-white font-semibold border border-indigo-500 select-none touch-manipulation active:scale-[0.99] transition-transform"
          >
            Hard Drop
          </button>
        </div>

        <GameOverModal
          gameOver={gameOver}
          score={score}
          lines={lines}
          level={level}
          onRestart={resetGame}
        />
      </div>
    );
  }

  // ---- Desktop layout ----
  const controls = [
    { key: '←', action: () => move('left'), label: 'Left' },
    { key: '↓', action: () => move('down'), label: 'Down' },
    { key: '↑', action: () => rotate(), label: 'Rotate' },
    { key: '→', action: () => move('right'), label: 'Right' },
    { key: 'Space', action: () => hardDropAction(), label: 'Hard Drop' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col items-center gap-8">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
          Tetris
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full">
          <div className="flex flex-col gap-4">
            {boardWithOverlay('w-[300px] h-[600px]')}

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {controls.map((control, i) => (
                <Button
                  key={i}
                  onClick={control.action}
                  className="min-w-[60px] h-12 bg-gray-800 hover:bg-gray-700 text-white font-semibold border-gray-700"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-sm bg-gray-900 px-2 py-1 rounded border border-gray-600">
                      {control.key}
                    </span>
                    <span className="text-xs text-gray-400">{control.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div className="flex items-center justify-between gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">Back</Link>
              </Button>
              <Button
                onClick={gameOver ? startGame : togglePause}
                className={paused || gameOver ? 'bg-yellow-600 hover:bg-yellow-700 flex-1' : 'bg-green-600 hover:bg-green-700 flex-1'}
              >
                {gameOver ? 'Start Game' : paused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={resetGame}
                className="bg-red-600 hover:bg-red-700 flex-1"
                disabled={gameOver}
              >
                Restart
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <NextPiece nextPiece={nextPiece} />
              <ScoreBoard score={score} lines={lines} level={level} />
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 text-sm text-gray-400">
              <h3 className="font-semibold text-white mb-2">Controls</h3>
              <ul className="space-y-1">
                <li><span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-gray-300">← →</span> Move</li>
                <li><span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-gray-300">↑</span> Rotate</li>
                <li><span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-gray-300">↓</span> Soft Drop</li>
                <li><span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-gray-300">Space</span> Hard Drop</li>
                <li><span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-gray-300">P</span> Pause</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <GameOverModal
        gameOver={gameOver}
        score={score}
        lines={lines}
        level={level}
        onRestart={resetGame}
      />
    </div>
  );
}

export default TetrisGame;

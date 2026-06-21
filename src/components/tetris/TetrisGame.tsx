import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BOARD_WIDTH } from '@/types/tetris';
import { TetrisBoard } from './TetrisBoard';
import { NextPiece } from './NextPiece';
import { ScoreBoard } from './ScoreBoard';
import { GameOverModal } from './GameOverModal';
import { useTetris } from '@/hooks/useTetris';

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
            <div className="relative">
              <TetrisBoard
                board={board}
                currentPiece={currentPiece ? { shape: currentPiece.shape, color: currentPiece.color } : undefined}
                position={position || undefined}
              />
              {paused && !gameOver && (
                <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center rounded-lg">
                  <span className="text-4xl font-bold text-white">Paused</span>
                </div>
              )}
            </div>

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
              <Button
                asChild
                variant="outline"
                className="flex-1"
              >
                <Link to="/">
                  Back
                </Link>
              </Button>
              <Button
                onClick={paused ? togglePause : startGame}
                className={paused ? 'bg-yellow-600 hover:bg-yellow-700 flex-1' : 'bg-green-600 hover:bg-green-700 flex-1'}
              >
                {paused ? 'Resume' : gameOver ? 'Start Game' : 'Pause'}
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

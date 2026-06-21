import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOES,
  GameState,
  Tetromino,
  Position,
  Direction,
  RotateDirection,
} from '@/types/tetris';
import {
  createEmptyBoard,
  getRandomTetromino,
  checkCollision,
  mergePieceToBoard,
  clearLines,
  calculateScore,
  getInitialPosition,
  canMove,
  canRotate,
  hardDrop,
  rotateMatrix,
} from '@/utils/tetris';

const INITIAL_LEVEL = 0;
const INITIAL_DROP_INTERVAL = 800;
const MIN_DROP_INTERVAL = 100;
const LEVEL_UP_LINES = 10;

export const useTetris = () => {
  const [board, setBoard] = useState<(string | null)[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(INITIAL_LEVEL);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dropInterval, setDropInterval] = useState(INITIAL_DROP_INTERVAL);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<Position | null>(null);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    const firstPiece = getRandomTetromino();
    const secondPiece = getRandomTetromino();
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setPosition(getInitialPosition(firstPiece));
    setScore(0);
    setLines(0);
    setLevel(INITIAL_LEVEL);
    setGameOver(false);
    setPaused(false);
    setDropInterval(INITIAL_DROP_INTERVAL);
    lastPositionRef.current = getInitialPosition(firstPiece);
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const gameOverRef = useRef(gameOver);
  gameOverRef.current = gameOver;

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (!gameOver && !paused) {
      gameLoopRef.current = setInterval(() => {
        if (pausedRef.current || gameOverRef.current) return;

        setPosition((prev) => {
          const newPosition = { ...prev, y: prev.y + 1 };

          if (checkCollision(board, currentPiece!, newPosition)) {
            const mergedBoard = mergePieceToBoard(board, currentPiece!, prev);
            const { board: clearedBoard, linesCleared } = clearLines(mergedBoard);

            if (prev.y <= 0) {
              gameOverRef.current = true;
              setGameOver(true);
              return prev;
            }

            setBoard(clearedBoard);

            if (linesCleared > 0) {
              setLines((prevLines) => {
                const newLines = prevLines + linesCleared;
                if (newLines >= (level + 1) * LEVEL_UP_LINES) {
                  setLevel((prevLevel) => prevLevel + 1);
                  setDropInterval((prevInterval) =>
                    Math.max(MIN_DROP_INTERVAL, prevInterval - 50)
                  );
                }
                return newLines;
              });
              setScore((prevScore) => prevScore + calculateScore(linesCleared, level));
            }

            const newPiece = nextPiece!;
            const newNextPiece = getRandomTetromino();
            setNextPiece(newNextPiece);
            setCurrentPiece(newPiece);
            const newPos = getInitialPosition(newPiece);
            lastPositionRef.current = newPos;

            if (checkCollision(clearedBoard, newPiece, newPos)) {
              setGameOver(true);
              return newPos;
            }

            return newPos;
          }

          return newPosition;
        });
      }, dropInterval);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [board, currentPiece, nextPiece, dropInterval, level, gameOver, paused]);

  const move = useCallback(
    (direction: Direction) => {
      if (gameOver || paused || !currentPiece) return;

      setPosition((prev) => {
        if (canMove(board, currentPiece, prev, direction)) {
          const newPosition = { ...prev };
          if (direction === 'left') {
            newPosition.x -= 1;
          } else if (direction === 'right') {
            newPosition.x += 1;
          } else if (direction === 'down') {
            newPosition.y += 1;
          }
          lastPositionRef.current = newPosition;
          return newPosition;
        }
        return prev;
      });
    },
    [board, currentPiece, gameOver, paused]
  );

  const rotate = useCallback(() => {
    if (gameOver || paused || !currentPiece) return;

    setPosition((prev) => {
      if (canRotate(board, currentPiece, prev)) {
        const rotatedShape = rotateMatrix(currentPiece.shape);
        const newPiece = { ...currentPiece, shape: rotatedShape };
        setCurrentPiece(newPiece);
        lastPositionRef.current = prev;
        return prev;
      }
      return prev;
    });
  }, [board, currentPiece, gameOver, paused]);

  const hardDropAction = useCallback(() => {
    if (gameOver || paused || !currentPiece) return;

    setPosition((prev) => {
      const droppedPosition = hardDrop(board, currentPiece, prev);
      const mergedBoard = mergePieceToBoard(board, currentPiece, droppedPosition);
      const { board: clearedBoard, linesCleared } = clearLines(mergedBoard);

      setBoard(clearedBoard);

      if (linesCleared > 0) {
        setLines((prevLines) => {
          const newLines = prevLines + linesCleared;
          if (newLines >= (level + 1) * LEVEL_UP_LINES) {
            setLevel((prevLevel) => prevLevel + 1);
            setDropInterval((prevInterval) =>
              Math.max(MIN_DROP_INTERVAL, prevInterval - 50)
            );
          }
          return newLines;
        });
        setScore((prevScore) => prevScore + calculateScore(linesCleared, level));
      }

      const newPiece = nextPiece!;
      const newNextPiece = getRandomTetromino();
      setNextPiece(newNextPiece);
      setCurrentPiece(newPiece);
      const newPos = getInitialPosition(newPiece);
      lastPositionRef.current = newPos;

      if (checkCollision(clearedBoard, newPiece, newPos)) {
        setGameOver(true);
        return newPos;
      }

      return newPos;
    });
  }, [board, currentPiece, nextPiece, level, gameOver, paused]);

  const togglePause = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDropAction();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
      }
    },
    [gameOver, move, rotate, hardDropAction, togglePause]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      startGame();
    }
  }, [currentPiece, gameOver, startGame]);

  return {
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
  };
};

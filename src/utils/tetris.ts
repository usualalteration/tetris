import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES, Tetromino, Position, TetrominoType } from '@/types/tetris';

export const createEmptyBoard = (): (string | null)[][] => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
};

export const getRandomTetromino = (): Tetromino => {
  const types = Object.keys(TETROMINOES) as TetrominoType[];
  const type = types[Math.floor(Math.random() * types.length)];
  return TETROMINOES[type];
};

export const rotateMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => 0)
  );

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - 1 - y] = matrix[y][x];
    }
  }

  return rotated;
};

export const checkCollision = (
  board: (string | null)[][],
  piece: Tetromino,
  position: Position
): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardX = position.x + x;
        const boardY = position.y + y;

        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          (boardY >= 0 && board[boardY][boardX] !== null)
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

export const mergePieceToBoard = (
  board: (string | null)[][],
  piece: Tetromino,
  position: Position
): (string | null)[][] => {
  const newBoard = board.map((row) => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardX = position.x + x;
        const boardY = position.y + y;

        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
};

export const clearLines = (board: (string | null)[][]): { board: (string | null)[][]; linesCleared: number } => {
  let linesCleared = 0;
  const newBoard = board.filter((row) => {
    const isFull = row.every((cell) => cell !== null);
    if (isFull) {
      linesCleared++;
    }
    return !isFull;
  });

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }

  return { board: newBoard, linesCleared };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const lineScores = [0, 40, 100, 300, 1200];
  return lineScores[linesCleared] * (level + 1);
};

export const getInitialPosition = (piece: Tetromino): Position => {
  const x = Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2);
  const y = 0;
  return { x, y };
};

export const canMove = (
  board: (string | null)[][],
  piece: Tetromino,
  position: Position,
  direction: 'left' | 'right' | 'down'
): boolean => {
  const newPosition = { ...position };

  if (direction === 'left') {
    newPosition.x -= 1;
  } else if (direction === 'right') {
    newPosition.x += 1;
  } else if (direction === 'down') {
    newPosition.y += 1;
  }

  return !checkCollision(board, piece, newPosition);
};

export const canRotate = (
  board: (string | null)[][],
  piece: Tetromino,
  position: Position
): boolean => {
  const rotatedShape = rotateMatrix(piece.shape);
  const rotatedPiece = { ...piece, shape: rotatedShape };
  return !checkCollision(board, rotatedPiece, position);
};

export const hardDrop = (
  board: (string | null)[][],
  piece: Tetromino,
  position: Position
): Position => {
  let dropPosition = { ...position };

  while (!checkCollision(board, piece, dropPosition)) {
    dropPosition.y += 1;
  }

  return { x: dropPosition.x, y: dropPosition.y - 1 };
};

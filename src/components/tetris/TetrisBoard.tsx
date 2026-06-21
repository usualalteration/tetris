import { BOARD_WIDTH, BOARD_HEIGHT } from '@/types/tetris';

interface TetrisBoardProps {
  board: (string | null)[][];
  currentPiece?: {
    shape: number[][];
    color: string;
  };
  position?: { x: number; y: number };
}

export const TetrisBoard = ({
  board,
  currentPiece,
  position,
}: TetrisBoardProps) => {
  const gridCells = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let cellClass = 'bg-gray-900/50 border-gray-800/30';

      if (board[y][x]) {
        cellClass = `${board[y][x]} border-gray-900`;
      } else if (currentPiece && position) {
        const pieceX = x - position.x;
        const pieceY = y - position.y;

        if (
          pieceY >= 0 &&
          pieceY < currentPiece.shape.length &&
          pieceX >= 0 &&
          pieceX < currentPiece.shape[0].length &&
          currentPiece.shape[pieceY][pieceX] !== 0
        ) {
          cellClass = `${currentPiece.color} border-gray-900`;
        }
      }

      gridCells.push(
        <div
          key={`${y}-${x}`}
          className={`w-full h-8 sm:h-9 border rounded-[2px] ${cellClass}`}
        />
      );
    }
  }

  return (
    <div
      className="grid gap-px bg-gray-800 p-1 rounded-lg shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
      }}
    >
      {gridCells}
    </div>
  );
};

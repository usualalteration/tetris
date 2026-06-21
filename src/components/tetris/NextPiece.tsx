import { TetrominoPreview } from './TetrominoPreview';

interface NextPieceProps {
  nextPiece: {
    shape: number[][];
    color: string;
  } | null;
}

export const NextPiece = ({ nextPiece }: NextPieceProps) => {
  if (!nextPiece) {
    return (
      <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Next</p>
          <div className="w-24 h-24 bg-gray-900/30 rounded-lg flex items-center justify-center">
            <span className="text-sm text-gray-500">Waiting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Next</p>
        <div className="flex justify-center">
          <TetrominoPreview shape={nextPiece.shape} color={nextPiece.color} />
        </div>
      </div>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface GameOverModalProps {
  gameOver: boolean;
  score: number;
  lines: number;
  level: number;
  onRestart: () => void;
}

export const GameOverModal = ({
  gameOver,
  score,
  lines,
  level,
  onRestart,
}: GameOverModalProps) => {
  if (!gameOver) {
    return null;
  }

  return (
    <Dialog open={gameOver} onOpenChange={(open) => !open && onRestart()}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-red-500">
            Game Over
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            Your score has been recorded
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Score</span>
            <span className="text-2xl font-bold text-white font-mono">{score}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">Lines</span>
            <span className="text-2xl font-bold text-white font-mono">{lines}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">Level</span>
            <span className="text-2xl font-bold text-white font-mono">{level + 1}</span>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={onRestart}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

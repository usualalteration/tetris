interface ScoreBoardProps {
  score: number;
  lines: number;
  level: number;
}

export const ScoreBoard = ({ score, lines, level }: ScoreBoardProps) => {
  const formatNumber = (num: number) => num.toString().padStart(6, '0');

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Score</p>
        <p className="text-2xl font-bold text-white font-mono">
          {formatNumber(score)}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Lines</p>
        <p className="text-xl font-bold text-white font-mono">{lines}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Level</p>
        <p className="text-xl font-bold text-white font-mono">{level + 1}</p>
      </div>
    </div>
  );
};

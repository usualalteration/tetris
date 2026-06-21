interface TetrominoPreviewProps {
  shape: number[][];
  color: string;
}

export const TetrominoPreview = ({ shape, color }: TetrominoPreviewProps) => {
  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${shape[0].length}, minmax(0, 1fr))`,
      }}
    >
      {shape.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[2px] ${
              cell ? color : 'bg-transparent'
            }`}
          />
        ))
      )}
    </div>
  );
};

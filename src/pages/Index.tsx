import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
            Tetris
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-lg mx-auto">
            A classic block puzzle game
          </p>
        </div>

        <div className="w-full flex justify-center">
          <Button
            asChild
            className="h-32 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-16"
          >
            <Link to="/tetris">
              Play Tetris
              <span className="text-4xl ml-4">🎮</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { Gamepad2 } from "lucide-react";

const Header = () => {
  return (
    <div className="flex flex-col items-center mb-6 lg:mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Gamepad2 className="w-8 h-8 lg:w-10 lg:h-10 text-accent animate-pulse" />
        <h1 className="game-title text-3xl sm:text-4xl lg:text-5xl">
          PAIRPONG
        </h1>

        <Gamepad2 className="w-8 h-8 lg:w-10 lg:h-10 text-accent animate-pulse" />
      </div>
      <p className="text-textMuted text-xs sm:text-sm text-center">
        Crypto Price Battle Arena
      </p>
    </div>
  );
};

export default Header;

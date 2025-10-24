import { Zap, Target } from "lucide-react";

const ModeToggle = ({ gameMode, isRunning, onToggle }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="game-card inline-flex p-1 gap-1">
        <button
          onClick={onToggle}
          disabled={isRunning}
          className={`mode-button ${
            gameMode === "normal" ? "mode-button-active" : ""
          }`}
        >
          <Zap size={16} />
          <span>NORMAL MODE</span>
        </button>
        <button
          onClick={onToggle}
          disabled={isRunning}
          className={`mode-button ${
            gameMode === "prediction" ? "mode-button-active-prediction" : ""
          }`}
        >
          <Target size={16} />
          <span>PREDICTION MODE</span>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;

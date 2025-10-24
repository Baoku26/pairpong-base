import { Timer } from "lucide-react";

const BattleStats = ({
  gameState,
  coinA,
  coinB,
  scoreA,
  scoreB,
  timer,
  gameStateRef,
}) => {
  if (gameState !== "battling") return null;

  return (
    <div className="battle-stats-container">
      {/* Fighter A Stats */}
      <div className="fighter-stat">
        <div className="fighter-badge fighter-badge-a">
          <span className="fighter-symbol">{coinA?.symbol || "BTC"}</span>
        </div>
        <div className="stat-details">
          <div className="stat-value">{scoreA}</div>
          <div className="stat-label">SCORE</div>
          <div className="stat-change">
            <span
              className={
                gameStateRef.current.totalChangeA >= 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              {gameStateRef.current.totalChangeA >= 0 ? "+" : ""}
              {gameStateRef.current.totalChangeA?.toFixed(2) || "0.00"}%
            </span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="battle-timer">
        <Timer className="w-5 h-5 text-accent mb-1" />
        <div className="timer-display">
          <span className="timer-value">{timer}</span>
          <span className="timer-unit">SEC</span>
        </div>
      </div>

      {/* Fighter B Stats */}
      <div className="fighter-stat">
        <div className="stat-details text-right">
          <div className="stat-value">{scoreB}</div>
          <div className="stat-label">SCORE</div>
          <div className="stat-change">
            <span
              className={
                gameStateRef.current.totalChangeB >= 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              {gameStateRef.current.totalChangeB >= 0 ? "+" : ""}
              {gameStateRef.current.totalChangeB?.toFixed(2) || "0.00"}%
            </span>
          </div>
        </div>
        <div className="fighter-badge fighter-badge-b">
          <span className="fighter-symbol">{coinB?.symbol || "ETH"}</span>
        </div>
      </div>
    </div>
  );
};

export default BattleStats;

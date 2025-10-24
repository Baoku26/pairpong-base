import { Swords, Trophy } from "lucide-react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants/gameConstants";

const BattleArena = ({
  gameState,
  canvasRef,
  replayCanvasRef,
  winner,
  coinA,
  coinB,
  finalScoreA,
  finalScoreB,
  gameStateRef,
  gameMode,
  userPrediction,
  replaySnapshot,
}) => {
  return (
    <div className="battle-arena">
      {/* Idle State */}
      {gameState === "idle" && (
        <div className="arena-idle-state">
          <div className="idle-icon-wrapper">
            <Swords className="idle-icon" />
          </div>
          <h2 className="idle-title">READY TO BATTLE</h2>
          <p className="idle-subtitle">
            {gameMode === "prediction"
              ? "Connect wallet & pick your winner to start"
              : "Select your fighters and press START"}
          </p>
          <div className="idle-decorations">
            <div className="decoration-dot"></div>
            <div className="decoration-dot"></div>
            <div className="decoration-dot"></div>
          </div>
        </div>
      )}

      {/* Battle In Progress */}
      {gameState === "battling" && (
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="battle-canvas"
        />
      )}

      {/* Battle Ended */}
      {gameState === "ended" && (
        <div className="arena-end-state">
          <div className="victory-burst">
            <Trophy className="victory-icon" />
          </div>

          <div className="victory-content">
            <div className="victory-label">CHAMPION</div>
            <div className="victory-coin">
              {winner === "TIE"
                ? "DRAW"
                : winner === "A"
                ? coinA?.symbol
                : coinB?.symbol}
            </div>
            <div className="victory-score">
              {finalScoreA} - {finalScoreB}
            </div>
            <div className="victory-performance">
              {winner === "TIE"
                ? "Equal Performance"
                : `${(winner === "A"
                    ? gameStateRef.current.totalChangeA
                    : gameStateRef.current.totalChangeB
                  )?.toFixed(2)}% Performance`}
            </div>

            {/* Prediction Result */}
            {gameMode === "prediction" &&
              userPrediction &&
              winner !== "TIE" && (
                <div
                  className={`prediction-result ${
                    userPrediction === winner
                      ? "prediction-correct"
                      : "prediction-wrong"
                  }`}
                >
                  <div className="prediction-result-text">
                    {userPrediction === winner
                      ? "✓ CORRECT PREDICTION!"
                      : "✗ WRONG PREDICTION"}
                  </div>
                </div>
              )}
          </div>

          {/* Replay Canvas */}
          {winner !== "TIE" && replaySnapshot && (
            <div className="replay-section">
              <div className="replay-label">▶ WINNING MOMENT</div>
              <div className="replay-canvas-wrapper">
                <canvas
                  ref={replayCanvasRef}
                  width={180}
                  height={120}
                  className="replay-canvas"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BattleArena;

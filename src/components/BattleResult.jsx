import { TrendingUp, Award } from "lucide-react";

const BattleResult = ({
  gameState,
  winner,
  coinA,
  coinB,
  scoreA,
  scoreB,
  //   finalScoreA,
  //   finalScoreB,
  gameStateRef,
}) => {
  return (
    <div className="game-card">
      <h3 className="card-title mb-4 flex items-center gap-2">
        <Award className="w-4 h-4" />
        BATTLE RESULT
      </h3>

      {/* Idle State */}
      {gameState === "idle" && (
        <div className="result-idle">
          <div className="result-empty-icon">
            <TrendingUp className="w-8 h-8 text-textMuted/30" />
          </div>
          <p className="text-textMuted text-xs text-center">
            No battle results yet
          </p>
        </div>
      )}

      {/* Battle In Progress */}
      {gameState === "battling" && (
        <div className="result-active">
          <p className="text-accent text-xs mb-4 font-semibold animate-pulse">
            ⚔️ BATTLE IN PROGRESS
          </p>

          <div className="space-y-3">
            {/* Score Cards */}
            <div className="result-score-card result-score-card-a">
              <span className="result-coin-name">{coinA?.symbol}</span>
              <span className="result-score">{scoreA}</span>
            </div>

            <div className="result-score-card result-score-card-b">
              <span className="result-coin-name">{coinB?.symbol}</span>
              <span className="result-score">{scoreB}</span>
            </div>
          </div>

          {/* Performance Section */}
          <div className="result-divider"></div>

          <div>
            <h4 className="result-section-title">Performance</h4>
            <div className="space-y-2">
              <div className="result-performance-row">
                <span className="result-performance-label">
                  {coinA?.symbol}
                </span>
                <span
                  className={`result-performance-value ${
                    gameStateRef.current.totalChangeA >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {gameStateRef.current.totalChangeA >= 0 ? "+" : ""}
                  {gameStateRef.current.totalChangeA?.toFixed(2) || "0.00"}%
                </span>
              </div>
              <div className="result-performance-row">
                <span className="result-performance-label">
                  {coinB?.symbol}
                </span>
                <span
                  className={`result-performance-value ${
                    gameStateRef.current.totalChangeB >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {gameStateRef.current.totalChangeB >= 0 ? "+" : ""}
                  {gameStateRef.current.totalChangeB?.toFixed(2) || "0.00"}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Battle Ended */}
      {gameState === "ended" && winner && (
        <div className="result-ended">
          {/* Final Matchup */}
          <div className="result-matchup">
            <div className="result-matchup-side">
              <div
                className={`result-matchup-coin ${
                  winner === "A" ? "result-matchup-winner" : ""
                }`}
              >
                {coinA?.symbol}
              </div>
              <div className="result-matchup-change">
                {gameStateRef.current.totalChangeA?.toFixed(2)}%
              </div>
            </div>

            <div className="result-matchup-vs">VS</div>

            <div className="result-matchup-side">
              <div
                className={`result-matchup-coin ${
                  winner === "B" ? "result-matchup-winner" : ""
                }`}
              >
                {coinB?.symbol}
              </div>
              <div className="result-matchup-change">
                {gameStateRef.current.totalChangeB?.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Winner Badge */}
          {winner !== "TIE" && (
            <div className="result-winner-badge">
              <div className="result-winner-label">🏆 WINNER</div>
              <div className="result-winner-coin">
                {winner === "A" ? coinA?.symbol : coinB?.symbol}
              </div>
            </div>
          )}

          {winner === "TIE" && (
            <div className="result-tie-badge">
              <div className="result-tie-text">⚖️ IT'S A TIE!</div>
            </div>
          )}

          {/* Performance Margin */}
          <div className="result-divider"></div>
          <div className="result-margin">
            <div className="result-margin-label">Performance Margin</div>
            <div className="result-margin-value">
              {Math.abs(
                gameStateRef.current.totalChangeA -
                  gameStateRef.current.totalChangeB
              ).toFixed(2)}
              %
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleResult;

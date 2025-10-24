const PredictionSelector = ({
  coinA,
  coinB,
  userPrediction,
  isRunning,
  gameState,
  onSelectPrediction,
}) => {
  return (
    <div className="game-card prediction-card">
      <h3 className="card-title mb-4 text-secondary">MAKE YOUR PREDICTION</h3>

      <p className="text-textMuted text-xs mb-4 text-center">
        Which coin will perform better?
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelectPrediction("A")}
          disabled={isRunning || gameState === "ended"}
          className={`prediction-button ${
            userPrediction === "A" ? "prediction-button-selected-a" : ""
          }`}
        >
          <span className="prediction-coin-label">Fighter A</span>
          <span className="prediction-coin-symbol">
            {coinA?.symbol || "BTC"}
          </span>
        </button>

        <button
          onClick={() => onSelectPrediction("B")}
          disabled={isRunning || gameState === "ended"}
          className={`prediction-button ${
            userPrediction === "B" ? "prediction-button-selected-b" : ""
          }`}
        >
          <span className="prediction-coin-label">Fighter B</span>
          <span className="prediction-coin-symbol">
            {coinB?.symbol || "ETH"}
          </span>
        </button>
      </div>

      {userPrediction && (
        <div className="mt-3 p-2 bg-dark/50 rounded text-center border border-secondary/30">
          <p className="text-secondary text-xs">
            ✓ Betting on{" "}
            {userPrediction === "A" ? coinA?.symbol : coinB?.symbol}
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionSelector;

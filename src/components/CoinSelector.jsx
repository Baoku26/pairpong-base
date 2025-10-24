const CoinSelector = ({
  coins,
  coinA,
  coinB,
  isLoadingCoins,
  isRunning,
  gameState,
  onSelectCoinA,
  onSelectCoinB,
}) => {
  return (
    <div className="game-card">
      <h3 className="card-title mb-4">SELECT FIGHTERS</h3>

      <div className="space-y-3">
        {/* Coin A */}
        <div>
          <label className="block text-textMuted text-xs mb-2 uppercase tracking-wide">
            Fighter A
          </label>
          <div className="select-wrapper">
            <select
              value={coinA?.id || ""}
              onChange={(e) =>
                onSelectCoinA(coins.find((c) => c.id === e.target.value))
              }
              disabled={isRunning || isLoadingCoins || gameState === "ended"}
              className="game-select"
            >
              {isLoadingCoins ? (
                <option>Loading coins...</option>
              ) : (
                coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.symbol} - {coin.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center py-2">
          <div className="flex-1 h-px bg-border"></div>
          <span className="px-3 text-accent font-bold text-sm">VS</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Coin B */}
        <div>
          <label className="block text-textMuted text-xs mb-2 uppercase tracking-wide">
            Fighter B
          </label>
          <div className="select-wrapper">
            <select
              value={coinB?.id || ""}
              onChange={(e) =>
                onSelectCoinB(coins.find((c) => c.id === e.target.value))
              }
              disabled={isRunning || isLoadingCoins || gameState === "ended"}
              className="game-select"
            >
              {isLoadingCoins ? (
                <option>Loading coins...</option>
              ) : (
                coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.symbol} - {coin.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinSelector;

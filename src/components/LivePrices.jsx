import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const LivePrices = ({ coinA, coinB, priceData, loadingPrices }) => {
  const formatPrice = (coinId) => {
    const price = priceData[coinId]?.usd;
    return price
      ? `$${price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "$0.00";
  };

  const formatChange = (coinId) => {
    const change = priceData[coinId]?.usd_24h_change;
    return change || 0;
  };

  return (
    <div className="game-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-title">LIVE PRICES</h3>
        {loadingPrices && (
          <Activity className="w-4 h-4 text-accent animate-pulse" />
        )}
      </div>

      <div className="space-y-3">
        {/* Coin A Price */}
        <div className="price-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary font-bold text-sm">
              {coinA?.symbol || "BTC"}
            </span>
            <span className="text-text font-bold text-lg">
              {formatPrice(coinA?.id)}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1">
            {formatChange(coinA?.id) >= 0 ? (
              <TrendingUp className="w-3 h-3 text-success" />
            ) : (
              <TrendingDown className="w-3 h-3 text-danger" />
            )}
            <span
              className={`text-xs font-bold ${
                formatChange(coinA?.id) >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatChange(coinA?.id) >= 0 ? "+" : ""}
              {formatChange(coinA?.id).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Coin B Price */}
        <div className="price-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-secondary font-bold text-sm">
              {coinB?.symbol || "ETH"}
            </span>
            <span className="text-text font-bold text-lg">
              {formatPrice(coinB?.id)}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1">
            {formatChange(coinB?.id) >= 0 ? (
              <TrendingUp className="w-3 h-3 text-success" />
            ) : (
              <TrendingDown className="w-3 h-3 text-danger" />
            )}
            <span
              className={`text-xs font-bold ${
                formatChange(coinB?.id) >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatChange(coinB?.id) >= 0 ? "+" : ""}
              {formatChange(coinB?.id).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-textMuted text-xs text-center">24h price changes</p>
      </div>
    </div>
  );
};

export default LivePrices;

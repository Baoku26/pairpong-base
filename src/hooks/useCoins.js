import { useState, useEffect, useCallback } from "react";

const API_CALL_INTERVAL = 1000;

export const useCoins = () => {
  const [coins, setCoins] = useState([]);
  const [isLoadingCoins, setIsLoadingCoins] = useState(true);
  const [coinA, setCoinA] = useState(null);
  const [coinB, setCoinB] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const lastApiCallRef = useState(0);

  const rateLimitCheck = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallRef.current;
    if (timeSinceLastCall < API_CALL_INTERVAL) {
      const waitTime = API_CALL_INTERVAL - timeSinceLastCall;
      return new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    lastApiCallRef.current = now;
    return Promise.resolve();
  }, []);

  useEffect(() => {
    const fetchCoins = async (attempt = 1) => {
      setIsLoadingCoins(true);
      setApiError(null);

      try {
        await rateLimitCheck();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0)
          throw new Error("Invalid data");

        const formattedCoins = data.map((coin) => ({
          id: coin.id,
          symbol: coin.symbol?.toUpperCase() || "UNKNOWN",
          name: coin.name || "Unknown Coin",
          image: coin.image,
        }));

        setCoins(formattedCoins);
        setRetryCount(0);

        const btc = formattedCoins.find((c) => c.symbol === "BTC");
        const eth = formattedCoins.find((c) => c.symbol === "ETH");
        if (btc) setCoinA(btc);
        if (eth) setCoinB(eth);
      } catch (error) {
        console.error(`[Coins Fetch] Attempt ${attempt}:`, error);
        if (attempt < 3) {
          setTimeout(() => {
            setRetryCount(attempt);
            fetchCoins(attempt + 1);
          }, Math.pow(2, attempt) * 1000);
        } else {
          setApiError(`Failed to load coins: ${error.message}`);
          const fallbackCoins = [
            { id: "bitcoin", symbol: "BTC", name: "Bitcoin", image: "" },
            { id: "ethereum", symbol: "ETH", name: "Ethereum", image: "" },
          ];
          setCoins(fallbackCoins);
          setCoinA(fallbackCoins[0]);
          setCoinB(fallbackCoins[1]);
        }
      } finally {
        setIsLoadingCoins(false);
      }
    };

    fetchCoins();
  }, [rateLimitCheck]);

  return {
    coins,
    isLoadingCoins,
    coinA,
    coinB,
    setCoinA,
    setCoinB,
    apiError,
    retryCount,
  };
};

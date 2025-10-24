import { useState, useEffect, useCallback, useRef } from "react";

const API_CALL_INTERVAL = 1000;

export const usePrices = (coinA, coinB) => {
  const [priceData, setPriceData] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const lastApiCallRef = useRef(0);

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

  const fetchCurrentPrices = useCallback(
    async (attempt = 1) => {
      if (!coinA || !coinB) return;
      setLoadingPrices(true);

      try {
        await rateLimitCheck();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinA.id},${coinB.id}&vs_currencies=usd&include_24hr_change=true`,
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
        if (!data[coinA.id] || !data[coinB.id])
          throw new Error("Price data missing");

        setPriceData(data);
        setRetryCount(0);
        setApiError(null);
      } catch (error) {
        console.error(`[Price Fetch] Attempt ${attempt}:`, error);
        if (attempt < 3) {
          setTimeout(() => {
            setRetryCount(attempt);
            fetchCurrentPrices(attempt + 1);
          }, Math.pow(2, attempt) * 1000);
        } else {
          setApiError(
            error.name === "AbortError"
              ? "Request timeout"
              : `Price fetch failed: ${error.message}`
          );
        }
      } finally {
        setLoadingPrices(false);
      }
    },
    [coinA, coinB, rateLimitCheck]
  );

  useEffect(() => {
    if (coinA && coinB) fetchCurrentPrices();
  }, [coinA, coinB, fetchCurrentPrices]);

  useEffect(() => {
    if (!coinA || !coinB) return;
    const interval = setInterval(() => fetchCurrentPrices(), 30000);
    return () => clearInterval(interval);
  }, [coinA, coinB, fetchCurrentPrices]);

  return {
    priceData,
    loadingPrices,
    apiError,
    retryCount,
    fetchCurrentPrices,
  };
};

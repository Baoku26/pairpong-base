import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Component imports
import Header from "./components/Header";
import ModeToggle from "./components/ModeToggle";
import CoinSelector from "./components/CoinSelector";
import PredictionSelector from "./components/PredictionSelector";
import LivePrices from "./components/LivePrices";
import BattleArena from "./components/BattleArena";
import BattleStats from "./components/BattleStats";
import BattleResult from "./components/BattleResult";
import LeaderBoard from "./components/leader-board";
import NotificationBanner from "./components/NotificationBanner";
import Modal from "./components/Modal";

// Services
// NOTE: On-page blockchain integration removed. Re-enable and implement
// Solidity/web3 contract calls when the smart contract is ready.

// Constants
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_OFFSET,
  BASE_PADDLE_HEIGHT,
  BALL_SIZE,
  BASE_SPEED,
  GAME_DURATION,
  API_CALL_INTERVAL,
  TRAIL_LENGTH,
} from "./constants/gameConstants";

// Hooks
import { useCoins } from "./hooks/useCoins";
import { usePrices } from "./hooks/usePrices";
import { useGameLoop } from "./hooks/useGameLoop";

const CryptoPongBattle = () => {
  // Mode state
  const [gameMode, setGameMode] = useState("normal");
  const [userPrediction, setUserPrediction] = useState(null);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info"
  });

  // Wallet state
  // Wallet/on-chain submission removed from this page. Keep UI (WalletConnect)
  // for when Solidity contract integration is added.

  // Game state
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(40);
  const [winner, setWinner] = useState(null);
  const [gameState, setGameState] = useState("idle");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [finalScoreA, setFinalScoreA] = useState(0);
  const [finalScoreB, setFinalScoreB] = useState(0);
  const [replaySnapshot, setReplaySnapshot] = useState(null);
  const [loadingHistorical, setLoadingHistorical] = useState(false);
  const [historicalData, setHistoricalData] = useState({
    coinA: [],
    coinB: [],
  });

  // Custom hooks
  const {
    coins,
    isLoadingCoins,
    coinA,
    coinB,
    setCoinA,
    setCoinB,
    apiError: coinsError,
  } = useCoins();

  const {
    priceData,
    loadingPrices,
    apiError: pricesError,
  } = usePrices(coinA, coinB);

  // Refs
  const canvasRef = useRef(null);
  const replayCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const replayAnimationRef = useRef(null);
  const ballTrailRef = useRef([]);
  const endGameRef = useRef(null);
  const gameStateRef = useRef({
    balls: [
      {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        velX: BASE_SPEED,
        velY: BASE_SPEED,
      },
    ],
    paddleAY: CANVAS_HEIGHT / 2 - BASE_PADDLE_HEIGHT / 2,
    paddleBY: CANVAS_HEIGHT / 2 - BASE_PADDLE_HEIGHT / 2,
    paddleAHeight: BASE_PADDLE_HEIGHT,
    paddleBHeight: BASE_PADDLE_HEIGHT,
    paddleASpeed: 1,
    paddleBSpeed: 1,
    priceChangePercentA: 0,
    priceChangePercentB: 0,
    priceDataIndex: 0,
    totalChangeA: 0,
    totalChangeB: 0,
    gameStartTime: null,
    endGameTriggered: false,
  });

  const apiError = coinsError || pricesError;

  // Modal helper function
  const showModal = (title, message, type = "info") => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Wallet connection check removed. This page no longer attempts on-chain
  // interactions. Reconnect logic should be reintroduced alongside the
  // Solidity contract implementation.

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(
        0,
        Math.ceil((GAME_DURATION - elapsed) / 1000)
      );
      setTimer(remaining);
      if (remaining === 0 && !gameStateRef.current.endGameTriggered) {
        gameStateRef.current.endGameTriggered = true;
        clearInterval(interval);
        setTimeout(() => {
          if (endGameRef.current) endGameRef.current();
        }, 100);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Game loop (moved to custom hook for better organization)
  const { animateGame } = useGameLoop({
    canvasRef,
    gameStateRef,
    historicalData,
    ballTrailRef,
    setScoreA,
    setScoreB,
  });

  // Animation effect
  useEffect(() => {
    if (gameState === "battling" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      animateGame(ctx, animationRef);
    }
    const savedAnim = animationRef.current;
    return () => {
      if (savedAnim) cancelAnimationFrame(savedAnim);
    };
  }, [gameState, historicalData, animateGame]);

  // Replay animation effect
  useEffect(() => {
    if (gameState === "ended" && replaySnapshot && replayCanvasRef.current) {
      const canvas = replayCanvasRef.current;
      const ctx = canvas.getContext("2d");
      let frame = 0;
      const maxFrames = 60;

      const animateReplay = () => {
        frame++;
        if (frame > maxFrames) frame = 0;

        const progress = frame / maxFrames;

        ctx.fillStyle = "#1a1f2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scale = canvas.width / CANVAS_WIDTH;

        const ballX =
          winner === "A"
            ? replaySnapshot.ballX * scale +
              (canvas.width - replaySnapshot.ballX * scale) * progress
            : replaySnapshot.ballX * scale -
              replaySnapshot.ballX * scale * progress;
        const ballY = replaySnapshot.ballY * scale;

        // Draw paddles and ball
        ctx.fillStyle = "#00ff88";
        ctx.fillRect(
          PADDLE_OFFSET * scale,
          replaySnapshot.paddleAY * scale,
          PADDLE_WIDTH * scale,
          replaySnapshot.paddleAHeight * scale
        );

        ctx.fillStyle = "#ffd700";
        ctx.fillRect(
          canvas.width - (PADDLE_OFFSET + PADDLE_WIDTH) * scale,
          replaySnapshot.paddleBY * scale,
          PADDLE_WIDTH * scale,
          replaySnapshot.paddleBHeight * scale
        );

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ballX, ballY, (BALL_SIZE / 2) * scale, 0, Math.PI * 2);
        ctx.fill();

        replayAnimationRef.current = requestAnimationFrame(animateReplay);
      };

      animateReplay();

      return () => {
        if (replayAnimationRef.current) {
          cancelAnimationFrame(replayAnimationRef.current);
        }
      };
    }
  }, [gameState, replaySnapshot, winner]);

  const handleModeToggle = () => {
    if (isRunning) {
      showModal("Battle in Progress", "Cannot change mode during an active battle. Please wait for the current battle to finish.", "warning");
      return;
    }
    setGameMode(gameMode === "normal" ? "prediction" : "normal");
    setUserPrediction(null);
  };

  const fetchHistoricalData = async (coin, days = 1) => {
    try {
      const CORS_PROXY = "https://thingproxy.freehostingservice.com/fetch/";
      const url = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${days}`;
      const response = await fetch(CORS_PROXY + url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (
        !data.prices ||
        !Array.isArray(data.prices) ||
        data.prices.length === 0
      ) {
        throw new Error("No price history");
      }
      return data.prices;
    } catch (error) {
      console.error(error);
      return generateFallbackData(days);
    }
  };

  const generateFallbackData = (days) => {
    const dataPoints = days * 24;
    const basePrice = 50000;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = Date.now() - (dataPoints - i) * (60 * 60 * 1000);
      const price = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      data.push([timestamp, price]);
    }
    return data;
  };

  const startGame = async () => {
    if (!coinA || !coinB) {
      showModal("Select Fighters", "Please select both cryptocurrencies to start the battle.", "info");
      return;
    }

    if (gameMode === "prediction" && !userPrediction) {
      showModal("Make Your Prediction", "Please select which cryptocurrency you think will win before starting the battle.", "info");
      return;
    }

    try {
      setLoadingHistorical(true);
      setGameState("battling");

      const [dataA, dataB] = await Promise.all([
        fetchHistoricalData(coinA),
        fetchHistoricalData(coinB),
      ]);

      setHistoricalData({ coinA: dataA, coinB: dataB });
      setIsRunning(true);
      setWinner(null);
      setScoreA(0);
      setScoreB(0);
      setFinalScoreA(0);
      setFinalScoreB(0);

      gameStateRef.current = {
        balls: [
          {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            velX: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1),
            velY: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1),
          },
        ],
        paddleAY: CANVAS_HEIGHT / 2 - BASE_PADDLE_HEIGHT / 2,
        paddleBY: CANVAS_HEIGHT / 2 - BASE_PADDLE_HEIGHT / 2,
        paddleAHeight: BASE_PADDLE_HEIGHT,
        paddleBHeight: BASE_PADDLE_HEIGHT,
        paddleASpeed: 1,
        paddleBSpeed: 1,
        priceChangePercentA: 0,
        priceChangePercentB: 0,
        priceDataIndex: 0,
        totalChangeA: 0,
        totalChangeB: 0,
        gameStartTime: Date.now(),
        endGameTriggered: false,
      };

      ballTrailRef.current = [];
    } catch (error) {
      console.error(error);
      showModal("Battle Failed", "Failed to start battle. Please check your connection and try again.", "error");
    } finally {
      setLoadingHistorical(false);
    }
  };

  const endGame = useCallback(async () => {
    setIsRunning(false);

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const state = gameStateRef.current;
    const changeA = state.totalChangeA;
    const changeB = state.totalChangeB;

    let winnerSide = null;
    let winnerCoin = "";

    if (Math.abs(changeA - changeB) < 0.5) {
      winnerSide = "TIE";
      winnerCoin = "TIE";
    } else if (changeA > changeB) {
      winnerSide = "A";
      winnerCoin = coinA?.symbol || "BTC";
      setScoreA((prev) => prev + 1);
    } else {
      winnerSide = "B";
      winnerCoin = coinB?.symbol || "ETH";
      setScoreB((prev) => prev + 1);
    }

    setTimeout(async () => {
      const finalA = winnerSide === "A" ? scoreA + 1 : scoreA;
      const finalB = winnerSide === "B" ? scoreB + 1 : scoreB;

      setFinalScoreA(finalA);
      setFinalScoreB(finalB);
      setWinner(winnerSide);
      setGameState("ended");

      setReplaySnapshot({
        ballX: state.balls[0].x,
        ballY: state.balls[0].y,
        paddleAY: state.paddleAY,
        paddleBY: state.paddleBY,
        paddleAHeight: state.paddleAHeight,
        paddleBHeight: state.paddleBHeight,
      });

      if (gameMode === "prediction" && winnerSide !== "TIE") {
        // On-chain submission removed. Record kept locally for now.
        const localRecord = {
          coinA: coinA?.symbol || "BTC",
          coinB: coinB?.symbol || "ETH",
          predictedWinner:
            userPrediction === "A"
              ? coinA?.symbol || "BTC"
              : coinB?.symbol || "ETH",
          actualWinner: winnerCoin,
          performanceDelta: Math.abs(changeA - changeB),
          scoreA: finalA,
          scoreB: finalB,
          timestamp: Date.now(),
        };
        console.log("Battle result (local only):", localRecord);
        // TODO: When Solidity contracts are ready, replace this with on-chain
        // submission logic that calls the deployed contract.
      }
    }, 50);
  }, [coinA, coinB, gameMode, userPrediction, scoreA, scoreB]);

  // Keep a stable ref to the latest endGame function so other effects can
  // call it without needing to include the function in their dependency
  // arrays.
  useEffect(() => {
    endGameRef.current = endGame;
  }, [endGame]);

  const resetGame = () => {
    setGameState("idle");
    setWinner(null);
    setScoreA(0);
    setScoreB(0);
    setFinalScoreA(0);
    setFinalScoreB(0);
    setTimer(40);
    setReplaySnapshot(null);
    setUserPrediction(null);

    if (replayAnimationRef.current) {
      cancelAnimationFrame(replayAnimationRef.current);
    }

    gameStateRef.current = {
      balls: [
        {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
          velX: BASE_SPEED,
          velY: BASE_SPEED,
        },
      ],
      paddleAY: CANVAS_HEIGHT / 2 - BASE_PADDLE_HEIGHT / 2,
      paddleBY: CANVAS_HEIGHT / 2 - BASE_PADDLE_HEIGHT / 2,
      paddleAHeight: BASE_PADDLE_HEIGHT,
      paddleBHeight: BASE_PADDLE_HEIGHT,
      paddleASpeed: 1,
      paddleBSpeed: 1,
      priceChangePercentA: 0,
      priceChangePercentB: 0,
      priceDataIndex: 0,
      totalChangeA: 0,
      totalChangeB: 0,
      gameStartTime: null,
      endGameTriggered: false,
    };
    ballTrailRef.current = [];
  };

  return (
    <div className="min-h-screen game-container">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <Header />

        {/* Mode Toggle */}
        <ModeToggle
          gameMode={gameMode}
          isRunning={isRunning}
          onToggle={handleModeToggle}
        />

        {/* Error Notification */}
        {apiError && <NotificationBanner message={apiError} type="error" />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3 space-y-4">
            <CoinSelector
              coins={coins}
              coinA={coinA}
              coinB={coinB}
              isLoadingCoins={isLoadingCoins}
              isRunning={isRunning}
              gameState={gameState}
              onSelectCoinA={setCoinA}
              onSelectCoinB={setCoinB}
            />

            {gameMode === "prediction" && (
              <PredictionSelector
                coinA={coinA}
                coinB={coinB}
                userPrediction={userPrediction}
                isRunning={isRunning}
                gameState={gameState}
                onSelectPrediction={setUserPrediction}
              />
            )}

            <button
              onClick={gameState === "ended" ? resetGame : startGame}
              disabled={isRunning || isLoadingCoins || loadingHistorical}
              className="game-button w-full"
            >
              {loadingHistorical
                ? "⚡ LOADING..."
                : gameState === "ended"
                ? "🔄 NEW BATTLE"
                : isRunning
                ? "⚔️ BATTLING"
                : "🎮 START BATTLE"}
            </button>

            <LivePrices
              coinA={coinA}
              coinB={coinB}
              priceData={priceData}
              loadingPrices={loadingPrices}
            />
          </div>

          {/* Center Panel - Battle Arena */}
          <div className="lg:col-span-6 space-y-4">
            <BattleStats
              gameState={gameState}
              coinA={coinA}
              coinB={coinB}
              scoreA={scoreA}
              scoreB={scoreB}
              timer={timer}
              gameStateRef={gameStateRef}
            />

            <BattleArena
              gameState={gameState}
              canvasRef={canvasRef}
              replayCanvasRef={replayCanvasRef}
              winner={winner}
              coinA={coinA}
              coinB={coinB}
              finalScoreA={finalScoreA}
              finalScoreB={finalScoreB}
              gameStateRef={gameStateRef}
              gameMode={gameMode}
              userPrediction={userPrediction}
              replaySnapshot={replaySnapshot}
            />
          </div>

          {/* Right Panel - Battle Result */}
          <div className="lg:col-span-3">
            <BattleResult
              gameState={gameState}
              winner={winner}
              coinA={coinA}
              coinB={coinB}
              scoreA={scoreA}
              scoreB={scoreB}
              finalScoreA={finalScoreA}
              finalScoreB={finalScoreB}
              gameStateRef={gameStateRef}
            />
          </div>
        </div>

        {/* Leaderboard */}
        {gameMode === "prediction" && (
          <div className="mt-8">
            <LeaderBoard />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default CryptoPongBattle;

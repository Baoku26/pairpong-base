import { useCallback } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_OFFSET,
  BASE_PADDLE_HEIGHT,
  BALL_SIZE,
  BASE_SPEED,
  GAME_DURATION,
  TRAIL_LENGTH,
} from "../constants/gameConstants";

export const useGameLoop = ({
  canvasRef,
  gameStateRef,
  historicalData,
  ballTrailRef,
  setScoreA,
  setScoreB,
}) => {
  const animateGame = useCallback(
    (ctx, animationRef) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const state = gameStateRef.current;

      // Dark gaming background
      ctx.fillStyle = "#0a0d11";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center line with glow effect
      ctx.strokeStyle = "rgba(0, 255, 136, 0.3)";
      ctx.setLineDash([10, 10]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      const elapsed = Date.now() - state.gameStartTime;
      const progressRatio = elapsed / GAME_DURATION;
      const dataIndex = Math.floor(
        progressRatio * (historicalData.coinA.length - 1)
      );

      if (
        dataIndex !== state.priceDataIndex &&
        dataIndex < historicalData.coinA.length &&
        dataIndex >= 0
      ) {
        state.priceDataIndex = dataIndex;

        const priceA = historicalData.coinA[dataIndex]?.[1] || 0;
        const priceB = historicalData.coinB[dataIndex]?.[1] || 0;
        const firstPriceA = historicalData.coinA[0]?.[1] || priceA;
        const firstPriceB = historicalData.coinB[0]?.[1] || priceB;

        state.totalChangeA = ((priceA - firstPriceA) / firstPriceA) * 100;
        state.totalChangeB = ((priceB - firstPriceB) / firstPriceB) * 100;

        const prevPriceA =
          historicalData.coinA[Math.max(0, dataIndex - 1)]?.[1] || priceA;
        const prevPriceB =
          historicalData.coinB[Math.max(0, dataIndex - 1)]?.[1] || priceB;

        const changeA = ((priceA - prevPriceA) / prevPriceA) * 100;
        const changeB = ((priceB - prevPriceB) / prevPriceB) * 100;

        state.priceChangePercentA = changeA;
        state.priceChangePercentB = changeB;

        state.paddleAHeight = Math.max(
          60,
          Math.min(160, BASE_PADDLE_HEIGHT + state.totalChangeA * 5)
        );
        state.paddleBHeight = Math.max(
          60,
          Math.min(160, BASE_PADDLE_HEIGHT + state.totalChangeB * 5)
        );
        state.paddleASpeed = 1 + Math.abs(changeA) / 5;
        state.paddleBSpeed = 1 + Math.abs(changeB) / 5;

        const volatilityA = Math.abs(changeA);
        const volatilityB = Math.abs(changeB);
        const totalVolatility = volatilityA + volatilityB;

        state.balls.forEach((ball) => {
          const momentumFactor = 1 + totalVolatility / 30;
          const direction = ball.velX > 0 ? 1 : -1;
          ball.velX = direction * BASE_SPEED * momentumFactor;
        });
      }

      state.balls.forEach((ball) => {
        ballTrailRef.current.push({ x: ball.x, y: ball.y });
        if (ballTrailRef.current.length > TRAIL_LENGTH) {
          ballTrailRef.current.shift();
        }

        ball.x += ball.velX;
        ball.y += ball.velY;

        if (
          ball.y <= BALL_SIZE / 2 ||
          ball.y >= CANVAS_HEIGHT - BALL_SIZE / 2
        ) {
          ball.velY = -ball.velY;
        }

        if (
          ball.x - BALL_SIZE / 2 <= PADDLE_OFFSET + PADDLE_WIDTH &&
          ball.y >= state.paddleAY &&
          ball.y <= state.paddleAY + state.paddleAHeight &&
          !state.endGameTriggered
        ) {
          ball.velX = Math.abs(ball.velX);
          const hitPos = (ball.y - state.paddleAY) / state.paddleAHeight - 0.5;
          ball.velY = hitPos * BASE_SPEED * 2;
        }

        if (
          ball.x + BALL_SIZE / 2 >=
            CANVAS_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH &&
          ball.y >= state.paddleBY &&
          ball.y <= state.paddleBY + state.paddleBHeight &&
          !state.endGameTriggered
        ) {
          ball.velX = -Math.abs(ball.velX);
          const hitPos = (ball.y - state.paddleBY) / state.paddleBHeight - 0.5;
          ball.velY = hitPos * BASE_SPEED * 2;
        }

        if (ball.x <= 0) {
          setScoreB((prev) => prev + 1);
          ball.x = CANVAS_WIDTH / 2;
          ball.y = CANVAS_HEIGHT / 2;
          ball.velX = BASE_SPEED;
          ball.velY = BASE_SPEED * (Math.random() > 0.5 ? 1 : -1);
          ballTrailRef.current = [];
        } else if (ball.x >= CANVAS_WIDTH) {
          setScoreA((prev) => prev + 1);
          ball.x = CANVAS_WIDTH / 2;
          ball.y = CANVAS_HEIGHT / 2;
          ball.velX = -BASE_SPEED;
          ball.velY = BASE_SPEED * (Math.random() > 0.5 ? 1 : -1);
          ballTrailRef.current = [];
        }

        // Draw trail
        ballTrailRef.current.forEach((pos, index) => {
          const alpha = (index + 1) / TRAIL_LENGTH;
          const trailSize = BALL_SIZE * (0.3 + alpha * 0.7);

          ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, trailSize / 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw ball with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ffd700";
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ball highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(
          ball.x - BALL_SIZE / 6,
          ball.y - BALL_SIZE / 6,
          BALL_SIZE / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // Paddle AI
      if (!state.endGameTriggered) {
        const closestBallA = state.balls.reduce((closest, ball) => {
          if (ball.x < CANVAS_WIDTH / 2 && ball.velX < 0) {
            return !closest || ball.x < closest.x ? ball : closest;
          }
          return closest;
        }, null);

        const closestBallB = state.balls.reduce((closest, ball) => {
          if (ball.x > CANVAS_WIDTH / 2 && ball.velX > 0) {
            return !closest || ball.x > closest.x ? ball : closest;
          }
          return closest;
        }, null);

        if (closestBallA) {
          const targetA = closestBallA.y - state.paddleAHeight / 2;
          const distance = Math.abs(
            closestBallA.x - (PADDLE_OFFSET + PADDLE_WIDTH)
          );
          const urgency = Math.max(0.1, 1 - distance / (CANVAS_WIDTH / 2));
          state.paddleAY +=
            (targetA - state.paddleAY) * 0.25 * state.paddleASpeed * urgency;
        }

        if (closestBallB) {
          const targetB = closestBallB.y - state.paddleBHeight / 2;
          const distance = Math.abs(
            closestBallB.x - (CANVAS_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH)
          );
          const urgency = Math.max(0.1, 1 - distance / (CANVAS_WIDTH / 2));
          state.paddleBY +=
            (targetB - state.paddleBY) * 0.25 * state.paddleBSpeed * urgency;
        }
      }

      state.paddleAY = Math.max(
        0,
        Math.min(CANVAS_HEIGHT - state.paddleAHeight, state.paddleAY)
      );
      state.paddleBY = Math.max(
        0,
        Math.min(CANVAS_HEIGHT - state.paddleBHeight, state.paddleBY)
      );

      // Draw paddles with rounded corners and glow
      const paddleRadius = PADDLE_WIDTH / 2;

      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ff88";
      ctx.fillStyle = "#00ff88";
      ctx.beginPath();
      ctx.roundRect(
        PADDLE_OFFSET,
        state.paddleAY,
        PADDLE_WIDTH,
        state.paddleAHeight,
        paddleRadius
      );
      ctx.fill();

      ctx.shadowColor = "#ffd700";
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.roundRect(
        CANVAS_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH,
        state.paddleBY,
        PADDLE_WIDTH,
        state.paddleBHeight,
        paddleRadius
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(() =>
        animateGame(ctx, animationRef)
      );
    },
    [
      canvasRef,
      gameStateRef,
      historicalData,
      ballTrailRef,
      setScoreA,
      setScoreB,
    ]
  );

  return { animateGame };
};

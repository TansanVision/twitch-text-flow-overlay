import React, { useEffect, useMemo, useRef } from "react";
import { css } from "@emotion/css";

const container = css`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const petalBase = css`
  position: absolute;
  top: -10%;
  border-radius: 5% 80% 10% 80%;
  background-color: #ffb6c1;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;

`;

const anim1 = css`
  animation-name: sakura1;
`;

const anim2 = css`
  animation-name: sakura2;
`;

const keyframes = css`
  @keyframes sakura1 {
    0% {
      top: -10%;
      transform: translateX(0) rotateX(0) rotateY(0);
    }
    100% {
      top: 100%;
      transform: translateX(15vw) rotateX(180deg) rotateY(360deg);
    }
  }

  @keyframes sakura2 {
    0% {
      top: -10%;
      transform: translateX(0);
    }
    100% {
      top: 100%;
      transform: translateX(-15vw) rotateX(180deg) rotateY(360deg);
    }
  }
`;

/**
 * 桜の花びらが舞うアニメーションコンポーネント
 * @returns JSX.Element
 */
export const Sakura: React.FC<{ onAnimationEnd?: () => void }> = ({ onAnimationEnd }) => {
  const onAnimationEndRef = useRef(onAnimationEnd);

  useEffect(() => {
    onAnimationEndRef.current = onAnimationEnd;
  }, [onAnimationEnd]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onAnimationEndRef.current?.();
    }, 1000 * 30);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const { petals } = useMemo(() => {
    const petals = Array.from({ length: 50 }).map((_, i) => {
    const left = `${(i / 50) * 100}%`;

    // サイズ（3パターン）
    const sizeType = i % 3;
    const size =
      sizeType === 0
        ? { width: "1vw", height: "0.5vw" }
        : sizeType === 1
        ? { width: "0.8vw", height: "0.4vw" }
        : { width: "0.6vw", height: "0.3vw" };

    // duration（4パターン）
    const durations = [5, 12, 8, 6];
    const duration = durations[i % 4];

    // delay（11パターン）
    const delays = [0, 9, 2, 5, 6, 7, 3, 1, 2, 11, 10];
    const delay = delays[i % 11];

      return (
        <span
          key={i}
          className={`${petalBase} ${i % 2 === 0 ? anim1 : anim2}`}
          style={{
            left,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            ...size,
          }}
        />
      );
    });

    return { petals };
  }, []);

  return <div className={`${container} ${keyframes}`}>{petals}</div>;
};

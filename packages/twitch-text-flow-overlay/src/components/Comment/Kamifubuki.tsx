import React from "react";
import { css } from "@emotion/css";

const container = css`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const base = css`
  position: absolute;
  top: -10%;
  will-change: transform;
  animation-timing-function: linear;
  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: 3;
`;

const keyframes = css`
  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotateZ(0deg) rotateX(0deg);
    }
    100% {
      transform: translateY(120vh) rotateZ(360deg) rotateX(720deg);
    }
  }
`;

/**
 * 紙吹雪が舞うアニメーションコンポーネント
 * @returns JSX.Element
 */
export const Kamifubuki: React.FC<{ onAnimationEnd?: () => void }> = ({ onAnimationEnd }) => {
  const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#5f27cd"];

  const pieces = Array.from({ length: 80 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;

    const size = Math.random() * 0.6 + 0.3; // 0.3vw〜0.9vw
    const width = `${size}vw`;
    const height = `${size * 2}vw`;

    const color = colors[i % colors.length];

    const duration = `${5 + Math.random() * 6}s`; // 5〜11秒
    const delay = `${Math.random() * 5}s`;

    const rotateZ = `${Math.random() * 360}deg`;

    return (
      <span
        key={i}
        className={base}
        onAnimationEnd={onAnimationEnd}
        style={{
          left,
          width,
          height,
          backgroundColor: color,
          animationName: "confetti-fall",
          animationDuration: duration,
          animationDelay: delay,
          transform: `rotateZ(${rotateZ})`,
        }}
      />
    );
  });

  return <div className={`${container} ${keyframes}`}>{pieces}</div>;
};

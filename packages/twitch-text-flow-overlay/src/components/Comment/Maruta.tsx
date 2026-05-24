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
  top: -120px;
  width: 200px;
  height: auto;
  will-change: transform;
  animation-timing-function: ease-in;
  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: 5;
`;

const keyframes = css`
  @keyframes log-fall {
    0% {
      transform: translateY(0) rotateZ(0deg);
    }
    100% {
      transform: translateY(120vh) rotateZ(40deg);
    }
  }
`;

// 丸太 SVG（React コンポーネント化）
const LogSVG = () => (
  <svg viewBox="0 0 200 60">
    <rect x="10" y="10" width="160" height="40" rx="20" ry="20" fill="#8b5a2b" />
    <circle cx="10" cy="30" r="20" fill="#deb887" />
    <circle cx="10" cy="30" r="14" fill="none" stroke="#c09060" strokeWidth="2" />
    <circle cx="10" cy="30" r="8" fill="none" stroke="#c09060" strokeWidth="2" />
    <path d="M 30 20 Q 80 10 150 25" stroke="#5a3a1a" strokeWidth="3" fill="none" opacity="0.6" />
    <path d="M 30 40 Q 90 55 150 35" stroke="#5a3a1a" strokeWidth="3" fill="none" opacity="0.6" />
  </svg>
);

/**
 * 丸太が落ちてくるアニメーションコンポーネント
 * @returns JSX.Element
 */
export const Maruta: React.FC<{ onAnimationEnd?: () => void }> = ({ onAnimationEnd }) => {
    const logs = Array.from({ length: 8 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;

    // 落下速度（2〜4秒）
    const duration = `${2 + Math.random() * 2}s`;

    // 遅延（0〜3秒）
    const delay = `${Math.random() * 3}s`;

    // 初期回転
    const rotate = `${Math.random() * 40 - 20}deg`;

    return (
      <div
        key={i}
        className={base}
        onAnimationEnd={onAnimationEnd}
        style={{
          left,
          animationName: "log-fall",
          animationDuration: duration,
          animationDelay: delay,
          transform: `rotateZ(${rotate})`,
        }}
      >
        <LogSVG />
      </div>
    );
  });

  return <div className={`${container} ${keyframes}`}>{logs}</div>;
};

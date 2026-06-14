import React, { useRef, useEffect } from "react";
import { css } from "@emotion/css";

const container = css`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const balloonBase = css`
  position: absolute;
  bottom: -20%;
  border-radius: 50%;
  opacity: 0.95;
  will-change: transform;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
`;

// 風船のハイライト（光沢）
const highlight = css`
  position: absolute;
  top: 15%;
  left: 20%;
  width: 30%;
  height: 20%;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  filter: blur(2px);
`;

// 紐
const stringStyle = css`
  position: absolute;
  bottom: -25%;
  left: 50%;
  width: 2px;
  height: 30%;
  background: rgba(0, 0, 0, 0.25);
  transform: translateX(-50%);
`;

const keyframes = css`
  @keyframes balloon-rise {
    0% {
      transform: translateX(0) translateY(0) scale(1);
    }
    100% {
      transform: translateX(-15px) translateY(-150vh) scale(1);
    }
  }
`;

/**
 * 風船が上昇するアニメーションを表示するコンポーネント
 * @returns JSX.Element - 風船アニメーションの要素
 */
export const Balloons: React.FC<{ id?: string; onAnimationEnd?: (id?: string) => void }> = ({ id, onAnimationEnd }) => {
  const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#5f27cd"];

    const onAnimationEndRef = useRef(onAnimationEnd);
    useEffect(() => {
      onAnimationEndRef.current = onAnimationEnd;
    }, [onAnimationEnd]);

   React.useEffect(() => {
     const timeoutId = window.setTimeout(() => {
       onAnimationEndRef.current?.(id);
     }, 10000);

     return () => {
       window.clearTimeout(timeoutId);
     };
   }, [id]);

  const balloons = Array.from({ length: 35 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;

    // 楕円形の風船サイズ（リアル寄り）
    const size = Math.random() * 2 + 2; // 2〜4vw
    const width = `${size}vw`;
    const height = `${size * 1.35}vw`; // 楕円

    const color = colors[i % colors.length];

    // 上昇速度（7〜13秒）
    const duration = `${7 + Math.random() * 6}s`;

    // 遅延（0〜5秒）
    const delay = `${Math.random() * 5}s`;

    // 初期の揺れ方向
    const rotate = `${Math.random() * 20 - 10}deg`;

    return (
      <div
        key={i}
        className={balloonBase}
        style={{
          left,
          width,
          height,
          backgroundColor: color,
          animationName: "balloon-rise",
          animationDuration: duration,
          animationDelay: delay,
          transform: `rotateZ(${rotate})`,
        }}
      >
        {/* ハイライト */}
        <div className={highlight} />

        {/* 紐 */}
        <div className={stringStyle} />
      </div>
    );
  });

  return <div id={id} className={`${container} ${keyframes}`}>{balloons}</div>;
};

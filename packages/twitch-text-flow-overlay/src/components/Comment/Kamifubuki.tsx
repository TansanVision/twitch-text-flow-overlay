import React, { useRef, useEffect } from "react";
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
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
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
   const onAnimationEndRef = useRef(onAnimationEnd);

   useEffect(() => {
     onAnimationEndRef.current = onAnimationEnd;
   }, [onAnimationEnd]);

   const { pieces, maxAnimationTimeMs } = React.useMemo(() => {
     const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#5f27cd"];
     let maxTimeMs = 0;

     const generatedPieces = Array.from({ length: 80 }).map((_, i) => {
       const left = `${Math.random() * 100}%`;
       const size = Math.random() * 0.6 + 0.3; // 0.3vw〜0.9vw
       const width = `${size}vw`;
       const height = `${size * 2}vw`;
       const color = colors[i % colors.length];
       const durationSeconds = 5 + Math.random() * 6; // 5〜11秒
       const delaySeconds = Math.random() * 5;
       const duration = `${durationSeconds}s`;
       const delay = `${delaySeconds}s`;

      maxTimeMs = Math.max(maxTimeMs, (delaySeconds + durationSeconds) * 1000);

       return (
         <span
           key={i}
           className={base}
           style={{
             left,
             width,
             height,
             backgroundColor: color,
             animationName: "confetti-fall",
             animationDelay: delay,
              animationDuration: duration,
           }}
         />
       );
     });
     return { pieces: generatedPieces, maxAnimationTimeMs: maxTimeMs };
   }, []);

   React.useEffect(() => {
     const timeoutId = window.setTimeout(() => {
       onAnimationEndRef.current?.();
     }, maxAnimationTimeMs);

     return () => {
       window.clearTimeout(timeoutId);
     };
   }, []);
   
   return <div className={`${container} ${keyframes}`}>{pieces}</div>;
 };
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
   const { pieces, maxAnimationTimeMs } = React.useMemo(() => {
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
       const rotateZ = `${Math.random() * 360}deg`;

       maxTimeMs = Math.max(maxTimeMs, (delaySeconds + durationSeconds * 3) * 1000);

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
             animationDuration: duration,
             animationDelay: delay,
             transform: `rotateZ(${rotateZ})`,
           }}
         />
       );
     });
     return { pieces: generatedPieces, maxAnimationTimeMs: maxTimeMs };
   }, []);

   React.useEffect(() => {
     if (!onAnimationEnd) {
       return;
     }
     const timeoutId = window.setTimeout(() => {
       onAnimationEnd();
     }, maxAnimationTimeMs);
     return () => {
       window.clearTimeout(timeoutId);
     };
   }, [maxAnimationTimeMs, onAnimationEnd]);
   
   return <div className={`${container} ${keyframes}`}>{pieces}</div>;
 };
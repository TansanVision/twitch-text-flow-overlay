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
  border-radius: 50%;
  background: white;
  opacity: 0.9;
  will-change: transform;
  animation-timing-function: linear;
  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: 3;
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const keyframes = css`
  @keyframes snow-fall {
    0% {
      transform: translateX(0) translateY(0) rotateZ(0deg);
    }
    50% {
      transform: translateX(10px) translateY(50vh) rotateZ(20deg);
    }
    100% {
      transform: translateX(-10px) translateY(110vh) rotateZ(40deg);
    }
  }
`;

 export const Snow: React.FC<{ onAnimationEnd?: () => void }> = ({ onAnimationEnd }) => {
   const animationIterationCount = 3;
   const { flakes, maxAnimationTimeMs } = React.useMemo(() => {
     let maxTotalTimeMs = 0;
     const generatedFlakes = Array.from({ length: 80 }).map((_, i) => {
       const left = `${Math.random() * 100}%`;
       // 雪のサイズ（0.2〜0.8vw）
       const size = Math.random() * 0.6 + 0.2;
       const width = `${size}vw`;
       const height = `${size}vw`;

       // 落下速度（6〜14秒）
       const durationSeconds = 6 + Math.random() * 8;
       const duration = `${durationSeconds}s`;

       // 遅延（0〜5秒）
       const delaySeconds = Math.random() * 5;
       const delay = `${delaySeconds}s`;

       // 初期の横揺れ方向
       const rotate = `${Math.random() * 40 - 20}deg`;
       const totalTimeMs = (delaySeconds + durationSeconds * animationIterationCount) * 1000;
       maxTotalTimeMs = Math.max(maxTotalTimeMs, totalTimeMs);
       return {
         key: i,
         left,
         width,
         height,
         duration,
         delay,
         rotate,
       };
     });
     return { flakes: generatedFlakes, maxAnimationTimeMs: maxTotalTimeMs };
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

   return (
     <div className={`${container} ${keyframes}`}>
       {flakes.map(({ key, left, width, height, duration, delay, rotate }) => (
         <span
           key={key}
           className={base}
           style={{
             left,
             width,
             height,
             animationName: "snow-fall",
             animationDuration: duration,
             animationDelay: delay,
           }}
         />
       ))}
     </div>
   );
 };

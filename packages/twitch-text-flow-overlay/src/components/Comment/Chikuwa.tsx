import React, { useRef, useEffect } from 'react';
import { css } from '@emotion/css';

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
  animation-iteration-count: infinite;
`;

const keyframes = css`
  @keyframes chikuwa-fall {
    0% {
      transform: translateY(0) rotateZ(0deg);
    }
    100% {
      transform: translateY(120vh) rotateZ(40deg);
    }
  }
`;

/**
 * ちくわのSVGコンポーネント
 * @returns JSX.Element - ちくわのSVG要素
 */
const ChikuwaSVG = () => <svg viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="chikuwa-body" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#fdf5e6" />
      <stop offset="50%" stopColor="#f5e0b8" />
      <stop offset="100%" stopColor="#fdf5e6" />
    </linearGradient>
  </defs>
  <rect x="10" y="15" width="240" height="50" rx="25" ry="25" fill="url(#chikuwa-body)" />
  <circle cx="10" cy="40" r="25" fill="#fdf5e6" />
  <circle cx="10" cy="40" r="13" fill="#f5e0b8" />
  <circle cx="10" cy="40" r="7" fill="#fdf5e6" />
  <circle cx="250" cy="40" r="25" fill="#fdf5e6" />
  <circle cx="250" cy="40" r="13" fill="#f5e0b8" />
  <circle cx="250" cy="40" r="7" fill="#fdf5e6" />
  <ellipse cx="70" cy="30" rx="14" ry="8" fill="#c47a3a" opacity="0.7" />
  <ellipse cx="120" cy="50" rx="16" ry="9" fill="#b5652a" opacity="0.7" />
  <ellipse cx="170" cy="32" rx="12" ry="7" fill="#c47a3a" opacity="0.7" />
  <ellipse cx="210" cy="48" rx="10" ry="6" fill="#b5652a" opacity="0.7" />
</svg>
;

/**
 * ちくわが落ちてくるアニメーションコンポーネント
 * @returns JSX.Element
 */
 export const Chikuwa: React.FC<{ id?: string, onAnimationEnd?: (id?: string) => void }> = ({ id, onAnimationEnd }) => {
    const onAnimationEndRef = useRef(onAnimationEnd);

    useEffect(() => {
      onAnimationEndRef.current = onAnimationEnd;
    }, [onAnimationEnd]);

   const chikuwaConfigs = React.useMemo(
     () =>
       Array.from({ length: 8 }).map(() => {
         const durationSeconds = 2 + Math.random() * 2;
         const delaySeconds = Math.random() * 3;
         const iterationCount = 5;

         return {
           left: `${Math.random() * 100}%`,
           duration: `${durationSeconds}s`,
           delay: `${delaySeconds}s`,
           totalDurationMs: (delaySeconds + durationSeconds * iterationCount) * 1000,
         };
       }),
     []
   );

   const maxAnimationDurationMs = Math.max(...chikuwaConfigs.map((config) => config.totalDurationMs));

   React.useEffect(() => {
     const timeoutId = window.setTimeout(() => {
       onAnimationEndRef.current?.(id);
     }, maxAnimationDurationMs);

     return () => {
       window.clearTimeout(timeoutId);
     };
   }, [maxAnimationDurationMs, id]);

   const chikuwaElements = chikuwaConfigs.map(({ left, duration, delay }, i) => (
     <div
       key={i}
       className={base}
       style={{
         left,
         animationName: "chikuwa-fall",
         animationDuration: duration,
         animationDelay: delay,
       }}
     >
       <ChikuwaSVG />
     </div>
   ));

   return <div id={id} className={`${container} ${keyframes}`}>{chikuwaElements}</div>;
 };
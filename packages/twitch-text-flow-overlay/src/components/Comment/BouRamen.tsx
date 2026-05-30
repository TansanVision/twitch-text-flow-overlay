import React from 'react';
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
  @keyframes bou-ramen-fall {
    0% {
      transform: translateY(0) rotateZ(0deg);
    }
    100% {
      transform: translateY(120vh) rotateZ(40deg);
    }
  }
`;

/**
 * 棒ラーメンのSVGコンポーネント
 * @returns JSX.Element - 棒ラーメンのSVG要素
 */
const BouRamenSVG = () => <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bowl-grad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="100%" stopColor="#d0d0d0" />
    </radialGradient>
    <radialGradient id="soup-grad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stopColor="#dba56a" />
      <stop offset="100%" stopColor="#b97a3e" />
    </radialGradient>
  </defs>
  <circle cx="25" cy="25" r="24" fill="url(#bowl-grad)" stroke="#b0b0b0" strokeWidth="1.5" />
  <circle cx="25" cy="25" r="19" fill="url(#soup-grad)" />
  <path d="M15 25
           q10 -10 20 0
           q-10 10 -20 0
           q10 -10 20 0"
        fill="none"
        stroke="#f7e7b5"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9" />
  <circle cx="33" cy="30" r="6" fill="#c48a6a" />
  <circle cx="33" cy="30" r="4" fill="#e8c2a0" />
  <path d="M29 28 q4 -3 8 0" stroke="#8a5a3a" strokeWidth="1" opacity="0.5" />
  <circle cx="18" cy="20" r="4" fill="#ffffff" stroke="#ff7aa2" strokeWidth="1.2" />
  <circle cx="18" cy="20" r="2" fill="#ff7aa2" />
  <circle cx="28" cy="17" r="1.5" fill="#9adf7f" />
  <circle cx="30" cy="19" r="1.2" fill="#9adf7f" />
  <circle cx="26" cy="20" r="1.2" fill="#9adf7f" />
</svg>
;

/**
 * 棒ラーメンが落ちてくるアニメーションコンポーネント
 * @returns JSX.Element
 */
 export const BouRamen: React.FC<{ onAnimationEnd?: () => void }> = ({ onAnimationEnd }) => {
   const bouRamenConfigs = React.useMemo(
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

   const maxAnimationDurationMs = Math.max(...bouRamenConfigs.map((config) => config.totalDurationMs));

   React.useEffect(() => {
     if (!onAnimationEnd) {
       return;
     }

     const timeoutId = window.setTimeout(() => {
       onAnimationEnd();
     }, maxAnimationDurationMs);
     return () => {
       window.clearTimeout(timeoutId);
     };
   }, [maxAnimationDurationMs, onAnimationEnd]);

   const bouRamens = bouRamenConfigs.map(({ left, duration, delay }, i) => (
     <div
       key={i}
       className={base}
       style={{
         left,
         animationName: "bou-ramen-fall",
         animationDuration: duration,
         animationDelay: delay,
       }}
     >
       <BouRamenSVG />
     </div>
   ));
   return <div className={`${container} ${keyframes}`}>{bouRamens}</div>;
 };
import React, { useRef, useMemo, useEffect } from "react";
import { css } from "@emotion/css";

type FallingImagesProps = {
  id: string;
  src: string;
  onAnimationEnd: (id: string) => void;
};

type Item = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    angle: number;
    angularVelocity: number;
    delay: number;
}


const container = css`
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
`;

const imageStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    object-fit: contain;
    user-select: none;
    will-change: transform;
    opacity: 0;
`;

/**
 * FallingImagesコンポーネントは、指定された画像をランダムな位置から落下させるアニメーションを表示するコンポーネントです。
 * @param param0 - FallingImagesPropsオブジェクト
 * @param param0.src - 落下させる画像のURL
 * @param param0.onAnimationEnd - アニメーション終了時に呼び出されるコールバック関数
 * @returns 
 */
export const FallingImages: React.FC<FallingImagesProps> = ({ id, src, onAnimationEnd }) => {
  const onAnimationEndRef = useRef(onAnimationEnd);

  useEffect(() => {
    onAnimationEndRef.current = onAnimationEnd;
  }, [onAnimationEnd]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onAnimationEndRef.current?.(id);
    }, 1000 * 10);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [id]);

  // 5〜20個のランダム数を内部生成
  const count = useMemo(() => Math.floor(Math.random() * 16) + 5, []);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemsRef = React.useRef<Item[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const safeCount = Math.max(1, count); // countが0以下の場合は1にする
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    itemsRef.current = Array.from({ length: safeCount }, () => {
        const size = 40 + Math.random() * 90;

        return {
            x: size /2 + Math.random() * (width - size),
            y: -size * Math.random() * 50,
            vx: -1 * Math.random() * 2,
            vy: 1 + Math.random() * 2,
            size,
            angle: Math.random() * 360,
            angularVelocity: -3 + Math.random() * 6,
            delay: Math.random() * 800,
        };
    });

    const elements = Array.from(container.querySelectorAll('img'));

    const gravity = 0.35;
    const bounce = 0.38;
    const floorFriction = 0.96;

    let start = performance.now();
    let animationId: number;

    const animate = (time: number) => {
        const elapsed = time - start;

        itemsRef.current.forEach((item, index) => {
            if (elapsed < item.delay) return;

            item.vy += gravity;
            item.x += item.vx;
            item.y += item.vy;
            item.angle += item.angularVelocity;

            const floor = height - item.size;

            if (item.y > floor) {
                item.y = floor;
                item.vy *= -bounce;
                item.vx *= floorFriction;
                item.angularVelocity *= 0.92;

                if (Math.abs(item.vy) < 1) {
                    item.vy = 0;
                }
            }

            if (item.x <= 0 || item.x >= width - item.size) {
                item.vx *= -0.6;
            }

            const el = elements[index] as HTMLElement;
            if (el) {
                el.style.width = `${item.size}px`;
                el.style.height = `${item.size}px`;
                el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.angle}deg)`;

                el.style.opacity = "1";
            }
        });

        animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
}, [count]);

  return (
    <div className={container} ref={containerRef}>
        {Array.from({ length: count }).map((_, index) => (
            <img
                key={index}
                src={src}
                className={imageStyle}
                draggable={false}
                alt=""
            />
        ))}
    </div>
  );
}

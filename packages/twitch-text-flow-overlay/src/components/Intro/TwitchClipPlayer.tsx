import { useEffect, useRef } from 'react';
import { css } from '@emotion/css';

type TwitchClipPlayerProps = {
    videoUrl: string;
    parent?: string;
    duration: number;
    onClipEnd?: () => void;
}

/**
 * TwitchClipPlayerコンポーネント
 * @param param0 TwitchClipPlayerProps
 * @returns React.FC
 */
export const TwitchClipPlayer: React.FC<TwitchClipPlayerProps> = ({ 
    videoUrl, 
    parent = window.location.hostname || 'localhost',
    duration = 1,
    onClipEnd,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        let timer: number | undefined;

        const handleEnded = () => {
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            onClipEnd?.();
        };

        video.addEventListener('ended', handleEnded);

        timer = window.setTimeout(() => {
            onClipEnd?.();
        }, (duration + 3) * 1000);

        void video.play().catch(() => {
             // autoplay がブロックされる可能性があるため、onEnded / timer にフォールバックする
        });

        return () => {
            video.removeEventListener('ended', handleEnded);
            clearTimeout(timer);
        };

    }, [videoUrl, parent, duration, onClipEnd]);

    return <video
        ref={videoRef}
        className={css`
            width: 100%;
            height: 100%;
            object-fit: cover;
        `}
        src={videoUrl}
        autoPlay
        playsInline
    />
};
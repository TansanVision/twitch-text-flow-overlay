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
        if (!videoRef.current) {
            return;
        }

        // videoRef.current.muted = false;
        // videoRef.current.volume = 0.8;
        videoRef.current.addEventListener('ended', () => {
            if (onClipEnd) {
                onClipEnd();
            }
        });
        videoRef.current.play();

        const timer = setTimeout(() => {
            if (onClipEnd) {
                onClipEnd();
            }

            return () => clearTimeout(timer);
        }, (duration + 3) * 1000);

    }, [videoUrl, parent, duration, onClipEnd]);

    return <video
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
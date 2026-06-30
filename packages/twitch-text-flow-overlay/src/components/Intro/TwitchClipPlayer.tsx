import { useEffect, useRef } from 'react';
import { css } from '@emotion/css';

type TwitchClipPlayerProps = {
    videoUrl: string;
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
    duration,
    onClipEnd,
}) => {
    const onClipEndRef = useRef(onClipEnd);

     useEffect(() => {
         onClipEndRef.current = onClipEnd;
     }, [onClipEnd]);

    useEffect(() => {
        let timer: number | undefined;
        let finished = false;
        const finish = () => {
            if (finished) {
                return;
            }
            finished = true;
            
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            onClipEndRef.current?.();
        };

        timer = window.setTimeout(() => {
            finish();
        }, (duration + 5) * 1000);

        return () => {
            window.clearTimeout(timer);
        };

    }, [videoUrl, duration]);

    return <iframe
        className={css`
            width: 100%;
            height: 100%;
            border: none;
        `}
        src={`${videoUrl}&parent=${window.location.hostname || 'localhost'}&autoplay=true&muted=false`}
        allowFullScreen
    />
};
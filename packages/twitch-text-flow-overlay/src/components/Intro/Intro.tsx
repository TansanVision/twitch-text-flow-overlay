import React, { useEffect, useState } from 'react';
import { ClipPlayer } from './ClipPlayer';
import { IntroCountdown } from './IntroCountdown';
import type { Clip } from '../../domain/types';
import { useStreamerBotContext } from '../../providers/StreamerbotProvider';

type IntroProps = {
    raiderName: string;
    displayName: string;
    iconUrl: string;
    viewerCount: number;
    countdownTime: number;
    clips: Clip[];
    onFinished?: () => void;
}

/**
 * Introコンポーネント
 * @param param0 IntroProps
 * @returns React.FC
 */
export const Intro: React.FC<IntroProps> = ({ 
    raiderName, 
    displayName,
    iconUrl, 
    viewerCount, 
    countdownTime, 
    clips,
    onFinished
}) => {
    const [showCountdown, setShowCountdown] = useState<boolean>(true);
    const [showClips, setShowClips] = useState<boolean>(false);
    const { sendShoutoutCommand } = useStreamerBotContext() ?? {};

    useEffect(() => {
        setShowCountdown(true);
        setShowClips(false);
    }, [raiderName, iconUrl, viewerCount, countdownTime, clips]);

    const handleCountdownFinished = () => {
        setShowCountdown(false);

        if (clips.length === 0) {
            if (raiderName) {
                sendShoutoutCommand?.(raiderName);
            }

            onFinished?.();
            return;
        }

        setShowClips(true);
    }

    const handleClipsFinished = () => {
        setShowClips(false);
        if (!!raiderName) {
            sendShoutoutCommand?.(raiderName);
        } 
        
        if (onFinished) {
            onFinished();
        }
    }

    return (
        <>
            {showCountdown && <IntroCountdown
                displayName={displayName}
                iconUrl={iconUrl}
                viewerCount={viewerCount}
                countdownTime={countdownTime} 
                onFinished={handleCountdownFinished} 
            />}
            {showClips && <ClipPlayer
                clips={clips} 
                onFinished={handleClipsFinished} 
                />}
        </>
    );
}
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

     const tryShoutout = async () => {
         if (!raiderName) {
             return;
         }
         try {
             await sendShoutoutCommand?.(raiderName);
         } catch (error) {
             console.error('Failed to send shoutout command:', error);
         }
     };

    const handleCountdownFinished = async () => {
        setShowCountdown(false);

        if (clips.length === 0) {
            await tryShoutout();
            onFinished?.();
            return;
        }

        setShowClips(true);
    }

    const handleClipsFinished = async () => {
        setShowClips(false);

        await tryShoutout();
        onFinished?.();
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
                clips={clips.slice(0, 5)} 
                onFinished={handleClipsFinished} 
                />}
        </>
    );
}
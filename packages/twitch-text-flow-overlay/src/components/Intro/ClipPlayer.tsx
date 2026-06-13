import React, { useEffect, useState } from 'react';
import type { Clip } from '../../domain/types';
import { css } from '@emotion/css';
import { TwitchClipPlayer } from './TwitchClipPlayer';

type ClipPlayerProps = {
    clips: Clip[];
    onFinished: () => void;
    parent?: string;
}

const clipPlayerStyle = css`
    position: absolute;
    width: 60vw;
    left: 1vw;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 10px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-family: 'Arial', sans-serif;
    z-index: 1000;
    overflow: hidden;
    .clip-header {
        padding-left: 10px;
        text-align: center;
        font-size: 9px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

/**
 * ClipPlayerコンポーネント
 * @param param0 ClipPlayerProps
 * @returns React.FC
 */
export const ClipPlayer: React.FC<ClipPlayerProps> = ({ clips, onFinished, parent = 'localhost' }) => {
    const [currentClipIndex, setCurrentClipIndex] = useState<number>(0);

    useEffect(() => {
        if (clips.length === 0) {
            onFinished();
            return;
        }

        const timer = setTimeout(() => {
            if (currentClipIndex < clips.length - 1) {
                setCurrentClipIndex(currentClipIndex + 1);
            } else {
                onFinished();
            }
        }, clips[currentClipIndex].duration * 1000);

        return () => clearTimeout(timer);
    }, [clips, currentClipIndex, onFinished]);

    return <div className={clipPlayerStyle}>
        <div className="clip-header">
            <h3>{clips[currentClipIndex].title} - Featured Clip {currentClipIndex + 1} / {clips.length}</h3>
        </div>
        <TwitchClipPlayer
            videoUrl={clips[currentClipIndex].videoUrl}
            parent={parent}
            duration={clips[currentClipIndex].duration}
            onClipEnd={() => {
                if (currentClipIndex < clips.length - 1) {
                    setCurrentClipIndex(currentClipIndex + 1);
                } else {
                    onFinished();
                }
            }}
        />
    </div>
}

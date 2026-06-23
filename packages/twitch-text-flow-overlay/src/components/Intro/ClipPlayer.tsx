import React, { useEffect, useState, useRef } from 'react';
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
    height: 90vh;
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
    const onFinishedRef = useRef(onFinished);

     useEffect(() => {
         onFinishedRef.current = onFinished;
     }, [onFinished]);

    useEffect(() => {
        if (clips.length === 0) {
            onFinishedRef.current();
            return;
        }
         // clips が切り替わったときは先頭から再生
         setCurrentClipIndex(0);
     }, [clips]);

     if (clips.length === 0) {
        return null;
    }

    const safeClipIndex = currentClipIndex < clips.length ? currentClipIndex : 0;

    return <div className={clipPlayerStyle}>
        <div className="clip-header">
            <h3>{clips[safeClipIndex].title} - Featured Clip {safeClipIndex + 1} / {clips.length}</h3>
        </div>
        <TwitchClipPlayer
            videoUrl={clips[safeClipIndex].videoUrl}
            parent={parent}
            duration={clips[safeClipIndex].duration}
            onClipEnd={() => {
                if (currentClipIndex < clips.length - 1) {
                    setCurrentClipIndex(currentClipIndex + 1);
                } else {
                    onFinishedRef.current();
                }
            }}
        />
    </div>
}

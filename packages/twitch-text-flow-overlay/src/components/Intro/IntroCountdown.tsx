import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';

/**
 * IntroCountdownのPropsの型定義
 */
type IntroCountdownProps = {
    displayName: string;
    iconUrl: string;
    viewerCount: number;
    countdownTime: number;
    onFinished: () => void;
};

const introCountdown= css`
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-family: 'Arial', sans-serif;
        z-index: 1000;
        .raid-label {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .raider-info {
            display: flex;
            align-items: center;
            margin-bottom: 10px; 
            .raider-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
            }
            .raider-name {
                font-size: 16px;
                font-weight: bold;
            } 
        }
        .raid-message {
            font-size: 14px;
            margin-bottom: 10px;
            .viewer-count {
                font-size: 12px;
                color: #ccc;
            }   
        }
        .countdown-timer {
            font-size: 12px;
            font-weight: bold;
        }
    `;

/**
 * RaidIntroCountdownコンポーネント
 * @param param0 IntroCountdownProps
 * @returns React.FC
 */
export const IntroCountdown: React.FC<IntroCountdownProps> = ({
    displayName,
    iconUrl,
    viewerCount,
    countdownTime,
    onFinished,
}) => {
    const [remainingTime, setRemainingTime] = useState<number>(countdownTime);

    useEffect(() => {
        setRemainingTime(countdownTime);

        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onFinished();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdownTime, onFinished]);

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <div className={introCountdown}>
            <div className="raider-info">
                <img src={iconUrl} alt={`${displayName}'s avatar`} className="raider-icon" />
                <div className="raider-name">{displayName}</div>
            </div>
            <div className="raid-message">
                Thank you, {displayName}!
                {viewerCount > 0 && (
                    <div className="viewer-count">
                        with {viewerCount} {viewerCount === 1 ? 'raider' : 'raiders'}
                    </div>
                )}
            </div>
            <div className="countdown-timer">
                Introducing the raider in {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
        </div>
    );
}
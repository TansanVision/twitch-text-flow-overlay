import React, { useEffect } from 'react';
import { css } from '@emotion/css';

type ToastProps = {
    timeout?: number;
    message: string;
    onClose: () => void;
    variant?: 'success' | 'error' | 'info';
}


const toastClassName = css`
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background-color: #333;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    &:focus {
        outline: 2px solid #fff;
        outline-offset: 2px;
    }
`;

/**
 * Toastコンポーネントは、画面下部に一時的に表示される通知メッセージを提供します。
 * @param param0 - message: 表示するメッセージ、onClose: トーストを閉じるためのコールバック関数
 * @returns JSX.Element
 */
export const Toast: React.FC<ToastProps> = ({ message, onClose, timeout = 3000, variant = 'info' }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, timeout);
        return () => clearTimeout(timer);
    }, [onClose, timeout]);

    return <div
         className={toastClassName}
         role="status"
         aria-live="polite"
         tabIndex={0}
         onClick={onClose}
         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); onClose(); } }}
         style={{
            backgroundColor: variant === 'success' ? '#4caf50' : variant === 'error' ? '#f44336' : '#333',
         }}
     >
        {message}
    </div>
}
import React, { useCallback, useState, useEffect } from 'react';
import { CommentRenderer } from './CommentRenderer';
import type { CommentContainerProps } from './types';

/**
 * コメントを表示するコンテナコンポーネント
 * @param param0 - コンテナコンポーネントのプロパティ
 * @returns JSX.Element
 */
export const CommentContainer : React.FC<CommentContainerProps> = ({ 
    comment,
    animationDuration,
    onAnimationEnd
}) => {
    const [lane, setLane] = useState(Math.floor(Math.random() * 37));

    useEffect(() => {
        if (!comment) return;

        // サイズ感
        if (!comment.commands) {
            setLane(Math.floor(Math.random() * 37));
        } else if (comment.commands.includes("small")) {
            setLane(Math.floor(Math.random() * 37));
        } else if (comment.commands.includes("medium")) {
            setLane(Math.floor(Math.random() * 25));
        } else if (comment.commands.includes("big")) {
            setLane(Math.floor(Math.random() * 15));
        }

    }, [comment?.id]);

    const handleAnimationEnd = useCallback(() => {
        if (onAnimationEnd) {
            onAnimationEnd(comment.id);
        }
    }, [comment.id, onAnimationEnd]);

    return <CommentRenderer
        comment={comment} 
        animationDuration={animationDuration} 
        lane={lane}
        onAnimationEnd={handleAnimationEnd} 
        commands={comment.commands}
    />
}
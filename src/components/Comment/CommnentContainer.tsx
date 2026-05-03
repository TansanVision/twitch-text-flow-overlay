import React, { useCallback, useState, useEffect } from 'react';
import { CommentRenderer } from './CommentRenderer';
import type { CommentContainerProps } from './types';

/**
 * コメントの表示位置を決定する関数
 * @param comment - コメントオブジェクト
 * @returns コメントの表示位置を示す数値（レーン番号）
 */
const getLane = (comment: CommentContainerProps['comment']): number => {
    if (!comment.commands) {
        return Math.floor(Math.random() * (25 - 2));
    }

    if (comment.commands.includes("small")) {
        return Math.floor(Math.random() * (37 - 2));
    } else if (comment.commands.includes("medium")) {
        return Math.floor(Math.random() * (25 - 2));
    } else if (comment.commands.includes("big")) {
        return Math.floor(Math.random() * (15 - 2));
    } else {
        return Math.floor(Math.random() * (25 - 2));
    }
}

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
    const [lane, setLane] = useState(getLane(comment));

    useEffect(() => {
        if (!comment)  { 
            return; 
        }

        setLane(getLane(comment));
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
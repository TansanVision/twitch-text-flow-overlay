import React, { useCallback, useState, useEffect } from 'react';
import { CommentRenderer } from './CommentRenderer';
import type { CommentContainerProps } from './types';

// コメントのレーンの最大数を定義
const MAX_MIDDLE_LANE = 25;
const MAX_SMALL_LANE = 37;
const MAX_BIG_LANE = 15;

/**
 * コメントの表示位置を決定する関数
 * @param comment - コメントオブジェクト
 * @returns コメントの表示位置を示す数値（レーン番号）
 */
const getLane = (comment: CommentContainerProps['comment']): number => {
    const maxLane = 
        comment.commands?.includes("small") ? MAX_SMALL_LANE :
        comment.commands?.includes("medium") ? MAX_MIDDLE_LANE :
        comment.commands?.includes("big") ? MAX_BIG_LANE :
        MAX_MIDDLE_LANE;

    return Math.floor(Math.random() * (maxLane - 2));
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
        setLane(getLane(comment));
    }, [comment.id]);

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
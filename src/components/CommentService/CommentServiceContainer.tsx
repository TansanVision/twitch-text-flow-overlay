import React from 'react';
import { CommentServiceRenderer } from './CommentServiceRenderer';
import type { CommentServiceContainerProps } from './types';

/**
 * コメントサービスのコンテナコンポーネント
 * @param param0 - コンテナコンポーネントのプロパティ
 * @returns JSX.Element
 */
export const CommentServiceContainer : React.FC<CommentServiceContainerProps> = ({ comments, onRelease }) => {
    return <CommentServiceRenderer comments={comments} onAnimationEnd={onRelease} />
}
import type { Comment } from '../Comment/types';

/**
 * CommentServiceContainerコンポーネントのプロパティの型定義
 */
export interface CommentServiceContainerProps{
    comments: Comment[];
    onRelease?: (id: string) => void;
}

/**
 * CommentServiceRendererコンポーネントのプロパティの型定義
 */
export interface CommentServiceRendererProps {
    comments: Comment[];
    duration?: number;
    onAnimationEnd?: (id: string) => void;
}
import type { Command, Comment } from "../../domain/types";

/**
 * CommentContainerコンポーネントのプロパティの型定義
 */
export interface CommentContainerProps {
    comment: Comment;
    onAnimationEnd?: (id: string) => void;
}

/**
 * CommentRendererコンポーネントのプロパティの型定義
 */
export interface CommentRendererProps {
    comment: Comment;
    commands?: Command[];
    lane: number;
    onAnimationEnd?: () => void;
}
import type { CommentServiceRendererProps } from "./types";
import React from "react";

/**
 * コメントサービスのレンダラーコンポーネント
 * @param param0 - レンダラーコンポーネントのプロパティ
 * @returns JSX.Element
 */
export const CommentServiceRenderer : React.FC<CommentServiceRendererProps> = ({ 
    comments,
    onAnimationEnd
}) => {
    return (
        <>
            {comments.map(({ id, node }, i) =>
                React.isValidElement(node)
                    ? React.cloneElement(node, { 
                        key: i,
                        onAnimationEnd: (e: React.AnimationEvent<HTMLElement>) => onAnimationEnd(id)
                    } as any)
                    : node
            )}
        </>
    );
}
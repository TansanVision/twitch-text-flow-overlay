import type { CommentServiceRendererProps } from "./types";
import React, { useCallback } from "react";

/**
 * コメントサービスのレンダラーコンポーネント
 * @param param0 - レンダラーコンポーネントのプロパティ
 * @returns JSX.Element
 */
export const CommentServiceRenderer : React.FC<CommentServiceRendererProps> = ({ 
    comments,
    onAnimationEnd
}) => {
     const handleAnimationEnd = useCallback(
         (id: string) => onAnimationEnd(id),
         [onAnimationEnd]
     );

    return (
        <>
            {comments.map(({ id, node }) =>
                React.isValidElement(node)
                    ? React.cloneElement(node as React.ReactElement<{ 
                        id?: string; 
                        onAnimationEnd?: () => void 
                    }>, {
                        key: id,
                        id: id,
                        onAnimationEnd: () => handleAnimationEnd(id)
                    })
                    : node
            )}
        </>
    );
}
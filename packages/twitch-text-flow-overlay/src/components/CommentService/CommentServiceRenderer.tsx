import type { CommentServiceRendererProps } from "./types";
import React from "react";

type CommentNode = {
    id: string;
    node: React.ReactNode;
}

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
            {comments.map(({ id, node }) =>
                React.isValidElement(node)
                    ? React.cloneElement(node, {
                        key: id,
                        onAnimationEnd: onAnimationEnd ? () => onAnimationEnd(id) : undefined,
                    } as unknown as CommentNode)
                    : node
            )}
        </>
    );
}
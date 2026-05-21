import React from 'react';
import type { CommentRendererProps } from './types';
import { isSizeCommand, isColorCommand, isAlignmentCommand } from './types';
import {
    getCommentStyle,
} from './CommentRendererStyle';

/**
 * コメントを表示するコンポーネント
 * @param {CommentRendererProps} props - コンポーネントのプロパティ
 * @returns JSX.Element
 */
export const CommentRenderer : React.FC<CommentRendererProps> = ({ 
    comment, 
    commands = [],
    lane,
    onAnimationEnd 
}) => {
    const commandClasses = getCommentStyle(
        commands.find(isSizeCommand) || "default",
        commands.find(isColorCommand) || "default",
        commands.find(isAlignmentCommand) || "default",
        lane
    );

    return (
        <div 
            className={commandClasses}
            onAnimationEnd={onAnimationEnd}
        >

            {comment.node.map((node, index) => (
                <React.Fragment key={index}>
                    {node}
                </React.Fragment>
            ))}
        </div>
    )
}
import React from 'react';
import type { CommentRendererProps } from './types';
import { isSizeCommand, isColorCommand, isAlignmentCommand, isEffectCommand } from './types';
import {
    getCommentStyle,
} from './CommentRendererStyle';
import { Sakura } from './Sakura';
import { Snow } from './Snow';
import { Maruta } from './Maruta';
import { Kamifubuki } from './Kamifubuki';
import { Rain } from './Rain';

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
    if (commands.some(isEffectCommand)) {
         if (commands.includes("sakura")) {
            return <Sakura onAnimationEnd={onAnimationEnd} />
        } else if (commands.includes("snow")) {
            return <Snow onAnimationEnd={onAnimationEnd} />
        } else if (commands.includes("maruta")) {
            return <Maruta onAnimationEnd={onAnimationEnd} />
        } else if (commands.includes("kamifubuki")) {
            return <Kamifubuki onAnimationEnd={onAnimationEnd} />
        } else if (commands.includes("rain")) {
            return <Rain onAnimationEnd={onAnimationEnd} />;
        }
    }

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
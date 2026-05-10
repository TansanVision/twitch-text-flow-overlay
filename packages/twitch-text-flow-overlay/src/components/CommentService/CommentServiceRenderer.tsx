import { CommentContainer } from "../Comment/CommnentContainer";
import type { CommentServiceRendererProps } from "./types";

/**
 * コメントサービスのレンダラーコンポーネント
 * @param param0 - レンダラーコンポーネントのプロパティ
 * @returns JSX.Element
 */
export const CommentServiceRenderer : React.FC<CommentServiceRendererProps> = ({ 
    comments,
    duration = 8000,
    onAnimationEnd
}) => {
    return (
        <>
            {comments.filter(comment => comment.state === 'active').map((comment) => (
                <CommentContainer 
                    key={`${comment.id}`} 
                    comment={comment} 
                    animationDuration={duration}
                    onAnimationEnd={onAnimationEnd}
                />
            ))}
        </>
    );
}
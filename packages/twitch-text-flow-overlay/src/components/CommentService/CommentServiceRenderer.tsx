import { CommentContainer } from "../Comment/CommnentContainer";
import type { CommentServiceRendererProps } from "./types";

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
            {comments.filter(comment => comment.state === 'active').map((comment) => (
                <CommentContainer 
                    key={`${comment.id}`} 
                    comment={comment} 
                    onAnimationEnd={onAnimationEnd}
                />
            ))}
        </>
    );
}
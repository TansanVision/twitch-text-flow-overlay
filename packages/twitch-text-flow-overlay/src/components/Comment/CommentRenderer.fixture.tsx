import { CommentContainer } from "./CommnentContainer";
import type { Comment } from "./types";
import "../../index.css";

export default () => {
    const comments: Comment[] = [{
            id: "1",
            node: [<span>通常コメント</span>],
            state: "active",
        }, {
            id: "2",
            node: [<span>長いコメントです。対戦よろしくお願いします。もう少しお待ちください。</span>],
            state: "active",
            commands: ["white2", "red2"]
        }, {
            id: "3",
            node: [<span>色とサイズのコマンド🍰</span>],
            state: "active",
            commands: ["white2", "big"]
        }, {
            id: "4",
            node: [<span>小さいコメント🍰</span>],
            state: "active",
            commands: ["small", "cyan2"]
        }, {
            id: "5",
            node: [<span>中くらいのコメント🍰</span>],
            state: "active",
            commands: ["medium", "yellow2"]
        }, {
            id: "6",
            node: [<span>上固定コメント</span>],
            state: "active",
            commands: ["ue", "pink2"]
        }, {
            id: "7",
            node: [<span>下固定コメント</span>],
            state: "active",
            commands: ["shita", "orange2"]
        }, {
            id: "8",
            node: [<span>中央固定コメント</span>],
            state: "active",
            commands: ["naka", "elementalgreen"]
        }, {
            id: "9",
            node: [<span>右上固定コメント</span>],
            state: "active",
            commands: ["migiue", "truered"]
        }, {
            id: "10",
            node: [<span>右下固定コメント</span>],
            state: "active",
            commands: ["migishita", "passionorange"]
        }, {
            id: "11",
            node: [<span>左上固定コメント</span>],
            state: "active",
            commands: ["hidariue", "blue2"]
        }, {
            id: "12",
            node: [<span>左下固定コメント</span>],
            state: "active",
            commands: ["hidarishita", "marineblue"]
        }, {
            id: "13",
            node: [<span>左固定コメント</span>],
            state: "active",
            commands: ["hidari", "madyellow"]
        }, {
            id: "14",
            node: [<span>右固定コメント</span>],
            state: "active",
            commands: ["migi", "cyan2"]
        }, {
            id: "15",
            node: [<div style={{display: "flex", flexDirection: "column", gap: "0px", margin: "0px"}}>
                <div style={{display: "flex", flexDirection: "row", lineHeight: "1em", gap: "0px", margin: "0px", padding: "0px"}}>
                    <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
                    <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
                </div>
                <div style={{display: "flex", flexDirection: "row", lineHeight: "1em", gap: "0px", margin: "0px", padding: "0px"}}>
                    <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
                    <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
                </div>
            </div>],
            state: "active",
            commands: ["hidari"]
        }, {
            id: "16",
            node: [<div>
                    <img src="https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0" />
                    <span>test🍰 </span>
                </div>],
            state: "active",
            commands: ["ue", "red2", "big"]
        }
    ];

    return <div className="overlay">
        {comments.map(comment => (
            <CommentContainer 
                key={`${comment.id}`}
                comment={comment}
            />
        ))}
    </div>
}
import "../../index.css";
import React, { useState } from "react";
import { Flow } from "./Flow";
import { getFlowStyle } from "./Flow";

export default () => {
    const [comments, setComments] = useState<{
        id: string;
        className: string;
        node: React.ReactNode;
    }[]>([{
        id: "1",
        className: getFlowStyle([]),
        node: [<span key="1">I have a pen.</span>],
    },{
        id: "2",
        className: getFlowStyle([]),
        node: [<span key="1">通常コメント</span>],
    }, {
        id: "3",
        className: getFlowStyle(["white2", "red2"]),
        node: [<span key="2">長いコメントです。対戦よろしくお願いします。もう少しお待ちください。</span>],
    }, {
        id: "4",
        className: getFlowStyle(["white2", "big"]),
        node: [<span key="3">色とサイズのコマンド🍰</span>]
    },{
        id: "5",
        className: getFlowStyle(["small", "cyan2"]),
        node: [<span key="4">小さいコメント🍰</span>]
    },{
        id: "6",
        className: getFlowStyle(["medium", "yellow2"]),
        node: [<span key="5">中くらいのコメント🍰</span>]
    }, {
        id: "7",
        className: getFlowStyle(["ue", "pink2"]),
        node: [<span key="6">上固定コメント</span>]
    }, {
        id: "8",
        className: getFlowStyle(["shita", "orange2"]),
        node: [<span key="7">下固定コメント</span>]
    }, {
        id: "9",
        className: getFlowStyle(["naka", "elementalgreen"]),
        node: [<span key="8">中央固定コメント</span>]
    }, {
        id: "10",
        className: getFlowStyle(["migiue", "truered"]),
        node: [<span key="9">右上固定コメント</span>]
    }, {
        id: "11",
        className: getFlowStyle(["migishita", "passionorange"]),
        node: [<span key="10">右下固定コメント</span>]
    }, {
        id: "12",
        className: getFlowStyle(["hidariue", "blue2"]),
        node: [<span key="11">左上固定コメント</span>]
    }, {
        id: "13",
        className: getFlowStyle(["hidarishita", "marineblue"]),
        node: [<span key="12">左下固定コメント</span>]
    }, {
        id: "14",
        className: getFlowStyle(["hidari", "madyellow"]),
        node: [<span key="13">左固定コメント</span>]
    }, {
        id: "15",
        className: getFlowStyle(["migi", "cyan2"]),
        node: [<span key="14">右固定コメント</span>]
    }, {
        id: "16",
        className: getFlowStyle(["hidari"]),
        node: [<div key="15" style={{display: "flex", flexDirection: "column", gap: "0px", margin: "0px"}}>
            <div style={{display: "flex", flexDirection: "row", lineHeight: "1em", gap: "0px", margin: "0px", padding: "0px"}}>
                <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
                <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
            </div>
            <div style={{display: "flex", flexDirection: "row", lineHeight: "1em", gap: "0px", margin: "0px", padding: "0px"}}>
                <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
                <img src="https://static-cdn.jtvnw.net/emoticons/v2/112290/default/dark/3.0" />
            </div>
        </div>]
    }, {
        id: "17",
        className: getFlowStyle(["ue", "red2", "big"]),
        node: [<div key="17">
                <img src="https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0" />
                <span>test🍰 </span>
            </div>]
    }]);

    return <div className="overlay">
            {comments.map(({ className, node, id }) => (
                <Flow 
                    key={id}
                    className={className}
                    onAnimationEnd={() => {
                        setComments(prev => prev.filter(comment => comment.id !== id));
                    }}
                >
                    {node}
                </Flow>
            ))}
        </div>
};
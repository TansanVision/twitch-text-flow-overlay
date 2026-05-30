import "../../index.css";
import React, { useState } from "react";
import { Flow } from "./Flow";
import { getFlowStyle } from "./Flow";

export default () => {
    const [comments, setComments] = useState<{
        className: string;
        node: React.ReactNode;
    }[]>([{
        className: getFlowStyle([]),
        node: [<span key="1">I have a pen.</span>],
    },{
        className: getFlowStyle([]),
        node: [<span key="1">通常コメント</span>],
    }, {
        className: getFlowStyle(["white2", "red2"]),
        node: [<span key="2">長いコメントです。対戦よろしくお願いします。もう少しお待ちください。</span>],
    }, {
        className: getFlowStyle(["white2", "big"]),
        node: [<span key="3">色とサイズのコマンド🍰</span>]
    },{
        className: getFlowStyle(["small", "cyan2"]),
        node: [<span key="4">小さいコメント🍰</span>]
    },{
        className: getFlowStyle(["medium", "yellow2"]),
        node: [<span key="5">中くらいのコメント🍰</span>]
    }, {
        className: getFlowStyle(["ue", "pink2"]),
        node: [<span key="6">上固定コメント</span>]
    }, {
        className: getFlowStyle(["shita", "orange2"]),
        node: [<span key="7">下固定コメント</span>]
    }, {
        className: getFlowStyle(["naka", "elementalgreen"]),
        node: [<span key="8">中央固定コメント</span>]
    }, {
        className: getFlowStyle(["migiue", "truered"]),
        node: [<span key="9">右上固定コメント</span>]
    }, {
        className: getFlowStyle(["migishita", "passionorange"]),
        node: [<span key="10">右下固定コメント</span>]
    }, {
        className: getFlowStyle(["hidariue", "blue2"]),
        node: [<span key="11">左上固定コメント</span>]
    }, {
        className: getFlowStyle(["hidarishita", "marineblue"]),
        node: [<span key="12">左下固定コメント</span>]
    }, {
        className: getFlowStyle(["hidari", "madyellow"]),
        node: [<span key="13">左固定コメント</span>]
    }, {
        className: getFlowStyle(["migi", "cyan2"]),
        node: [<span key="14">右固定コメント</span>]
    }, {
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
        className: getFlowStyle(["ue", "red2", "big"]),
        node: [<div key="16">
                <img src="https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0" />
                <span>test🍰 </span>
            </div>]
    }]);

    return <div className="overlay">
            {comments.map(({ className, node }, index) => (
                <Flow 
                    key={`${index} ${className}`}
                    className={className}
                    onAnimationEnd={() => {
                        setComments(prev => prev.filter((_, i) => i !== index));
                    }}
                >
                    {node}
                </Flow>
            ))}
        </div>
};
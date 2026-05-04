import React from 'react';
import type { CommentRendererProps } from './types';
import { isSizeCommand, isColorCommand, isAlignmentCommand } from './types';

/**
 * コメントの基本スタイル
 */
const baseStyle = (animationDuration: number): React.CSSProperties => ({
    position: 'absolute',
    right: '-50%',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: "flex-start",
    flexWrap: 'nowrap',
    width: 'fit-content',
    height: "auto",
    color: '#fff',
    textShadow: `
        2px 2px 0 black,
        -2px 2px 0 black,
        2px -2px 0 black,
        -2px -2px 0 black
    `,
    userSelect: 'none',
    animationName: "move-left",
    animationTimingFunction: "linear",
    animationFillMode: "forwards",
    animationDuration: `${animationDuration}ms`,
});

/**
 * コメントの影スタイル
 * @param size - 影のサイズ
 * @returns コメントの影スタイルオブジェクト
 */
const shadowStyle = (size: number): React.CSSProperties => {
    return {
        textShadow: `
            ${size}px ${size}px 0 black,
            -${size}px ${size}px 0 black,
            ${size}px -${size}px 0 black,
            -${size}px -${size}px 0 black
        `,
    }
}

/**
 * コメントのサイズスタイル
 * @param command - コメントのサイズを指定するコマンド
 * @returns コメントのサイズスタイル
 */
const sizeStyle = (command: string, lane: number): React.CSSProperties => {
    if (!command) {
        return {
            fontSize: "4vh",
            top: `calc(${lane} * 4vh)`,
            ...shadowStyle(2)
        }
    }

    switch (command) {
        case "small":
            return {
                fontSize: "2.7vh",
                top: `calc(${lane} * 2.7vh)`,
                ...shadowStyle(1)
            };
        case "medium":
            return {
                fontSize: "4vh",
                top: `calc(${lane} * 4vh)`,
                ...shadowStyle(2)
            };
        case "big":
            return {
                fontSize: "6.7vh",
                top: `calc(${lane} * 6.7vh)`,
                ...shadowStyle(2.5)
            };
        default:
            return {
                fontSize: "4vh",
                top: `calc(${lane} * 4vh)`,
                ...shadowStyle(2)
            };
    }   
}

/**
 * コメントの色スタイル
 * @param command - コメントの色を指定するコマンド
 * @returns コメントの色スタイル
 */
const colorStyle = (command: string): React.CSSProperties => {
    if (!command) {
        return {
            color: "#ffffff"
        }
    }

    switch (command) {
        case "red":
            return {
                color: "#ff0000"
            };
        case "pink":
            return {
                color: "#ff69b4"
            };
        case "orange":
            return {
                color: "#ffa500"
            };
        case "yellow":
            return {
                color: "#ffff00"
            };
        case "green":
            return {
                color: "#00ff00"
            };
        case "green2":
        case "elementalgreen":
            return {
                color: "#00CC66"
            };
        case "cyan":
            return {
                color: "#00ffff"
            };
        case "blue":
            return {
                color: "#0000ff"
            };
        case "purple":
            return {
                color: "#800080"
            };
        case "black":
            return {
                color: "#000000"
            };
        case "white2":
        case "niconicowhite":
            return {
                color: "#cccc99"
            };
        case "red2":
        case "truered":
            return {
                color: "#cc0033"
            };
        case "pink2":
            return {
                color: "#ff77ff"
            };
        case "orange2":
        case "passionorange":
            return {
                color: "#ff6600"
            };
        case "yellow2":
        case "madyellow":
            return {
                color: "#999900"
            };
        case "cyan2":
            return {
                color: "#00cccc"
            };
        case "blue2":
        case "marineblue":
            return {
                color: "#3399ff"
            };
        case "black2":
            return {
                color: "#333333"
            };
        case "purple2":
        case "nobleviolet":
            return {
                color: "#6633cc"
            };
        default:
            return {
                color: "#ffffff"
            };
    }
}

/**
 * コメントの位置スタイル
 * @param command - コメントの位置を指定するコマンド
 * @returns コメントの位置スタイル
 */
const alignmentStyle = (command: string): React.CSSProperties => {
    if (!command) {
        return {
            right: '-50%',
            justifyContent: "flex-start",
            alignItems: "flex-start"
        }
    }

    const fixedCommonStyle: React.CSSProperties = {
        position: "absolute",
        width: "100vw",
        height: "100vh",
        right: 0,
        top: 0,
        animationName: "nothing",
    };

    switch (command) {
        case "shita":
            return {
                ...fixedCommonStyle,
                justifyContent: "center",
                alignItems: "flex-end",
            };
        case "naka":
            return {
                ...fixedCommonStyle,
                justifyContent: "center",
                alignItems: "center",
            };
        case "ue":
            return {
                ...fixedCommonStyle,
                justifyContent: "center",
                alignItems: "flex-start",
            };
        case "migiue":
            return {
                ...fixedCommonStyle,
                justifyContent: "flex-end",
                alignItems: "flex-start",
            };
        case "hidariue":
            return {
                ...fixedCommonStyle,
                justifyContent: "flex-start",
                alignItems: "flex-start",
            };
        case "migishita":
            return {
                ...fixedCommonStyle,
                justifyContent: "flex-end",
                alignItems: "flex-end",
            };
        case "hidarishita":
            return {                
                ...fixedCommonStyle,
                justifyContent: "flex-start",
                alignItems: "flex-end",
            };
        case "migi":
            return {
                ...fixedCommonStyle,
                justifyContent: "flex-end",
                alignItems: "center",
            };
        case "hidari":
            return {
                ...fixedCommonStyle,
                justifyContent: "flex-start",
                alignItems: "center",
            };
        default:
            return {
                right: '-50%',
                animationName: "move-left",
                justifyContent: "flex-start",
                alignItems: "flex-start"
            };
    }
}

/**
 * コメントを表示するコンポーネント
 * @param {CommentRendererProps} props - コンポーネントのプロパティ
 * @returns JSX.Element
 */
export const CommentRenderer : React.FC<CommentRendererProps> = ({ 
    comment, 
    commands = [],
    lane,
    animationDuration, 
    onAnimationEnd 
}) => {
    const combinedStyle = {
        ...baseStyle(animationDuration),
        ...sizeStyle(commands.find(isSizeCommand) || "", lane),
        ...colorStyle(commands.find(isColorCommand) || ""),
        ...alignmentStyle(commands.find(isAlignmentCommand) || "")
    };

    return (
        <div 
            style={combinedStyle}
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
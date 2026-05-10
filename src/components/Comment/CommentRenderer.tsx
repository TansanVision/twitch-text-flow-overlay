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
            fontSize: "6vh",
            height: "6vh",
            top: `calc(${lane} * 6vh)`,
            ...shadowStyle(2)
        }
    }

    switch (command) {
        case "small":
            return {
                fontSize: "4vh",
                height: "4vh",
                top: `calc(${lane} * 4vh)`,
                ...shadowStyle(1)
            };
        case "medium":
            return {
                fontSize: "6vh",
                height: "6vh",
                top: `calc(${lane} * 6vh)`,
                ...shadowStyle(2)
            };
        case "big":
            return {
                fontSize: "18vh",
                height: "18vh",
                top: `calc(${lane} * 18vh)`,
                lineHeight: 1,
                ...shadowStyle(2.5)
            };
        default:
            return {
                fontSize: "6vh",
                height: "6vh",
                top: `calc(${lane} * 6vh)`,
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
            alignItems: "center"
        }
    }

    const fixedCommonStyle: React.CSSProperties = {
        position: "absolute",
        top: undefined,
        right: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        animationName: "nothing",
    };

    switch (command) {
        case "shita":
            return {
                ...fixedCommonStyle,
                top: undefined,
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
            };
        case "naka":
            return {
                ...fixedCommonStyle,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            };
        case "ue":
            return {
                ...fixedCommonStyle,
                top: 5,
                left: "50%",
                transform: "translateX(-50%)",
            };
        case "migiue":
            return {
                ...fixedCommonStyle,
                top: 5,
                right: 5,
            };
        case "hidariue":
            return {
                ...fixedCommonStyle,
                top: 5,
                left: 5,

            };
        case "migishita":
            return {
                ...fixedCommonStyle,
                bottom: 20,
                right: 0,
            };
        case "hidarishita":
            return {                
                ...fixedCommonStyle,
                bottom: 20,
                left: 0,
            };
        case "migi":
            return {
                ...fixedCommonStyle,
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
            };
        case "hidari":
            return {
                ...fixedCommonStyle,
                bottom: "50%",
                left: 0,
                transform: "translateY(50%)",
            };
        default:
            return {
                right: '-50%',
                animationName: "move-left",
                justifyContent: "flex-start",
                alignItems: "center"
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
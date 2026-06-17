import React, { useCallback } from 'react';
import { css, cx } from "@emotion/css";
import { isSizeCommandString, isColorCommandString, isAlignmentCommandString } from '../../domain/types';

/**
 * コメントが右から左へ流れるアニメーションのスタイル定義
 */
const moveLeftStyle = 
    css`
        @keyframes move-left {
            from {
                transform: translateX(100vw);
            }
            to {
                transform: translateX(-100%);
            }
        }
    `;

/**
 * コメントが動かないスタイル定義
 */
const noAnimationStyle = 
    css`
        @keyframes nothing {
            from {
            }
            to {
            }
        }
    `;


/**
 * コメントの基本スタイル定義
 */
const baseCommentStyle = css`
    position: absolute;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: nowrap;
    line-height: 1;
    width: fit-content;
    height: auto;
    color: #fff;
    user-select: none;
    animation-name: move-left;
    animation-duration: 5s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    white-space: nowrap;
    text-wrap: nowrap;
`;

/**
 * 小サイズの画像スタイル定義
 */
const imageSmallStyle = css`
    height: 1.1em;
    width: auto;
`;

/**
 * 中サイズの画像スタイル定義
 */
const imageMediumStyle = css`
    height: 1.2em;
    width: auto;
`;

/**
 * 大サイズの画像スタイル定義
 */
const imageBigStyle = css`
    height: 1.5em;
    width: auto;
`;

/**
 * コメントのサイズスタイル定義
 * @param lane - コメントのレーン番号
 * @returns コメントのサイズスタイルオブジェクト
 */
const smallCommentStyle = (lane: number) => 
    cx(
        baseCommentStyle,
        css`
            & img {
                ${imageSmallStyle}
            }
        `,
        css`
            font-size: 4vh;
            height: auto;
            top: calc(${lane} * 4vh);
            ${textShadowStyle(1)}
        `);

/**
 * コメントのサイズスタイル定義
 * @param lane - コメントのレーン番号
 * @returns コメントのサイズスタイルオブジェクト
 */
const mediumCommentStyle = (lane: number) => 
    cx(
        baseCommentStyle,
        css`            
            & img {
                ${imageMediumStyle}
            }`,
        css`
            font-size: 6vh;
            height: auto;
            top: calc(${lane} * 6vh);
            ${textShadowStyle(2)}
        `);

/**
 * コメントのサイズスタイル定義
 * @param lane - コメントのレーン番号
 * @returns コメントのサイズスタイルオブジェクト
 */
const bigCommentStyle = (lane: number) => 
    cx(
        baseCommentStyle,
        css`
            & img {
                ${imageBigStyle}
            }
        `,
        css`
            font-size: 18vh;
            height: auto;
            top: calc(${lane} * 18vh);
            ${textShadowStyle(2.5)}
        `
    );

/**
 * コメントのサイズオブジェクト
 */
const commentSizeStyle : { [key: string]: (lane: number) => string } = {
    small: smallCommentStyle,
    medium: mediumCommentStyle,
    big: bigCommentStyle,
    default: mediumCommentStyle
}

/**
 * コメントのサイズスタイルを取得する関数
 * @param size - コメントのサイズを指定する文字列
 * @returns コメントのサイズスタイル関数
 */
export const getCommentSizeStyle = (size: string) => {
    return commentSizeStyle[size] || commentSizeStyle.default;
}

/**
 * コメントの影スタイル定義
 * @param size - 影のサイズ
 * @returns コメントの影スタイルオブジェクト
 */
export const textShadowStyle = (size: number) => css`
    text-shadow:
        ${size}px ${size}px 0 black,
        -${size}px ${size}px 0 black,
        ${size}px -${size}px 0 black,
        -${size}px -${size}px 0 black;
    `;

/**
 * Twitchのコメントで使用される色の定義
 */
const colors : { [key: string]: string } = {
    default: "#ffffff",
    red: "#ff0000",
    pink: "#ff69b4",
    orange: "#ffa500",
    yellow: "#ffff00",
    green: "#00ff00",
    green2: "#00CC66",
    elementalgreen: "#00CC66",
    cyan: "#00ffff",
    blue: "#0000ff",
    purple: "#800080",
    black: "#000000",
    white2: "#cccc99",
    niconicowhite: "#cccc99",
    red2: "#cc0033",
    truered: "#cc0033",
    pink2: "#ff77ff",
    orange2: "#ff6600",
    passionorange: "#ff6600", 
    yellow2: "#999900",
    madyellow: "#999900",
    cyan2: "#00cccc",
    blue2: "#3399ff",
    marineblue: "#3399ff",
    black2: "#333333",
    purple2: "#6633cc",
    nobleviolet: "#6633cc",
}

/**
 * コメントの色スタイル定義
 * @param color - コメントの色を指定する文字列
 * @returns コメントの色スタイルオブジェクト
 */
const colorStyle = (color: string) : string => css`
    color: ${colors[color] || colors.default};
`;

/**
 * コメントの配置基礎スタイル定義
 */
const alignmentBaseCommentStyle = css`
    position: absolute;
    right: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    animation-name: nothing;
    animation-duration: 5s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
`;

/**
 * コメントの下配置スタイル定義
 */
const shitaCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        bottom: 20px;
        left: 50%;
        top: unset;
        transform: translateX(-50%);
    `);

/**
 * コメントの画面中央配置スタイル定義
 */
const nakaCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `);

/**
 * コメントの上配置スタイル定義
 */
const ueCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
    `);

/**
 * コメントの右上配置スタイル定義
 */
const migiueCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 5px;
        right: 5px;
    `);

/**
 * コメントの左上配置スタイル定義
 */
const hidariueCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 5px;
        left: 5px;
    `);

/**
 * コメントの右下配置スタイル定義
 */
const migishitaCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        bottom: 20px;
        right: 0;
        top: unset;
    `);

/**
 * コメントの左下配置スタイル定義
 */
const hidarishitaCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        bottom: 20px;
        left: 0;
        top: unset;
    `);

/**
 * コメントの右配置スタイル定義
 */
const migiCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    `);

/**
 * コメントの左配置スタイル定義
 */
const hidariCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        bottom: 50%;
        left: 0;
        top: unset;
        transform: translateY(50%);
    `);

/** 
 * コメントの配置スタイルオブジェクト
 */
const alignmentStyle : { [key: string]: string } = {
    shita: shitaCommentStyle,
    naka: nakaCommentStyle,
    ue: ueCommentStyle,
    migiue: migiueCommentStyle,
    hidariue: hidariueCommentStyle,
    migishita: migishitaCommentStyle,
    hidarishita: hidarishitaCommentStyle,
    migi: migiCommentStyle,
    hidari: hidariCommentStyle,
}

/**
 * コメントの配置スタイルを取得する関数
 * @param alignment - コメントの配置を指定する文字列
 * @returns コメントの配置スタイルオブジェクト
 */
const getAlignmentStyle = (alignment: string) => {
    return alignmentStyle[alignment] || "";
}

/**
 * コメントのスタイルを取得する関数
 * @param size - コメントのサイズを指定する文字列
 * @param color - コメントの色を指定する文字列
 * @param alignment - コメントの配置を指定する文字列
 * @param lane - コメントのレーン番号を指定する数値
 * @returns コメントのスタイルオブジェクト
 */
const getCommentStyle = (
    size: string, 
    color: string, 
    alignment: string, 
    lane: number) => {
    const sizeStyle = getCommentSizeStyle(size)(lane);
    const colorStyleValue = colorStyle(color);
    const alignmentStyle = getAlignmentStyle(alignment);
    const hasAlignment = alignmentStyle !== "";
    const effectStyle = hasAlignment ? noAnimationStyle : moveLeftStyle;

    return cx(
        sizeStyle,
        colorStyleValue,
        alignmentStyle,
        effectStyle
    );
}

/**
 * コメントの流れるアニメーションコンポーネント
 * @param children - コメントのテキストや画像などの要素を含むReactノード
 * @param className - コメントのスタイルを指定するクラス名
 * @param onAnimationEnd - アニメーション終了時のコールバック関数（comment id が渡される）
 * @param id - コメントの識別子
 * @returns JSX.Element
 */
type Props = {
    children: React.ReactNode;
    className: string;
    onAnimationEnd?: (id?: string) => void;
    id?: string;
}

// コメントのレーンの最大数を定義
const MAX_MIDDLE_LANE = 16;
const MAX_SMALL_LANE = 25;
const MAX_BIG_LANE = 7;

/**
 * コメントの表示位置を決定する関数
 * @param comment - コメントオブジェクト
 * @returns コメントの表示位置を示す数値（レーン番号）
 */
const getLane = (command : string): number => {
    let maxLane = MAX_MIDDLE_LANE;

    if (isSizeCommandString(command)) {
        if (command === "small") {
            maxLane = MAX_SMALL_LANE;
        } else if (command === "big") {
            maxLane = MAX_BIG_LANE;
        }
    }

    return Math.floor(Math.random() * (maxLane - 2));
}

/**
 * コメントのスタイルを取得する関数
 * @param commands - コメントに適用されているコマンドの配列
 * @returns コメントのスタイルを指定するクラス名
 */
export const getFlowStyle = (commands: string[]) : string => {
    const sizeCommand = commands.find(isSizeCommandString) || "default";
    const colorCommand = commands.find(isColorCommandString) || "default";
    const alignmentCommand = commands.find(isAlignmentCommandString) || "default";
    const lane = getLane(sizeCommand);
    return getCommentStyle(sizeCommand, colorCommand, alignmentCommand, lane);
}

/**
 * コメントの流れるアニメーションコンポーネント
 * @param param0 - コンポーネントのプロパティ
 * @returns JSX.Element
 * @description コメントが右から左へ流れるアニメーションを表示するコンポーネント。コメントのテキストと、アニメーション終了時のコールバック関数を受け取る。
 */
export const Flow : React.FC<Props> = ({ 
    children, 
    className, 
    onAnimationEnd,
    id
}) => {
    const handleAnimationEnd = useCallback(() => {
        if (onAnimationEnd) {
            onAnimationEnd(id);
        }
    }, [onAnimationEnd, id]);

    return <div 
        id={id}
        className={className}
        onAnimationEnd={handleAnimationEnd}>
        {children}
    </div>
}

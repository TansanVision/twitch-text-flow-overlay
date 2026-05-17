import { css, cx } from "@emotion/css";

/**
 * コメントが右から左へ流れるアニメーションのスタイル定義
 */
export const moveLeftStyle = 
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
export const noAnimationStyle = 
    css`
        @keyframes nothing {
            from {
                transform: translateX(0);
            }
            to {
                transform: translateX(0);
            }
        }
    `;


/**
 * コメントの基本スタイル定義
 */
export const baseCommentStyle = css`
    position: absolute;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: flex-start;
    flex-wrap: nowrap;
    line-height: 1;
    width: fit-content;
    height: auto;
    color: #fff;
    user-select: none;
    animation-name: move-left;
    animation-duration: 4s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    text-wrap: nowrap;
`;

/**
 * 小サイズの画像スタイル定義
 */
export const imageSmallStyle = css`
    height: 1.1em;
    width: auto;
`;

/**
 * 中サイズの画像スタイル定義
 */
export const imageMediumStyle = css`
    height: 1.2em;
    width: auto;
`;

/**
 * 大サイズの画像スタイル定義
 */
export const imageBigStyle = css`
    height: 1.5em;
    width: auto;
`;

/**
 * 画像のサイズオブジェクト
 */
export const imageSizeStyle : { [key: string]: string } = {
    small: imageSmallStyle,
    medium: imageMediumStyle,
    big: imageBigStyle,
    default: imageMediumStyle
}

/**
 * 画像のサイズスタイルを取得する関数
 * @param size - 画像のサイズを指定する文字列
 * @returns 画像のサイズスタイル
 */
export const getImageSizeStyle = (size: string): string => {
    return imageSizeStyle[size] || imageSizeStyle.default;
}

/**
 * コメントのサイズスタイル定義
 * @param lane - コメントのレーン番号
 * @returns コメントのサイズスタイルオブジェクト
 */
export const smallCommentStyle = (lane: number) => 
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
export const mediumCommentStyle = (lane: number) => 
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
export const bigCommentStyle = (lane: number) => 
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
export const commentSizeStyle : { [key: string]: (lane: number) => string } = {
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
export const colors  : { [key: string]: string } = {
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
export const colorStyle = (color: string) : string => css`
    color: ${colors[color] || colors.default};
`;

/**
 * コメントの配置基礎スタイル定義
 */
export const alignmentBaseCommentStyle = css`
    position: absolute;
    right: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    animation-name: nothing;
    animation-duration: 6s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
`;

/**
 * コメントの下配置スタイル定義
 */
export const shitaCommentStyle = cx(
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
export const nakaCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `);

/**
 * コメントの上配置スタイル定義
 */
export const ueCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
    `);

/**
 * コメントの右上配置スタイル定義
 */
export const migiueCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 5px;
        right: 5px;
    `);

/**
 * コメントの左上配置スタイル定義
 */
export const hidariueCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        top: 5px;
        left: 5px;
    `);

/**
 * コメントの右下配置スタイル定義
 */
export const migishitaCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        bottom: 20px;
        right: 0;
        top: unset;
    `);

/**
 * コメントの左下配置スタイル定義
 */
export const hidarishitaCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        bottom: 20px;
        left: 0;
        top: unset;
    `);

/**
 * コメントの右配置スタイル定義
 */
export const migiCommentStyle = cx(
    alignmentBaseCommentStyle,
    css`
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    `);

/**
 * コメントの左配置スタイル定義
 */
export const hidariCommentStyle = cx(
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
export const alignmentStyle : { [key: string]: string } = {
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
export const getAlignmentStyle = (alignment: string) => {
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
export const getCommentStyle = (
    size: string, 
    color: string, 
    alignment: string, 
    lane: number) => {
    const sizeStyle = getCommentSizeStyle(size)(lane);
    const colorStyleValue = colorStyle(color);
    const alignmentStyle = getAlignmentStyle(alignment);

    return cx(
        sizeStyle,
        colorStyleValue,
        alignmentStyle
    );
}

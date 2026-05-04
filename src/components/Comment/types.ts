import type React from "react";

/**
 * コメント関連の型定義
 */
export type CommentState = "active" | "inactive";

/**
 * コメントのコマンドの型定義
 */
export type Command = SizeCommand | AlignmentCommand | ColorCommand;

/**
 * コメントのサイズを指定するコマンドの型定義
 */
export type SizeCommand = "small" | "medium" | "big";

/**
 * コメントのサイズコマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドがサイズコマンドである場合はtrue、それ以外の場合はfalse
 */
export const isSizeCommand = (command: Command): command is SizeCommand => {
    return command === 'small' || command === 'medium' || command === 'big';
}

/**
 * コメントの位置を指定するコマンドの型定義
 */
export type AlignmentCommand = "ue" | "naka" | "shita" | "migi" | "hidari" | "migiue" | "migishita" | "hidariue" | "hidarishita";

/**
 * コメントの位置コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが位置コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isAlignmentCommand = (command: Command): command is AlignmentCommand => {
    return command === 'ue' || command === 'naka' || command === 'shita' || command === 'migi' || command === 'hidari' || command === 'migiue' || command === 'migishita' || command === 'hidariue' || command === 'hidarishita';
}

/**
 * コメントの色を指定するコマンドの型定義
 */
export type ColorCommand = BaseColorCommand | SpecialColorCommand;

/**
 * コメントの色コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isColorCommand = (command: Command): command is ColorCommand => {
    return isBaseColorCommand(command) || isSpecialColorCommand(command);
}


/**
 * コメントの基本色を指定するコマンドの型定義
 */
export type BaseColorCommand = "white" | "red" | "orange" | "blue" | "green" | "yellow" | "pink" | "cyan" | "purple" | "black";

/**
 * コメントの基本色コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが基本色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isBaseColorCommand = (command: Command): command is BaseColorCommand => {
    return command === 'white' || command === 'red' || command === 'orange' || command === 'blue' || command === 'green' || command === 'yellow' || command === 'pink' || command === 'cyan' || command === 'purple' || command === 'black';
}

/**
 * コメントの特殊な色を指定するコマンドの型定義
 */
export type SpecialColorCommand = "white2" | 
    "niconicowhite" | 
    "red2" | 
    "truered" | 
    "pink2" | 
    "orange2" | 
    "passionorange" | 
    "yellow2" | 
    "madyellow" |
    "cyan2" |
    "blue2" | 
    "marineblue" | 
    "purple2" |
    "nobleviolet" |
    "black2" | 
    "elementalgreen" |
    "green2";

/**
 * コメントの特殊な色コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが特殊な色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isSpecialColorCommand = (command: Command): command is SpecialColorCommand => {
    return command === 'white2' || 
    command === 'niconicowhite' ||
    command === 'red2' ||
    command === 'truered' ||
    command === 'pink2' ||
    command === 'orange2' ||
    command === 'passionorange' ||
    command === 'yellow2' ||
    command === 'madyellow' ||
    command === 'cyan2' ||
    command === 'blue2' ||
    command === 'marineblue' ||
    command === 'purple2' ||
    command === 'nobleviolet' ||
    command === 'black2' ||
    command === 'elementalgreen' ||
    command === 'green2';
}

/**
 * コメントの型定義
 */
export type Comment = {
    id: string;
    node: React.ReactNode[];
    state: CommentState;
    commands?: Command[];
}

/**
 * CommentContainerコンポーネントのプロパティの型定義
 */
export interface CommentContainerProps {
    comment: Comment;
    animationDuration: number;
    onAnimationEnd?: (id: string) => void;
}

/**
 * CommentRendererコンポーネントのプロパティの型定義
 */
export interface CommentRendererProps {
    comment: Comment;
    commands?: Command[];
    lane: number;
    animationDuration: number;
    onAnimationEnd?: () => void;
}
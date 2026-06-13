/**
 * 外部エモートの型定義
 */
export type ExternalEmote = {
    name: string;
    url: string;
}

/**
 * エモートマップの型定義
 */
export type ExternalEmoteMap = Map<string, ExternalEmote>;


/**
 * 接続状態のリスト
 */
export const CONNECTION_STATUS = ["connecting", "connected", "disconnected", "error"] as const;

/**
 * 接続状態を表す型
 */
export type ConnectionStatus = typeof CONNECTION_STATUS[number];

/**
 * 接続状態かどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列が接続状態である場合はtrue、それ以外の場合はfalse
 */
export const isConnectionStatus = (value: string): value is ConnectionStatus => {
    return CONNECTION_STATUS.includes(value as ConnectionStatus);
}

/**
 * エモートの型定義
 */
export type Emote = {
    id?: string;
    endIndex: number;
    imageUrl: string;
    name: string;
    startIndex: number;
    zeroWidth?: boolean;
    type: string;
}

/**
 * メッセージの型定義
 */
export type Message = {
    text: string;
    emotes: Emote[];
}

/**
 * Streamerbotクライアントを使用するためのカスタムフックのオプション
 */
export type UseStreamerBotOptions = {
    host?: string;
    port?: number;
    endpoint?: string;
    password?: string;
    onComment: (message: Message) => void;
    monitorInteractions?: boolean;
}

/**
 * カスタムスタンプの設定を表す型
 * commandName: コマンド名（例: "stamp1"）
 * dataUri: スタンプの画像URI （例: "data:image/png;base64,..."）
 * effectType: スタンプのエフェクトタイプ（現状は "default" のみ）
 */
export type CustomStampConfig = {
  commandName: string;
  dataUri: string;
  effectType: "default";
}

/**
 * アプリケーションの設定を表す型
 * host: Streamer Botのホストアドレス
 * port: Streamer Botのポート番号
 * endpoint: Streamer Botのエンドポイント
 * password: Streamer Botのパスワード（省略可能）
 * customStamps: カスタムスタンプの設定の配列
 * monitorInteractions: 視聴者のインタラクションを監視するかどうか
 * introCountDisplayLimit: ご紹介の表示時間の上限（秒）
 */
export type AppConfig = {
  host: string;
  port: number;
  endpoint: string;
  password: string | undefined;
  customStamps: CustomStampConfig[];
  monitorInteractions: boolean;
  autoRaiderIntro: boolean;
  introCountDisplayLimit: number;
};

/**
 * カスタムスタンプのマップの型定義
 * キーはコマンド名、値はCustomStampConfigオブジェクト
 */
export type CustomStampMap = Map<string, CustomStampConfig>;


/**
 * エフェクトコマンドのリスト
 */
export const EFFECT_COMMANDS = ["sakura", "snow", "maruta", "kamifubuki", "rain", "chikuwa", "marutai", "balloons"] as const;

/**
 * エフェクトコマンドの型定義
 * 例: 桜、雪、丸太、紙吹雪、雨など
 */
export type EffectCommand = typeof EFFECT_COMMANDS[number];

/**
 * コメントのエフェクトコマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドがエフェクトコマンドである場合はtrue、それ以外の場合はfalse
 */
export const isEffectCommand = (command: Command): command is EffectCommand => {
    return EFFECT_COMMANDS.includes(command as EffectCommand);
}

/**
 * エフェクトコマンドの文字列かどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列がエフェクトコマンドである場合はtrue、それ以外の場合はfalse
 */
export const isEffectCommandString = (value: string): value is EffectCommand => {
    return EFFECT_COMMANDS.includes(value as EffectCommand);
}

/**
 * コメントのサイズを指定するコマンドのリスト
 */
export const SIZE_COMMANDS = ["small", "medium", "big"] as const;

/**
 * コメントのサイズを指定するコマンドの型定義
 */
export type SizeCommand = typeof SIZE_COMMANDS[number];

/**
 * コメントのサイズコマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドがサイズコマンドである場合はtrue、それ以外の場合はfalse
 */
export const isSizeCommand = (command: Command): command is SizeCommand => {
    return SIZE_COMMANDS.includes(command as SizeCommand);
}

/**
 * コメントのサイズコマンドかどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列がサイズコマンドである場合はtrue、それ以外の場合はfalse
 */
export const isSizeCommandString = (value: string): value is SizeCommand => {
    return SIZE_COMMANDS.includes(value as SizeCommand);
}

export const ALIGNMENT_COMMANDS = ["ue", "naka", "shita", "migi", "hidari", "migiue", "migishita", "hidariue", "hidarishita"] as const;

/**
 * コメントの位置を指定するコマンドの型定義
 */
export type AlignmentCommand = typeof ALIGNMENT_COMMANDS[number];

/**
 * コメントの位置コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが位置コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isAlignmentCommand = (command: Command): command is AlignmentCommand => {
    return ALIGNMENT_COMMANDS.includes(command as AlignmentCommand);
}

/**
 * コメントの位置コマンドかどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列が位置コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isAlignmentCommandString = (value: string): value is AlignmentCommand => {
    return ALIGNMENT_COMMANDS.includes(value as AlignmentCommand);
}

/**
 * コメントの基本色を指定するコマンドのリスト
 */
export const BASE_COLOR_COMMANDS = ["white", "red", "orange", "blue", "green", "yellow", "pink", "cyan", "purple", "black"] as const;

/**
 * コメントの基本色を指定するコマンドの型定義
 */
export type BaseColorCommand = typeof BASE_COLOR_COMMANDS[number];

/**
 * コメントの基本色コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが基本色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isBaseColorCommand = (command: Command): command is BaseColorCommand => {
    return BASE_COLOR_COMMANDS.includes(command as BaseColorCommand);
}

/**
 * コメントの基本色コマンドの文字列かどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列が基本色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isBaseColorCommandString = (value: string): value is BaseColorCommand => {
    return BASE_COLOR_COMMANDS.includes(value as BaseColorCommand);
}

/**
 * コメントの特殊な色を指定するコマンドのリスト
 */
export const SPECIAL_COLOR_COMMANDS = ["white2", "niconicowhite", "red2", "truered", "pink2", "orange2", "passionorange", "yellow2", "madyellow", "cyan2", "blue2", "marineblue", "purple2", "nobleviolet", "black2", "elementalgreen", "green2"] as const;

/**
 * コメントの特殊色を指定するコマンドの型定義
 */
export type SpecialColorCommand = typeof SPECIAL_COLOR_COMMANDS[number];


/**
 * コメントの特殊な色コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが特殊な色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isSpecialColorCommand = (command: Command): command is SpecialColorCommand => {
    return SPECIAL_COLOR_COMMANDS.includes(command as SpecialColorCommand);
}

/**
 * コメントの特殊な色コマンドの文字列かどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列が特殊な色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isSpecialColorCommandString = (value: string): value is SpecialColorCommand => {
    return SPECIAL_COLOR_COMMANDS.includes(value as SpecialColorCommand);
}

/**
 * コメントの色を指定するコマンドの型定義
 */
export type ColorCommand = BaseColorCommand | SpecialColorCommand;

/**
 * コメントのコマンドの型定義
 */
export type Command = SizeCommand | AlignmentCommand | ColorCommand | EffectCommand;

/**
 * コマンドの種類とルールを定義
 */
export const HeadCommandRules = {
    Effect: EFFECT_COMMANDS,
    Color: [...BASE_COLOR_COMMANDS, ...SPECIAL_COLOR_COMMANDS],
    Size: SIZE_COMMANDS,
    Alignment: ALIGNMENT_COMMANDS,
};

/**
 * コメントの色コマンドかどうかを判定する関数
 * @param command - コマンド
 * @returns コマンドが色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isColorCommand = (command: Command): command is ColorCommand => {
    return isBaseColorCommand(command) || isSpecialColorCommand(command);
}

/**
 * コメントの色コマンドの文字列かどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列が色コマンドである場合はtrue、それ以外の場合はfalse
 */
export const isColorCommandString = (value: string): value is ColorCommand => {
    return isBaseColorCommandString(value) || isSpecialColorCommandString(value);
}

/**
 * コメントのコマンドかどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列がコメントのコマンドである場合はtrue、それ以外の場合はfalse
 */
export const isCommand = (value: string): value is Command => {
    return isSizeCommand(value as Command) || isAlignmentCommand(value as Command) || isColorCommand(value as Command) || isEffectCommand(value as Command);
}

/**
 * コメントのコマンドの文字列かどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列がコメントのコマンドである場合はtrue、それ以外の場合はfalse
 */
export const isCommandString = (value: string): value is Command => {
    return isSizeCommandString(value) || isAlignmentCommandString(value) || isColorCommandString(value) || isEffectCommandString(value);
}

/**
 * 変換後のコメントの型定義
 */
export type Comment = {
    id: string;
    node: React.ReactNode;
}

/**
 * コメントのトークンの型定義
 * text: トークンのテキスト
 * isKeyword: トークンがコマンドなどのキーワードであるかどうか
 * type: トークンの種類（キーワードかテキストか）
 * subType: トークンのサブタイプ（Twitchのエモート、外部エモート、カスタムスタンプなど）
 * dataUri: エモートやスタンプの画像URL（キーワードでサブタイプがエモートやスタンプの場合に使用）
 */
export type Token = {
    text: string;
    isKeyword: boolean;
    type: 'keyword' | 'text';
    subType: 'none' | 'twitch' | 'external' | 'custom';
    dataUri?: string;
    imageUrl?: string;
};


export type AudienceMap = {
    subscribe: string[];
    comment: string[];
    cheer: string[];
    raid: string[];
    gift: string[];
}

export type Clip = {
    videoUrl: string;
    title: string;
    duration: number;
}

export type StreamerBotContextType = {
    sendShoutoutCommand: (userName: string) => Promise<void>;
}
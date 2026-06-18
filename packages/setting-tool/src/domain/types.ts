/**
 * カスタムスタンプの型定義
 */
export type CustomStamp = {
    commandName: string;
    dataUri: string;
    effectType?: string;
};

/**
 * 組み込みエフェクトの型定義
 */
export type BuiltInEffects = {
    sakura: boolean;
    snow: boolean;
    balloons: boolean;
    marutai: boolean;
    maruta: boolean;
    chikuwa: boolean;
    kamifubuki: boolean;
    rain: boolean;
}

/**
 * 設定の型定義
 */
export type Config = {
    host: string;
    port: number;
    endpoint: string;
    password?: string;
    customStamps: CustomStamp[];
    monitorInteractions: boolean;
    autoRaiderIntro: boolean;
    introCountDisplayLimit: number;
    builtInEffects?: BuiltInEffects;
};

/**
 * エフェクトの種類のリスト
 */
export const EFFECT_TYPES = ["default", "falling"] as const;

/**
 * エフェクトの種類を表す型
 */
export type EffectType = typeof EFFECT_TYPES[number];

/**
 * EffectTypeの文字列かどうかを判定する関数
 * @param value - 判定する文字列
 * @returns 文字列がEffectTypeである場合はtrue、それ以外の場合はfalse
 */
 export const isEffectType = (value: unknown): value is EffectType => {
     return typeof value === 'string' && EFFECT_TYPES.includes(value as EffectType);
 }
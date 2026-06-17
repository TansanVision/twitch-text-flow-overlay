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
    builtInEffects: BuiltInEffects;
};
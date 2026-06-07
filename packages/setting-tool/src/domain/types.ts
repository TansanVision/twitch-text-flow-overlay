/**
 * カスタムスタンプの型定義
 */
export type CustomStamp = {
    commandName: string;
    dataUri: string;
    effectType?: string;
};

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
};
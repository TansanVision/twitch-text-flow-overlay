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
 * カスタムスタンプのマップの型定義
 * キーはコマンド名、値はCustomStampConfigオブジェクト
 */
export type CustomStampMap = Map<string, CustomStampConfig>;

/**
 * アプリケーションの設定を表す型
 * host: Streamer Botのホストアドレス
 * port: Streamer Botのポート番号
 * endpoint: Streamer Botのエンドポイント
 * password: Streamer Botのパスワード（省略可能）
 * customStamps: カスタムスタンプの設定の配列
 */
export type AppConfig = {
  host: string;
  port: number;
  endpoint: string;
  password: string | undefined;
  customStamps: CustomStampConfig[];
};
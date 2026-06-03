import type { Config } from "./types";

/**
 * HTMLファイルかどうか判定する関数
 * @param {File} file - 判定するファイル
 * @param {string} content - ファイルの内容
 * @returns {boolean} HTMLファイルであればtrue、そうでなければfalse
 * @remarks ファイルの拡張子だけでなく、内容も確認することで、より正確にHTMLファイルを判定します。
 */
export function isHtmlFile(file: File, content: string): boolean {
    const nameCheck = /\.(html?)$/i.test(file.name);
    const contentCheck = /<!DOCTYPE html>|<html[\s>]/i.test(content);
    return nameCheck && contentCheck;
}

/**
 * HTML文字列に設定スクリプトが含まれているか判定する関数
 * @param html - 判定するHTML文字列
 * @returns 設定スクリプトが含まれていればtrue、そうでなければfalse
 * @remarks 設定スクリプトは、`<script id="config" type="application/json">`タグであると仮定しています。
 */
export function hasConfigScript(html: string): boolean {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return !!doc.querySelector('script#config[type="application/json"]');
}

/**
 * HTML文字列から config JSON を取得
 * @param {string} html
 * @returns {Config|null}
 */
export function getConfigJson(html: string): Config | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const script = doc.querySelector('script#config[type="application/json"]');
    if (!script) return null;

    try {
        if (!script.textContent) {
            console.error("設定スクリプトの内容が空です。");
            return null;
        }

         const parsed: unknown = JSON.parse(script.textContent.trim());
         
         if (!parsed || typeof parsed !== 'object') {
             console.error("設定スクリプトのJSONがオブジェクトではありません。");
             return null;
         }

         return parsed as Config;
    } catch (err) {
        console.error("JSONパースエラー:", err);
        return null;
    }
}

/**
 * HTML文字列に config JSON を書き込む関数
 * @param html - 元のHTML文字列
 * @param config - 書き込むConfigオブジェクト
 * @returns 書き込み後のHTML文字列
 * @remarks 既に設定スクリプトが存在する場合は上書きし、存在しない場合は新たに作成して<head>内に追加します。
 */
export function writeConfigToHtml(html: string, config: Config): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    let configScriptElement = doc.querySelector('script#config[type="application/json"]') as HTMLScriptElement | null;
    if (!configScriptElement) {
        configScriptElement = doc.createElement('script') as HTMLScriptElement;
        configScriptElement.id = 'config';
        configScriptElement.type = 'application/json';
        doc.head.appendChild(configScriptElement);
    }

     const json = JSON.stringify(config, null, 2).replace(/</g, '\\u003c');
     configScriptElement.textContent = json;

    const doctype = doc.doctype
        ? `<!DOCTYPE ${doc.doctype.name}${doc.doctype.publicId ? ` PUBLIC "${doc.doctype.publicId}"` : ''}${!doc.doctype.publicId && doc.doctype.systemId ? ' SYSTEM' : ''}${doc.doctype.systemId ? ` "${doc.doctype.systemId}"` : ''}>`
        : '<!doctype html>';
        
    return `${doctype}\n${doc.documentElement.outerHTML}`;
}

/**
 * HTML文字列をBlobに変換してダウンロードする関数
 * @param html - ダウンロードするHTML文字列
 * @returns void
 * @remarks ブラウザのBlob APIを使用して、HTML文字列をファイルとしてダウンロードします。ダウンロードされるファイル名は "twitch-text-flow-overlay.html" です。
 */
export function download(html: string) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'twitch-text-flow-overlay.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
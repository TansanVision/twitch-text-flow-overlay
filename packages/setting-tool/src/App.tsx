import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';

/**
 * カスタムスタンプの型定義
 */
type CustomStamp = {
    commandName: string;
    dataUri: string;
};

/**
 * 設定の型定義
 */
type Config = {
    host: string;
    port: number;
    endpoint: string;
    password?: string;
    customStamps: CustomStamp[];
};

/**
 * カスタムスタンプフォームの引数の型定義
 */
type CustomStampFormArgs = {
    open: boolean;
    value?: CustomStamp;
    onClose: () => void;
    onAdd: (stamp: CustomStamp) => void;
}

/**
 * 設定画面のスタイル
 */
const SettingsStyle : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
};

/**
 * ファイルアップロードエリアのスタイル
 */
const FileUploadStyle : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
};

/**
 * エラーメッセージのスタイル
 */
const ErrorStyle : React.CSSProperties = {
    color: 'red',
    fontWeight: 'bold',
};

/**
 * カスタムスタンプフォームのスタイル
 */
const CustomStampFormStyle : React.CSSProperties = {
    inset: '0',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

/**
 * HTMLファイルかどうか判定する関数
 * @param {File} file - 判定するファイル
 * @param {string} content - ファイルの内容
 * @returns {boolean} HTMLファイルであればtrue、そうでなければfalse
 * @remarks ファイルの拡張子だけでなく、内容も確認することで、より正確にHTMLファイルを判定します。
 */
function isHtmlFile(file: File, content: string): boolean {
    const nameCheck = /\.(html?|HTML?)$/.test(file.name);
    const contentCheck = /<!DOCTYPE html>|<html[\s>]/i.test(content);
    return nameCheck && contentCheck;
}

/**
 * HTML文字列に設定スクリプトが含まれているか判定する関数
 * @param html - 判定するHTML文字列
 * @returns 設定スクリプトが含まれていればtrue、そうでなければfalse
 * @remarks 設定スクリプトは、`<script id="config" type="application/json">`タグであると仮定しています。
 */
function hasConfigScript(html: string): boolean {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return !!doc.querySelector('script#config[type="application/json"]');
}

/**
 * HTML文字列から config JSON を取得
 * @param {string} html
 * @returns {Config|null}
 */
function getConfigJson(html: string): Config | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const script = doc.querySelector('script#config[type="application/json"]');
    if (!script) return null;

    try {
        if (!script.textContent) {
            console.error("設定スクリプトの内容が空です。");
            return null;
        }

        return JSON.parse(script.textContent.trim());
    } catch (err) {
        console.error("JSONパースエラー:", err);
        return null;
    }
}

/**
 * カスタムスタンプ追加フォームコンポーネント
 * @param onClose - フォームを閉じるためのコールバック関数
 * @param onAdd - スタンプを追加するためのコールバック関数
 * @returns JSX.Element
 * @remarks スタンプの名前と画像ファイルを入力できるフォームを表示します。画像のプレビューも表示します。
 */
const CustomStampForm = ({
    open = false,
    value = undefined,
    onClose, 
    onAdd
} : CustomStampFormArgs) : JSX.Element => {
        useEffect(() => {
            if (open) {
                setCustomStamp(value);
            }
        }, [open]);

        const [customStamp, setCustomStamp] = useState<CustomStamp | undefined>(value);

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0] || null;
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUri = reader.result as string;
                    setCustomStamp(previous => previous ? { ...previous, dataUri } : { commandName: '', dataUri });
                };
                reader.readAsDataURL(selectedFile);
            } else {
                 setCustomStamp(previous =>
                     previous ? { ...previous, dataUri: '' } : { commandName: '', dataUri: '' }
                 );
             }
        };

        const handleAdd = () => {
            if (!customStamp) {
                alert("スタンプ情報が不完全です。");
                return;
            }

            if (!customStamp.commandName.trim()) {
                alert("コマンド名前を入力してください。");
                return;
            }

            if (!customStamp.commandName.trim()) {
                alert("コマンド名前を入力してください。");
                return;
            }

            if (!customStamp?.dataUri) {
                alert("スタンプ画像を選択してください。");
                return;
            }

            onAdd(customStamp);
            onClose();
        }
        
        if (!open) {
            return <></>;
        }

        return (
            <div style={CustomStampFormStyle} onClick={onClose}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    border: '1px solid #ccc',
                    padding: '1rem',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                }} onClick={(e) => e.stopPropagation()}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                        }}>
                            <span>コマンド名前:</span>
                            <input type="text" 
                                placeholder="コマンド名前" 
                                value={customStamp?.commandName || ''} 
                                onChange={(e) => setCustomStamp(previous => {
                                    const commandName = e.target.value;
                                    if (!previous) return { commandName, dataUri: "" };
                                    return { ...previous, commandName };
                                })} 
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                        }}>
                            <span>スタンプ画像:</span>
                            <input type="file" accept='.gif,.jpg,.png,.bmp' onChange={handleFileChange} />
                        </div>
                        {customStamp?.dataUri && <img
                            style={{
                                width: "56px",
                                height: "56px"
                            }}
                            src={customStamp.dataUri || "プレビュー"} alt="プレビュー"  />}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                        }} onClick={handleAdd}>追加</button>
                        <button style={{
                            backgroundColor: 'gray',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                        }} onClick={onClose}>キャンセル</button>
                    </div>
                </div>
            </div>
        );
}

function App() {
    const [html, setHtml] = useState<string>('');
    const [config, setConfig] = useState<Config | null>(null);
    const [port, setPort] = useState<string>('8080');
    const [address, setAddress] = useState<string>('127.0.0.1');
    const [endpoint, setEndpoint] = useState<string>('/');
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [isCustomStampFormOpen, setIsCustomStampFormOpen] = useState<boolean>(false);
    const [customStamps, setCustomStamps] = useState<CustomStamp[]>([]);
    const [fileUploadError, setFileUploadError] = useState<string | null>(null);

    const handleSave = () => {
        if (!config) {
            alert("設定が読み込まれていません。");
            return;
        }

        const newConfig: Config = {
            ...config,
            address: undefined,
            host: address,
            port: Number(port),
            endpoint,
            password: !!password ? password : undefined,
            customStamps: customStamps.map(stamp => ({
                commandName: stamp.commandName,
                dataUri: stamp.dataUri,
                effectType: "default",
            })),
        };

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        let configScriptElement = doc.querySelector('script#config[type="application/json"]') as HTMLScriptElement | null;
        if (!configScriptElement) {
            configScriptElement = doc.createElement('script') as HTMLScriptElement;
            configScriptElement.id = 'config';
            configScriptElement.type = 'application/json';
            doc.head.appendChild(configScriptElement);
        }

        configScriptElement.textContent = JSON.stringify(newConfig, null, 2);

        const serializer = new XMLSerializer();
        const updatedHtml = serializer.serializeToString(doc);
        setHtml(updatedHtml);

        // ダウンロードリンクを作成してクリックすることで、更新されたHTMLをダウンロードさせる
        const blob = new Blob([updatedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'twitch-text-flow-overlay.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setFileUploadError("ファイルが選択されていません。");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result as string;
            if (!isHtmlFile(file, content)) {
                setFileUploadError("選択されたファイルは有効なHTMLファイルではありません。");
                return;
            }
            setHtml(content);
            if (!hasConfigScript(content)) {
                setFileUploadError("HTMLファイルに設定スクリプトが見つかりませんでした。");
                return;
            }
            const configJson = getConfigJson(content);
            if (!configJson) {
                setFileUploadError("設定スクリプトのJSONが無効です。");
                return;
            }

            setConfig(configJson);
            setAddress(configJson['host'] || '127.0.0.1');
            setPort(configJson['port'] ? String(configJson['port']) : '8080');
            setEndpoint(configJson['endpoint'] || '/');
            setPassword(configJson['password']);
            setCustomStamps(configJson['customStamps'] ? 
                configJson['customStamps'].map((stamp: CustomStamp) => ({
                    commandName: stamp.commandName,
                    dataUri: stamp.dataUri,
                })) : []);
            setFileUploadError(null);
        };
        reader.onerror = () => {
            setFileUploadError("ファイルの読み込みに失敗しました。");
        };
        reader.readAsText(file);
    };

    return (
        <div style={SettingsStyle}>
            {!config && <div style={FileUploadStyle}>
                <span>オーバーレイhtmlを指定してください。</span>
                <input type="file" onChange={handleFileChange} />
                <span>※オーバーレイhtmlは、twitch-text-flow-overlayのビルド後のindex.htmlを指定してください。</span>
                {fileUploadError && <span style={ErrorStyle}>{fileUploadError}</span>}
            </div>}
            
            {config && <>
            <div id="setting-area" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            }}>
                <div id="address-area" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                }}>
                    <span>Address:</span>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div id="port-area" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                }}>
                    <span>Port:</span>
                    <input type="text" value={port} onChange={(e) => setPort(e.target.value)} />
                </div>
                <div id="endpoint-area" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                }}>
                    <span>Endpoint:</span>
                    <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
                </div>
                <div id="password-area" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                }}>
                    <span>Password:</span>
                    <input type="text" value={password || ''} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button onClick={() => setIsCustomStampFormOpen(true)}>追加</button>
                <CustomStampForm
                    open={isCustomStampFormOpen}
                    value={undefined}
                    onClose={() => setIsCustomStampFormOpen(false)}
                    onAdd={(stamp: CustomStamp) => {
                        if (customStamps.some(s => s.commandName === stamp.commandName)) {
                            alert("同じコマンド名前のスタンプが既に存在しています。");
                            return;
                        }

                        setCustomStamps(
                            previous => [...previous, { commandName: stamp.commandName, dataUri: stamp.dataUri }])}}
                />
                <div id="custom-stamps-area" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: 'calc(100vh - 250px)',
                }}>
                    {customStamps.map((stamp, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: "fit-content",
                            height: "fit-content",
                            gap: '1rem',
                            border: '1px solid #ccc',
                            padding: '0.5rem',
                            borderRadius: '4px',
                        }}>
                            <div>
                                <span>コマンド名前:</span>
                                <span>{stamp.commandName}</span>
                            </div>
                            <div>
                                <span>画像:</span>
                                <img src={stamp.dataUri || "プレビュー"} alt="プレビュー" style={{ width: "56px", height: "56px" }} />
                            </div>
                            <div>
                                <button onClick={() => setCustomStamps(previous => previous.filter((_, i) => i !== index))}>削除</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleSave}>保存</button>
            </>}
        </div>
    );
}

export { App };
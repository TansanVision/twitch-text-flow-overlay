import { css } from '@emotion/css';
import { getConfigJson, isHtmlFile, writeConfigToHtml, hasConfigScript, download } from '../domain/utils';
import React, { useState, useEffect } from 'react';
import { Toast } from './Toast';
import type { Config, CustomStamp, BuiltInEffects } from '../domain/types';
import type { JSX } from 'react';
import { Tabs } from './Tabs';
import { ToggleButton } from './ToggleButton';

/**
 * Loadフェーズのプロパティの型定義
 */
type LoadPhaseProps = {
    onConfigLoaded: (html: string,config: Config) => void;
}

const LoadPhaseClassName = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    padding: 16px;
    gap: 1rem;
    .upload-area {
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 16px;
        gap: 0.5rem;
        input[type="file"] {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
        }
        span {
            font-size: 0.875rem;
            color: #666;
        }
    }
`;

/**
 * LoadPhaseコンポーネントは、ユーザーがオーバーレイHTMLファイルをアップロードして設定を読み込むためのフォームを提供します。
 * @param param0 - onConfigLoaded: 設定が正常に読み込まれたときに呼び出されるコールバック関数。引数としてHTML文字列とConfigオブジェクトが渡されます。
 * @returns JSX.Element
 */
const LoadPhase : React.FC<LoadPhaseProps> = ({ onConfigLoaded }) => {
    useEffect(() => {
        setError(null);
    }, []);

    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setError("ファイルが選択されていません。");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result as string;
            if (!isHtmlFile(file, content)) {
                setError("選択されたファイルは有効なHTMLファイルではありません。");
                return;
            }

            if (!hasConfigScript(content)) {
                setError("HTMLファイルに設定スクリプトが見つかりませんでした。");
                return;
            }
            const configJson = getConfigJson(content);
            if (!configJson) {
                setError("設定スクリプトのJSONが無効です。");
                return;
            }

            // configで足りない値があればデフォルト値を入れる
            configJson.host = configJson.host || '127.0.0.1';
            configJson.port = configJson.port || 8080;
            configJson.endpoint = configJson.endpoint || '/';
            configJson.password = configJson.password || '';
            configJson.customStamps = Array.isArray(configJson.customStamps)
                ? configJson.customStamps 
                : [];
             configJson.monitorInteractions =
                 typeof configJson.monitorInteractions === 'boolean' ? configJson.monitorInteractions : false;;

            onConfigLoaded(content, configJson);
            setError(null);
        };
        reader.onerror = () => {
            setError("ファイルの読み込みに失敗しました。");
        };
        reader.readAsText(file);
    };

    return <div className={LoadPhaseClassName}>
        <div className="upload-area">
            <span>twitch-text-flow-overlay.htmlを指定してください。</span>
            <input type="file" onChange={handleFileChange} />
        </div>
        {error && <Toast message={error} onClose={() => setError(null)} variant="error" />}
    </div>
}

/**
 * カスタムスタンプフォームの引数の型定義
 */
type CustomStampFormArgs = {
    open: boolean;
    value?: CustomStamp;
    onClose: () => void;
    onAdd: (stamp: CustomStamp) => void;
}

const CustomStampFormStyle = css`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    & > div {
        background-color: white;
        padding: 1rem;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        & > div {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            & > div {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.5rem;
                & > input[type="text"] {
                    flex: 1;
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                & > input[type="file"] {
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
            & > img {
                width: 56px;
                height: 56px;
                object-fit: contain;
                border: 1px solid #ccc; 
                border-radius: 4px;
            }
        }
        & > .form-buttons {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            gap: 0.5rem;
            & > button {
                padding: 0.5rem 1rem;
                background-color: #6441a5;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                &:hover {
                    background-color: #4b3580;
                }
            }
            .add {
                background-color: #4caf50;
                &:hover {
                    background-color: #388e3c;
                }
            }
            .cancel {
                background-color: #f44336;
                &:hover {
                    background-color: #d32f2f;
                }
            }
        }
     }
`;

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
        }, [open, value]);

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
            <div className={CustomStampFormStyle} onClick={onClose}>
                <div onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>コマンド名前:</span>
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
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                            <span>スタンプ画像:</span>
                            <input type="file" accept='.gif,.jpg,.png,.bmp' onChange={handleFileChange} />
                        </div>
                        <div>
                            <span>エフェクト種類:</span>
                            <select
                                value={customStamp?.effectType || "default"}
                                onChange={(e) => setCustomStamp(previous => {
                                    const effectType = e.target.value;
                                    if (!previous) return { commandName: "", dataUri: "", effectType };
                                    return { ...previous, effectType };
                                })}
                            >
                                <option value="default">デフォルト</option>
                                <option value="falling">落下</option>
                            </select>
                        </div>
                        {customStamp?.dataUri && <img src={customStamp.dataUri || "プレビュー"} alt="プレビュー"  />}
                    </div>
                    <div className="form-buttons">
                        <button className="add" onClick={handleAdd}>追加</button>
                        <button className="cancel" onClick={onClose}>キャンセル</button>
                    </div>
                </div>
            </div>
        );
}

type BaseFormValue = {
    address: string;
    port: string;
    endpoint: string;
    password?: string;
}

const baseFormStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        span {
            width: 80px;
        }
        input[type="text"] {
            flex: 1;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    }
`;

/**
 * BaseFormコンポーネントは、Websocketの基本設定を入力するためのフォームを提供します。
 * @param value - フォームの初期値を含むオブジェクト
 * @param onChange - フォームの値が変更されたときに呼び出されるコールバック関数。引数として現在のフォームの値を含むオブジェクトが渡されます。
 * @returns JSX.Element
 */
const BaseForm: React.FC<{ value: BaseFormValue; onChange: (value: BaseFormValue) => void }> = ({ value, onChange }) => {
    const [address, setAddress] = useState<string>(value.address);
    const [port, setPort] = useState<string>(value.port);
    const [endpoint, setEndpoint] = useState<string>(value.endpoint);
    const [password, setPassword] = useState<string | undefined>(value.password);

    useEffect(() => {
        setAddress(value.address);
        setPort(value.port);
        setEndpoint(value.endpoint);
        setPassword(value.password);
    }, [value]);

    const handleChange = (field: 'address' | 'port' | 'endpoint' | 'password', value: string) => {
        switch (field) {
            case 'address':
                setAddress(value);
                onChange({ address: value, port, endpoint, password });
                break;
            case 'port':
                setPort(value);
                onChange({ address, port: value, endpoint, password });
                break;
            case 'endpoint':
                setEndpoint(value);
                onChange({ address, port, endpoint: value, password });
                break;
            case 'password':
                setPassword(value);
                onChange({ address, port, endpoint, password: value });
                break;
        }
    }

    return <div className={baseFormStyle} style={{ paddingTop: "1rem" }}>
        <div>
            <span>Address:</span>
            <input type="text" value={address} onChange={(e) => handleChange('address', e.target.value)} />
        </div>
        <div>
            <span>Port:</span>
            <input type="text" value={port} onChange={(e) => handleChange('port', e.target.value)} />
        </div>
        <div>
            <span>Endpoint:</span>
            <input type="text" value={endpoint} onChange={(e) => handleChange('endpoint', e.target.value)} />
        </div>
        <div>
            <span>Password:</span>
            <input type="text" value={password || ''} onChange={(e) => handleChange('password', e.target.value)} />
        </div>
    </div>;
}

const customStampArea = css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.25rem;
        .add {
            padding: 0.25rem 0.5rem;
            background-color: #6441a5;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
                background-color: #4b3580;
            }
        }
    }
    & > div {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        flex-wrap: wrap;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 40vh;
        & > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: fit-content;
            height: fit-content;
            gap: 1rem;
            border: 1px solid #ccc;
            padding: 0.5rem;
            border-radius: 4px;
            & > div {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.5rem;
                & > span {
                    width: 200px;
                }
                & > input[type="text"] {
                    flex: 1;
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
            }
            & > img {
                width: 56px;
                height: 56px;
                object-fit: contain;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            & > div {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                & > button {
                    padding: 0.25rem 0.5rem;
                    background-color: #6441a5;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    &:hover {
                        background-color: #4b3580;
                    }
                }
                .edit {
                    background-color: #ff9800;
                    &:hover {
                        background-color: #f57c00;
                    }
                }
                .delete {
                    background-color: #f44336;
                    &:hover {
                        background-color: #d32f2f;
                    }
                }    
            }
        }
    }
`;

const builtInRoot = css`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding-top: 1rem;
    & > span {
        font-size: 1.25rem;
        font-weight: bold;
        padding-bottom: 1rem;
    }
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 44vh;
`;

const builtInFormField = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem;
    width: 100%;
    & > .label {
        font-size: 1rem;
        font-weight: bold;
        width: 100px;
    }
    &:hover {
        background-color: #f0f0f0;
    }
`;

type BuiltInFormProps = {
    value: BuiltInEffects;
    onChange: (value: BuiltInEffects) => void;
}

/**
 * BuiltInFormコンポーネントは、組み込みエフェクトのON/OFFを切り替えるためのフォームを提供します。
 * @param param0 - value: 組み込みエフェクトの現在の状態を含むオブジェクト
 * @returns JSX.Element
 * @remarks 組み込みエフェクトのON/OFFを切り替えるためのトグルボタンを提供します。
 */
const BuiltInForm : React.FC<BuiltInFormProps> = ({ value, onChange }) => {
    const [balloonsEffect, setBalloonsEffect] = useState<boolean>(value.balloons);
    const [marutaiEffect, setMarutaiEffect] = useState<boolean>(value.marutai);
    const [marutaEffect, setMarutaEffect] = useState<boolean>(value.maruta);
    const [chikuwaEffect, setChikuwaEffect] = useState<boolean>(value.chikuwa);
    const [kamifubukiEffect, setKamifubukiEffect] = useState<boolean>(value.kamifubuki);
    const [rainEffect, setRainEffect] = useState<boolean>(value.rain);
    const [sakuraEffect, setSakuraEffect] = useState<boolean>(value.sakura);
    const [snowEffect, setSnowEffect] = useState<boolean>(value.snow);

    useEffect(() => {
        setBalloonsEffect(value.balloons);
        setMarutaiEffect(value.marutai);
        setMarutaEffect(value.maruta);
        setChikuwaEffect(value.chikuwa);
        setKamifubukiEffect(value.kamifubuki);
        setRainEffect(value.rain);
        setSakuraEffect(value.sakura);
        setSnowEffect(value.snow);
    }, [value]);

    const handleChange = (key: keyof BuiltInEffects, checked: boolean) => {
        switch (key) {
            case 'balloons':
                setBalloonsEffect(checked);
                onChange({ ...value, balloons: checked });
                break;
            case 'marutai':
                setMarutaiEffect(checked);
                onChange({ ...value, marutai: checked });
                break;
            case 'maruta':
                setMarutaEffect(checked);
                onChange({ ...value, maruta: checked });
                break;
            case 'chikuwa':
                setChikuwaEffect(checked);
                onChange({ ...value, chikuwa: checked });
                break;
            case 'kamifubuki':
                setKamifubukiEffect(checked);
                onChange({ ...value, kamifubuki: checked });
                break;
            case 'rain':
                setRainEffect(checked);
                onChange({ ...value, rain: checked });
                break;
            case 'sakura':
                setSakuraEffect(checked);
                onChange({ ...value, sakura: checked });
                break;
            case 'snow':
                setSnowEffect(checked);
                onChange({ ...value, snow: checked });
                break;
        }
    }

    return <div className={builtInRoot}>
            <span>組み込みエフェクトのON/OFFを切り替えます</span>
            <div className={builtInFormField}>
                <div className="label">sakura</div>
                <ToggleButton ariaLabel="Sakura Effect" checked={sakuraEffect} onChange={(checked) => handleChange('sakura', checked)} />
            </div>
            <div className={builtInFormField}>
                <div className="label">snow</div>
                <ToggleButton ariaLabel="Snow Effect" checked={snowEffect} onChange={(checked) => handleChange('snow', checked)} />
            </div>
            <div className={builtInFormField}>
                <div className="label">balloons</div>
                <ToggleButton ariaLabel="Balloons Effect" checked={balloonsEffect} onChange={(checked) => handleChange('balloons', checked)} />
            </div>
            <div className={builtInFormField}>
                <div className="label">marutai</div>
                <ToggleButton ariaLabel="Marutai Effect" checked={marutaiEffect} onChange={(checked) => handleChange('marutai', checked)} />
            </div>
            <div className={builtInFormField}>
                <div className="label">maruta</div>
                <ToggleButton ariaLabel="Maruta Effect" checked={marutaEffect} onChange={(checked) => handleChange('maruta', checked)} />
            </div>
            <div className={builtInFormField}>
                <div className="label">chikuwa</div>
                <ToggleButton ariaLabel="Chikuwa Effect" checked={chikuwaEffect} onChange={(checked) => handleChange('chikuwa', checked)} />
            </div>
            <div className={builtInFormField}>
                <div className="label">kamifubuki</div>
                <ToggleButton ariaLabel="Kamifubuki Effect" checked={kamifubukiEffect} onChange={(checked) => handleChange('kamifubuki', checked)} />
            </div>
            <div className={builtInFormField}>
                <div className="label">rain</div>
                <ToggleButton ariaLabel="Rain Effect" checked={rainEffect} onChange={(checked) => handleChange('rain', checked)} />
            </div>
        </div>;
}

type SettingFormProps = {
    html: string;
    config: Config;
}

/**
 * SettingFormコンポーネントは、新規設定の入力フォームを提供します。
 * @returns JSX.Element
 * @remarks Address、Port、Endpoint、Passwordの入力フィールドと、カスタムスタンプの追加機能を提供します。保存ボタンも含まれます。
 */
const SettingForm : React.FC<SettingFormProps> = ({ html, config }) => {
    useEffect(() => {
        setAddress(config.host);
        setPort(config.port.toString());
        setEndpoint(config.endpoint);
        setPassword(config.password);
        setCustomStamps(config.customStamps || []);
        setMonitorInteractions(config.monitorInteractions === undefined ? false : config.monitorInteractions);
        setBuiltInEffects({
            sakura: config.builtInEffects?.sakura ?? true,
            snow: config.builtInEffects?.snow ?? true,
            balloons: config.builtInEffects?.balloons ?? true,
            marutai: config.builtInEffects?.marutai ?? true,
            maruta: config.builtInEffects?.maruta ?? true,
            chikuwa: config.builtInEffects?.chikuwa ?? true,
            kamifubuki: config.builtInEffects?.kamifubuki ?? true,
            rain: config.builtInEffects?.rain ?? true,
        });
    }, [html, config]);

    const [address, setAddress] = useState<string>('');
    const [port, setPort] = useState<string>('');
    const [endpoint, setEndpoint] = useState<string>('');
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [customStamps, setCustomStamps] = useState<CustomStamp[]>([]);
    const [monitorInteractions, setMonitorInteractions] = useState<boolean>(false);
    const [isCustomStampFormOpen, setIsCustomStampFormOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<{ stamp: CustomStamp; index: number } | null>(null);
    const [builtInEffects, setBuiltInEffects] = useState<BuiltInEffects>({
        sakura: config.builtInEffects?.sakura ?? true,
        snow: config.builtInEffects?.snow ?? true,
        balloons: config.builtInEffects?.balloons ?? true,
        marutai: config.builtInEffects?.marutai ?? true,
        maruta: config.builtInEffects?.maruta ?? true,
        chikuwa: config.builtInEffects?.chikuwa ?? true,
        kamifubuki: config.builtInEffects?.kamifubuki ?? true,
        rain: config.builtInEffects?.rain ?? true,
    });
    const [activeTab, setActiveTab] = useState<string>('Websocket');

    const handleCloseCustomStampForm = () => {
        setIsCustomStampFormOpen(false);
        setEditData(null);
    }

    const handleAddOrEditCustomStamp = (stamp: CustomStamp) => {
         if (/\s/.test(stamp.commandName)) {
             alert(`コマンド名前に空白を含めることはできません: ${stamp.commandName}`);
             return;
         }

        if (editData) {
             if (customStamps.some((s, i) => i !== editData.index && s.commandName === stamp.commandName)) {
                 alert(`同じコマンド名前のスタンプが既に存在しています: ${stamp.commandName}`);
                 return;
             }
            setCustomStamps(previous => previous.map((s, i) => i === editData.index ? stamp : s));
            setEditData(null);
        } else {
             if (customStamps.some((s) => s.commandName === stamp.commandName)) {
                 alert(`同じコマンド名前のスタンプが既に存在しています: ${stamp.commandName}`);
                 return;
             }
            setCustomStamps(previous => [...previous, stamp]);
        }
    }

    const handleEditCustomStamp = (stamp: CustomStamp, index: number) => {
        setEditData({ stamp, index });
        setIsCustomStampFormOpen(true);
    }

    const handleDeleteCustomStamp = (index: number) => {
        setCustomStamps(previous => previous.filter((_, i) => i !== index));
    }

    const handleSave = () => {
        if (!config) {
            alert("設定が読み込まれていません。");
            return;
        }

        const parsedPort = Number(port);
         if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
             alert("ポート番号は1〜65535の整数で入力してください。");
             return;
         }

        const newConfig: Config = {
            ...config,
            host: address,
            port: parsedPort,
            endpoint,
            password: !!password ? password : undefined,
            customStamps: customStamps.map(stamp => ({
                commandName: stamp.commandName,
                dataUri: stamp.dataUri,
                effectType: stamp.effectType || "default",
            })),
            monitorInteractions: monitorInteractions,
            builtInEffects: builtInEffects,
        };

        const updatedHtml = writeConfigToHtml(html, newConfig);
        download(updatedHtml);
    }

    return <div>
        <Tabs
            tabs={[
                { id: "Websocket", label: "Websocket" },
                { id: "InteractiveMonitoring", label: "インタラクティブ監視" },
                { id: "CustomStamps", label: "カスタムスタンプ" },
                { id: "BuiltIn", label: "組み込み" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />
        <button className="save" onClick={handleSave}>オーバーレイファイルを保存</button>
        {activeTab === "Websocket" && <BaseForm
            value={{ address: address, port: port, endpoint: endpoint, password: password }}
            onChange={(value) => {
                setAddress(value.address);
                setPort(value.port);
                setEndpoint(value.endpoint);
                setPassword(value.password);
            }}
        />}
        {activeTab === "InteractiveMonitoring" && <div style={{ paddingTop: "1rem" }}>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '0.5rem',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>インタラクション監視</span>
                    <span>(レイド完了時またはStreamerbotのカスタムイベント発生時にインタラクション結果を取得するかどうか)</span>
                </div>
                <ToggleButton ariaLabel="interactive-monitoring" checked={monitorInteractions} onChange={(checked) => setMonitorInteractions(checked)} />
            </div>
        </div>}
        {activeTab === "CustomStamps" && <><div className={customStampArea}>
            <header>
                <span>カスタムスタンプ</span>
                <button className="add" onClick={() => setIsCustomStampFormOpen(true)}>追加</button>
            </header>
            <div>
                 {customStamps.map((stamp, index) => (
                     !stamp.dataUri ? null : (
                         <div key={stamp.commandName}>
                             <div>
                                 <span>コマンド名前:</span>
                                 <span>{stamp.commandName}</span>
                             </div>
                             <div>
                                 <span>画像:</span>
                                 <img src={stamp.dataUri} alt="プレビュー" style={{ width: "56px", height: "56px" }} />
                             </div>
                             <div>
                                 <span>エフェクト種類:</span>
                                 <span>{stamp.effectType === "falling" ? "落下" : "デフォルト"}</span>
                             </div>
                             <div>
                                 <button className="edit" onClick={() => handleEditCustomStamp(stamp, index)}>編集</button>
                                 <button className="delete" onClick={() => handleDeleteCustomStamp(index)}>削除</button>
                             </div>
                          </div>
                     )
                 ))}
            </div>
        </div>
        <CustomStampForm
            open={isCustomStampFormOpen}
            value={editData ? editData.stamp : undefined}
            onClose={handleCloseCustomStampForm}
            onAdd={handleAddOrEditCustomStamp}
        /></>}
        {activeTab === "BuiltIn" && <BuiltInForm
            value={builtInEffects}
                onChange={(value) => {
                    setBuiltInEffects(value);
                }}
            />}
    </div>
}

const newFormClass = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    .save {
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        padding: 0.5rem 1rem;
        margin: 0.5rem auto;
        &:hover {
            background-color: #388e3c;
        }
    }
`;

/**
 * NewFormコンポーネントは、新規設定の入力フォームを提供します。
 * @returns JSX.Element
 * @remarks LoadPhaseコンポーネントを表示して設定の読み込みを行い、設定が読み込まれた後にSettingFormコンポーネントを表示します。
 */
export const NewForm : React.FC<{}> = () => {
    const [config, setConfig] = useState<Config | null>(null);
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        setConfig(null);
        setHtml(null);
    }, []);

    return <div className={newFormClass}>
        {!config && <LoadPhase onConfigLoaded={(html, config) => {
            setConfig(config);
            setHtml(html);
        }} />}
        
        {config && html && <SettingForm html={html} config={config} />}
    </div>
};
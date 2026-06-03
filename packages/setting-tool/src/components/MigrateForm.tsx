import React, { useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { isHtmlFile, writeConfigToHtml, getConfigJson, download } from '../domain/utils';
import { Toast } from './Toast';

const migrateFormClassName = css`
    display: flex;
    flex-direction: row;
    width: 95vw;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 8px;
    & > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .explain {
            font-size: 0.875rem;
            color: #666;
            white-space: nowrap;
        }
        input[type="file"] {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
        }
    }
`;

const migrateButtonClassName = css`
    padding: 0.5rem 1rem;
    background-color: #6441a5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer; 
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

/**
 * MigrateFormコンポーネントは、ユーザーが移行元と移行先のHTMLファイルを選択するためのフォームを提供します。
 * @returns JSX.Element
 */
export const MigrateForm: React.FC = () => {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [targetFile, setTargetFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChangeFile = useCallback((file: File | null, id: 'source' | 'target') => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (isHtmlFile(file, content)) {
                    setError(null);
                    setSuccess(null);
                    if (id === 'source') {
                        setSourceFile(file);
                    } else {
                        setTargetFile(file);
                    }
                } else {
                     if (id === 'source') {
                         setSourceFile(null);
                     } else {
                         setTargetFile(null);
                     }
                    setSuccess(null);
                    setError("選択されたファイルは有効なHTMLファイルではありません。");
                }
            };
            reader.onerror = () => {
                if (id === 'source') {
                    setSourceFile(null);
                } else {
                    setTargetFile(null);
                }
                setSuccess(null);
                setError('ファイルの読み込みに失敗しました。');
            };
            reader.readAsText(file);
        }
    }, []);

    const handleMigrate = useCallback(() => {
        if (sourceFile && targetFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const sourceContent = e.target?.result as string;
                const configJson = getConfigJson(sourceContent);
                if (configJson) {
                    const targetReader = new FileReader();
                    targetReader.onload = (e) => {
                        const targetContent = e.target?.result as string;
                        const updatedHtml = writeConfigToHtml(targetContent, configJson);
                        download(updatedHtml);
                        setError(null);
                        setSuccess("移行が完了しました。");
                    };
                    targetReader.onerror = () => {
                        setSuccess(null);
                        setError('移行先HTMLファイルの読み込みに失敗しました。');
                    };
                    targetReader.readAsText(targetFile);
                } else {
                    setSuccess(null);
                    setError("移行元HTMLファイルから設定を取得できませんでした。");
                }
            };
            reader.onerror = () => {
                setSuccess(null);
                setError('移行元HTMLファイルの読み込みに失敗しました。');
            };
            reader.readAsText(sourceFile);
        }
    }, [sourceFile, targetFile]);

    return <>
        <div className={migrateFormClassName}>
            <div>
                <div className="explain">移行元HTMLファイルを選択してください。</div>
                    <input type="file" accept=".html" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleChangeFile(file, 'source');
                        }
                    }} />
                </div>
                <div>⇒</div>
                <div>
                    <div className="explain">移行先のHTMLファイルを選択してください。</div>
                        <input type="file" accept=".html" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleChangeFile(file, 'target');
                            }
                        }} />
                </div>
        </div>
        {sourceFile && targetFile && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button className={migrateButtonClassName} onClick={handleMigrate}>移行する</button>
        </div>}
        {error && <Toast message={error} onClose={() => setError(null)} variant="error" />}
        {success && <Toast message={success} onClose={() => setSuccess(null)} variant="success" />}
    </>;
}
import React, { useState } from 'react';
import { css } from '@emotion/css';

type SwitcherProps = {
    onClick: (id: 'new' | 'migrate') => void;
}

const switcherClassName = css`
    display: flex;
    gap: 1rem;
    & > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        input[type="radio"] {
            display: none;
        }
        label {
            white-space: nowrap;
            padding: 0.5rem 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
        }
        input[type="radio"]:checked + label {
            background-color: #6441a5;
            color: white;
            border-color: #6441a5;
        }
        .explanation {
            display: block;
            margin-top: 0.25rem;
            font-size: 0.875rem;
            color: #666;
        }
    }
`;

/**
 * Switcherコンポーネントは、新規設定と移行の選択肢を提供するラジオボタンのグループです。
 * @param param0 - SwitcherPropsオブジェクト
 * @returns JSX.Element
 */
export const Switcher: React.FC<SwitcherProps> = ({ onClick }) => {
    const [checked, setChecked] = useState<'new' | 'migrate'>('new');

    const handleChange = (id: 'new' | 'migrate') => {
        setChecked(id);
        onClick(id);
    };

    return <div className={switcherClassName}>
        <div>
            <input type="radio" id="new" name="switcher" checked={checked === "new"} onChange={() => handleChange("new")} />
            <label htmlFor="new">新規</label>
            <span className="explanation">初期設定を行う場合はこちらを選択してください</span>
        </div>
        <div>
            <input type="radio" id="migrate" name="switcher" checked={checked === "migrate"} onChange={() => handleChange("migrate")} />
            <label htmlFor="migrate">移行</label>
            <span className="explanation">既存の設定を引き継ぐ場合はこちらを選択してください</span>
        </div>
    </div>
}
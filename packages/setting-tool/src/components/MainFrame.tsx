import React from 'react';
import { css } from '@emotion/css';

/**
 * MainFramePropsは、MainFrameコンポーネントのプロパティの型定義です。
 * childrenは、MainFrame内に表示される子コンポーネントを表します。
 */
type MainFrameProps = {
    children?: React.ReactNode;
}

/**
 * MainFrameコンポーネントは、設定ツールのメインフレームを提供します。
 * ヘッダーと子コンポーネントを含むレイアウトを定義します。
 * @param children - メインフレーム内に表示する子コンポーネント
 * @returns JSX.Element
 */
const mainClassName = css`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    & > header {
        background-color: #6441a5;
        color: white;
        text-align: center;
    }
    & > div {
        flex: 1;
        padding: 8px;
        overflow: hidden;
    }
`;

/**
 * MainFrameコンポーネントは、設定ツールのメインフレームを提供します。
 * @param param0 - MainFramePropsオブジェクト
 * @returns JSX.Element
 */
export const MainFrame: React.FC<MainFrameProps> = ({ children }) => {
    return <div className={mainClassName}>
        <header>
            <h1>Twitch Text Flow Overlay - Setting Tool</h1>
        </header>
        <div>
            {children}
        </div>
    </div>
}
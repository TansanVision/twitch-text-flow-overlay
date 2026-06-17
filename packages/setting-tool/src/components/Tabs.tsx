import { useMemo, useCallback } from 'react';
import { css } from '@emotion/css';

export type Tab = {
  id: string;
  label: string;
};

export type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
};

const tabsContainerStyle = css`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

const tabButtonStyle = css`
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
`;

const activeTabButtonStyle = css`
    border-bottom: 2px solid #007bff;
    font-weight: bold;
`;

/**
 * Tabsコンポーネントは、タブのリストを表示し、アクティブなタブを切り替えるためのUIを提供します。
 * @param param0 - TabsPropsオブジェクト
 * @returns JSX.Element
 */
export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
    const memoizedTabs = useMemo(() => tabs, [tabs]);
    const handleTabChange = useCallback((id: string) => {
        onTabChange(id);
    }, [onTabChange]);

    return (
        <div className={tabsContainerStyle}>
            {memoizedTabs.map((tab) => (
                <button
                    type="button"
                    key={tab.id}
                    className={`${tabButtonStyle} ${activeTab === tab.id ? activeTabButtonStyle : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
import { createContext, useContext, useState } from "react";

type Intro = {
    raiderName: string,
    displayName: string,
    iconUrl: string,
    viewerCount: number,
    clips: {
        videoUrl: string;
        title: string;
        duration: number;
    }[]
}

type IntroProviderProps = {
    children: React.ReactNode,
    enabled?: boolean;
}

const IntroContext = createContext<{
    intros: Intro[];
    addIntro: (intro: Intro) => void;
    removeIntro: (raiderName: string) => void;
}>({
    intros: [],
    addIntro: () => undefined,
    removeIntro: () => undefined,
});

/**
 * TwitchのRaidイベントのイントロ情報を提供するコンテキストプロバイダー
 * @param param0 children - コンテキストプロバイダーでラップされる子コンポーネント
 * enabled - コンテキストプロバイダーを有効にするかどうか（デフォルトはfalse）
 * @returns TwitchのRaidイベントのイントロ情報を提供するコンテキストプロバイダー
 */
export const IntroProvider: React.FC<IntroProviderProps> = ({ children, enabled = false}) => {
    const [intros, setIntros] = useState<Intro[]>([]);

    const addIntro = (intro: Intro) => {
        if (!enabled) {
            return;
        }
        setIntros(prev => [...prev, intro]);
    }

    const removeIntro = (raiderName: string) => {
        if (!enabled) {
            return;
        }
        setIntros(prev => {
            const index = prev.findIndex(intro => intro.raiderName === raiderName);
            if (index === -1) {
                return prev;
            }

            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
    }

    return <IntroContext.Provider value={{ intros, addIntro, removeIntro }}>
        {children}
    </IntroContext.Provider>
}

/**
 * TwitchのRaidイベントのイントロ情報を取得するカスタムフック
 * @returns TwitchのRaidイベントのイントロ情報を取得するカスタムフック
 */
export const useIntro = () => {
    const { intros, addIntro, removeIntro } = useContext(IntroContext);

    return {
        intros,
        addIntro,
        removeIntro,
    };
}
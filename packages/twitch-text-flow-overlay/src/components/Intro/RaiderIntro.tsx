
import React, { useMemo } from 'react';
import { Intro } from './Intro';
import { useIntro } from "../../providers/IntroProviders";

type RaiderIntroProps = {
    introCountDisplayLimit?: number;
}

/**
 * RaiderIntroコンポーネント
 * @param param0 RaiderIntroProps
 * @returns React.FC
 * @description TwitchのRaidイベントのイントロを表示するコンポーネント。IntroProviderからイントロ情報を取得し、Introコンポーネントを表示します。イントロが終了すると、IntroProviderからイントロ情報を削除します。
 * @example
 * <RaiderIntro introCountDisplayLimit={60} />
 */
export const RaiderIntro: React.FC<RaiderIntroProps> = ({ introCountDisplayLimit = 60 }) => {
    const { intros, removeIntro } = useIntro();

    const current = useMemo(() => {
        if (intros.length === 0) {
            return null;
        }
        return intros[0];
    }, [intros]);

    const handleFinished = () => {
        if (current) {
            removeIntro(current.raiderName);
        }
    }

    return (
        <>
            {current && <Intro {...current} countdownTime={introCountDisplayLimit} onFinished={handleFinished} />}
        </>
    );
}
import { useRef, useCallback, useEffect } from 'react';
import type { AudienceMap } from '../domain/types';

/**
 * フォーマットされた視聴者データを生成する関数
 * @param data - 視聴者データのマップ
 * @returns フォーマットされた視聴者データの文字列
 */
function formatAudienceData(data: AudienceMap): string {
  return Object.entries(data)
    .filter(([, names]) => names.length > 0)
    .map(([type, names]) => {
        let title = type;
        switch (type) {
            case "subscribe":
                title = "サブスクしてくれた方";
                break;
            case "comment":
                title = "コメントしてくれた方";
                break;
            case "cheer":
                title = "チア・ビットしてくれた方";
                break;
            case "raid":
                title = "レイドしてくれた方";
                break;
            case "gift":
                title = "ギフトを送ってくれた方";
                break;
        }

      const list = names.map((n) => `${n}`).join("\n");
      return `## ${title}\n${list}`;
    })
    .join("\n\n");
}

/**
 * 視聴者のインタラクションを監視するためのカスタムフック
 * @returns 視聴者のインタラクションを管理する関数とデータを提供するオブジェクト
 */
export const useMonitorInteraction = () => {
    const audienceRef = useRef<AudienceMap>({
        subscribe: [],
        comment: [],
        cheer: [],
        raid: [],
        gift: []
    });

    useEffect(() => {
        // クリーンアップ関数で視聴者データをリセットする
        return () => {
            audienceRef.current = {
                subscribe: [],
                comment: [],
                cheer: [],
                raid: [],
                gift: []
            };
        };
    }, []);

    const audienceData = formatAudienceData(audienceRef.current);

    const addAudience = useCallback((type: keyof AudienceMap, name: string) => {
        const currentList = audienceRef.current[type];
        if (!currentList.includes(name)) {
            currentList.push(name);
        }
    }, []);

    const getAudience = useCallback(() => {
        return audienceRef.current;
    }, []);

    return {
        addAudience,
        getAudience,
        audienceData,
    };
}

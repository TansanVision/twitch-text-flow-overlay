import { useEffect, useCallback, useRef, useMemo } from 'react';
import type { CustomStampConfig, CustomStampMap, BuiltInEffects } from '../domain/types';
import type { ExternalEmoteMap } from '../domain/types';
import { getNodes } from '../utils/pipeline';

/**
 * TwitchユーザーIDに基づいて外部エモートをロードする関数
 * @returns エモートマップ
 */
export async function loadExternalEmotes(): Promise<ExternalEmoteMap> {
    const map: ExternalEmoteMap = new Map();
    const loadTasks: Promise<void>[] = [];

    loadTasks.push(loadBttvGlobal(map));
    loadTasks.push(loadSevenTvGlobal(map));

    await Promise.allSettled(loadTasks);

    return map;
}

/**
 * BTTVのグローバルエモートをロードしてマップに追加します。
 * @param map - エモートマップ
 * @return Promise<void>
 */
async function loadBttvGlobal(map: ExternalEmoteMap): Promise<void> {
    const response = await fetch('https://api.betterttv.net/3/cached/emotes/global');
    const data = await response.json();

    for (const emote of data) {
        map.set(emote.code, {
            name: emote.code,
            url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
        });
    }
}

/**
 * 7TVのグローバルエモートをロードしてマップに追加します。
 * @param map - エモートマップ
 * @returns Promise<void>
 */
async function loadSevenTvGlobal(map: ExternalEmoteMap): Promise<void> {
    const response = await fetch('https://7tv.io/v3/emotes/global');
    const data = await response.json();

    for (const emote of data.emotes ?? []) {
        const name = emote.name;
        const file = emote.data?.host?.files?.find((f: any) => f.name === "4x.webp")
            ?? emote.data?.host?.files?.find((f: any) => f.name === "3x.webp")
            ?? emote.data?.host?.files?.[0];

        if (!name || !file) {
            continue;
        }

        map.set(name, {
            name,
            url: `https:${emote.data.host.url}${file.name}`,
        });
    }
}

/**
 * カスタムスタンプの設定をロードしてマップに追加します。
 * @param stamps - カスタムスタンプの設定の配列
 * @returns カスタムスタンプのマップ
 */
export function loadCustomStamps(stamps: CustomStampConfig[]): CustomStampMap {
    const map: CustomStampMap = new Map();

    for (const s of stamps) {
        map.set(s.commandName, s);
    }

    return map;
}

/**
 * Twitchのエモートをロードしてメッセージテキストをエモートでレンダリングするためのカスタムフック
 * @returns エモートマップとレンダリング関数
 */
export function useTwitchEmotes(customStamps: CustomStampConfig[] = [], builtInEffects: BuiltInEffects = {
    balloons: true,
    chikuwa: true,
    kamifubuki: true,
    maruta: true,
    marutai: true,
    rain: true,
    sakura: true,
    snow: true,
}) {
    const emotesCache = useRef<ExternalEmoteMap>(new Map());
    const customStampMap = useMemo(() => loadCustomStamps(customStamps), [customStamps]);

    const getNodesInternal = useCallback((text: string, twitchEmotes: any) => {
        return getNodes(text, builtInEffects, twitchEmotes, emotesCache.current, customStampMap);
    }, [emotesCache, customStampMap, builtInEffects]);

     useEffect(() => {
        loadExternalEmotes().then((loadedEmotes) => {
            emotesCache.current = loadedEmotes;
        });
    }, []);

    return { getNodes: getNodesInternal };
}

import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { extractTokens } from '../components/Comment/utils';
import type { Command } from '../components/Comment/types';
import type { CustomStampConfig, CustomStampMap } from '../types';

/**
 * 外部エモートの型定義
 */
export type ExternalEmote = {
    name: string;
    url: string;
}

/**
 * エモートマップの型定義
 */
export type EmoteMap = Map<string, ExternalEmote>;

/**
 * TwitchユーザーIDに基づいて外部エモートをロードする関数
 * @returns エモートマップ
 */
export async function loadExternalEmotes(): Promise<EmoteMap> {
    const map: EmoteMap = new Map();
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
async function loadBttvGlobal(map: EmoteMap): Promise<void> {
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
async function loadSevenTvGlobal(map: EmoteMap): Promise<void> {
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
 * Twitchのエモートのポジションを修正します。
 * @param twitchEmotes - Twitchのエモートデータ
 * @param adjustmentLength - コメントテキストから削除されたコマンドの長さ
 * @returns 修正されたTwitchのエモートデータ
 */
const fixTwitchEmotes = (twitchEmotes: any, adjustmentLength: number) => {
    if (!twitchEmotes) {
        return [];
    }

    const items = Array.isArray(twitchEmotes?.items) 
        ? twitchEmotes.items 
        : Array.isArray(twitchEmotes)
            ? twitchEmotes
            : [];

    return items.map((emote: any) => ({
        ...emote,
        startIndex: Math.max(0, (emote.startIndex ?? 0) - adjustmentLength),
        endIndex: Math.max(0, (emote.endIndex ?? 0) - adjustmentLength),
    }));
}

/**
 * Twitchのメッセージテキストをエモートでレンダリングする関数
 * @param text - メッセージテキスト
 * @param twitchEmotes - Twitchのエモートデータ
 * @param externalEmotes - 外部エモートのマップ
 * @param customStamps - カスタムスタンプのマップ
 * @returns レンダリングされたReactノードの配列
 */
export function renderTwitchMessageEmotes(
    text: string, 
    twitchEmotes: any, 
    externalEmotes: EmoteMap,
    customStamps: CustomStampMap
): React.ReactNode[] {
    const nativeEmotes = 
        twitchEmotes?.items ??
        twitchEmotes ??
        [];

    return nativeEmotes.length > 0
        ? renderNativeTwitchEmotes(text, nativeEmotes, externalEmotes, customStamps)
        : renderExternalEmotesOnly(text, externalEmotes, customStamps);
}

/**
 * Twitchのメッセージテキストをネイティブエモートと外部エモートでレンダリングする関数
 * @param text - メッセージテキスト
 * @param nativeEmotes - Twitchのネイティブエモートデータ
 * @param externalEmotes - 外部エモートのマップ
 * @param customStamps - カスタムスタンプのマップ
 * @returns レンダリングされたReactノードの配列
 */
function renderNativeTwitchEmotes(
    text: string, 
    nativeEmotes: any[],
    externalEmotes: EmoteMap,
    customStamps: CustomStampMap
): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    const sorted = [...nativeEmotes].sort((a, b) => {
        const aStart = a.startIndex ?? 0;
        const bStart = b.startIndex ?? 0;
        return aStart - bStart;
    });

    for (const emote of sorted) {
        const start = emote.startIndex ?? 0;
        const end = emote.endIndex ?? 0;

        if (lastIndex < start) {
            result.push(...renderExternalEmotesOnly(text.slice(lastIndex, start), externalEmotes, customStamps));
        }

        result.push(
            React.createElement('img', {
                key: `${emote.id}-${start}`,
                src: emote.imageUrl,
                style: {
                    height: "100%",
                    objectFit: "cover",
                    maxHeight: "52px"
                }
            })
        );

        lastIndex = end + 1;
    }

    if (lastIndex < text.length) {
        result.push(...renderExternalEmotesOnly(text.slice(lastIndex), externalEmotes, customStamps));
    }

    return result;
}

/**
 * URLが有効かどうかを検証する関数
 * @param url - 検証するURL文字列
 * @returns URLが有効な場合はtrue、そうでない場合はfalse
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Twitchのメッセージテキストを外部エモートのみでレンダリングする関数
 * @param text - メッセージテキスト
 * @param externalEmotes - 外部エモートのマップ
 * @param customStamps - カスタムスタンプのマップ
 * @returns レンダリングされたReactノードの配列
 */
function renderExternalEmotesOnly(
    text: string, 
    externalEmotes: EmoteMap,
    customStamps: CustomStampMap
): React.ReactNode[] {
    const parts = text.split(/\s+/);

    // ue ☺
    // endIndex: 4
    // startIndex: 3
    return parts.map((part, index) => {
        const custom = customStamps.get(part);
        if (custom) {
             const customNode = React.createElement("img", {
                 key: `custom-${custom.commandName}-${index}`,
                 src: custom.dataUri,
                 alt: custom.commandName,
                 "data-effect": custom.effectType,
                 style: {
                     height: "100%",
                     objectFit: "cover",
                     maxHeight: "52px"
                 }
             });
             return index < parts.length - 1
                 ? [customNode, ' ']
                 : [customNode];
        }

        const emote = externalEmotes.get(part);

        if (!emote) {
            if (part.includes("U+2003")) {
                const subParts = part.split("U+2003");

                return React.createElement("div",
                    { key: `text-${index}`,
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 0,
                            margin: 0,
                            padding: 0,
                            lineHeight: "1em",
                        }
                    },
                    subParts.map((subPart, subIndex) => (
                        React.createElement("span",
                            { key: `text-${index}-${subIndex}` },
                            subPart
                        )
                    ))
                );
            }
            else {
                return [React.createElement("div", 
                    { key: `text-${index}` 
                }, part)];
            }
        } else {
            if (isValidUrl(emote.url)) {
                return React.createElement('img', {
                    key: `${emote.name}-${index}`,
                    src: emote.url,
                    alt: emote.name,
                    style: {
                        height: "100%",
                        objectFit: "cover",
                        maxHeight: "52px"
                    }
                });
            } else {
                return [React.createElement("div", 
                    { key: `text-${index}` 
                }, part)];
            }
        }
    });
}

/**
 * Twitchのエモートをロードしてメッセージテキストをエモートでレンダリングするためのカスタムフック
 * @returns エモートマップとレンダリング関数
 */
export function useTwitchEmotes(customStamps: CustomStampConfig[] = []) {
    const emotesCache = useRef<EmoteMap>(new Map());
    const customStampMap = useMemo(() => loadCustomStamps(customStamps), [customStamps]);

    const getNodesAndCommands = useCallback((text: string, twitchEmotes: any) => {
        const parsed = extractTokens(text);

        const fixedEmotes = fixTwitchEmotes(twitchEmotes, parsed.removeLength);
        const commands = parsed.tokens 
            ? Object.values(parsed.tokens).filter((cmd): cmd is Command => !!cmd) 
            : [];

        return {
            commands: commands,
            nodes: renderTwitchMessageEmotes(parsed.remainingText, fixedEmotes, emotesCache.current, customStampMap),
        };
    }, [emotesCache, customStampMap]);

     useEffect(() => {
        loadExternalEmotes().then((loadedEmotes) => {
            emotesCache.current = loadedEmotes;
        });
    }, []);

    return { getNodesAndCommands };
}

import React, { useState, useEffect, useCallback } from 'react';
import { extractTokens } from '../components/Comment/utils';
import type { Command } from '../components/Comment/types';

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
 * Twitchのエモートのポジションを修正します。
 * @param twitchEmotes - Twitchのエモートデータ
 * @param removedLength - コメントテキストから削除されたコマンドの長さ
 * @returns 修正されたTwitchのエモートデータ
 */
const fixTwitchEmotes = (twitchEmotes: any, removedLength: number) => {
    if (!twitchEmotes && !twitchEmotes?.items) {
        return [];
    }

    const items = twitchEmotes?.items ?? twitchEmotes;

    return items.map((emote: any) => ({
        ...emote,
        startIndex: Math.max(0, (emote.startIndex ?? 0) - removedLength),
        endIndex: Math.max(0, (emote.endIndex ?? 0) - removedLength),
    }));
}

/**
 * Twitchのメッセージテキストをエモートでレンダリングする関数
 * @param text - メッセージテキスト
 * @param twitchEmotes - Twitchのエモートデータ
 * @param externalEmotes - 外部エモートのマップ
 * @returns レンダリングされたReactノードの配列
 */
export function renderTwitchMessageEmotes(
    text: string, 
    twitchEmotes: any, 
    externalEmotes: EmoteMap
): React.ReactNode[] {
    const nativeEmotes = 
        twitchEmotes?.items ??
        twitchEmotes ??
        [];

    return nativeEmotes.length > 0
        ? renderNativeTwitchEmotes(text, nativeEmotes, externalEmotes)
        : renderExternalEmotesOnly(text, externalEmotes);
}

/**
 * Twitchのメッセージテキストをネイティブエモートと外部エモートでレンダリングする関数
 * @param text - メッセージテキスト
 * @param nativeEmotes - Twitchのネイティブエモートデータ
 * @param externalEmotes - 外部エモートのマップ
 * @returns レンダリングされたReactノードの配列
 */
function renderNativeTwitchEmotes(
    text: string, 
    nativeEmotes: any[],
    externalEmotes: EmoteMap
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
            result.push(...renderExternalEmotesOnly(text.slice(lastIndex, start), externalEmotes));
        }

        result.push(
            React.createElement('img', {
                key: `${emote.id}-${start}`,
                src: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`,
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
        result.push(...renderExternalEmotesOnly(text.slice(lastIndex), externalEmotes));
    }

    return result;
}

/**
 * Twitchのメッセージテキストを外部エモートのみでレンダリングする関数
 * @param text - メッセージテキスト
 * @param externalEmotes - 外部エモートのマップ
 * @returns レンダリングされたReactノードの配列
 */
function renderExternalEmotesOnly(
    text: string, 
    externalEmotes: EmoteMap
): React.ReactNode[] {
    const parts = text.split(/\s+/);

    return parts.map((part, index) => {
        const emote = externalEmotes.get(part);

        if (!emote) {
            if (part.includes("U+2003")){
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
            else{
                return [React.createElement("div", 
                    { key: `text-${index}` 
                }, part)];
            }
        }

        return index < parts.length - 1 
            ? [React.createElement('img', {
                key: `${emote.name}-${index}`,
                src: emote.url,
                alt: emote.name,
                style: {
                    height: "100%",
                    objectFit: "cover",
                    maxHeight: "52px"
                }
            }), ' ']
            : [React.createElement('img', {
                key: `${emote.name}-${index}`,
                src: emote.url,
                alt: emote.name,
                style: {
                    height: "100%",
                    objectFit: "cover",
                    maxHeight: "52px"
                }
            })];
    });
}

/**
 * Twitchのエモートをロードしてメッセージテキストをエモートでレンダリングするためのカスタムフック
 * @returns エモートマップとレンダリング関数
 */
export function useTwitchEmotes() {
    const [emotes, setEmotes] = useState<EmoteMap>(new Map());
    const getNodesAndCommands = useCallback((text: string, twitchEmotes: any) => {
        const parsed = extractTokens(text);

        const fixedEmotes = fixTwitchEmotes(twitchEmotes, parsed.removeLength);
        const commands = parsed.tokens 
            ? Object.values(parsed.tokens).filter((cmd): cmd is Command => !!cmd) 
            : [];

        return {
            commands: commands,
            nodes: renderTwitchMessageEmotes(parsed.remainingText, fixedEmotes, emotes)
        };
    }, [emotes]);

     useEffect(() => {
        loadExternalEmotes().then((loadedEmotes) => {
            setEmotes(loadedEmotes);
        });
    }, []);

    return { emotes, getNodesAndCommands };
}
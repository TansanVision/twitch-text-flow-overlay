import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { extractTokens } from '../components/Comment/utils';
import type { Command } from '../components/Comment/types';
import type { CustomStampConfig, CustomStampMap } from '../types';
import type { Emote } from './useStreamerbot';

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
export type ExternalEmoteMap = Map<string, ExternalEmote>;

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
 * @param line - メッセージテキストの行
 * @param twitchEmotes - Twitchのエモートデータ
 * @param externalEmotes - 外部エモートのマップ
 * @param customStamps - カスタムスタンプのマップ
 * @returns レンダリングされたReactノードの配列
 */
function renderLine(
    line: string,
    twitchEmotes: Emote[],
    externalEmotes: ExternalEmoteMap,
    customStamps: CustomStampMap
): React.ReactNode[] {
    const parts = line.split(" ");
    const nodes: React.ReactNode[] = [];

    for (const [index, part] of parts.entries()) {
        // カスタムスタンプ
        const custom = customStamps.get(part);
        if (custom) {
            nodes.push(
                <img
                    key={`custom-${custom.commandName}-${part}-${index}`}
                    src={custom.dataUri}
                    data-effect={custom.effectType}
                />
            );
            continue;
        }

        // 外部エモート
        const external = externalEmotes.get(part);
        if (external) {
            nodes.push(
                <img
                    key={`external-${external.name}-${part}-${index}`}
                    src={external.url}
                />
            );
            continue;
        }

        // Twitch エモート
        const twitch = twitchEmotes.find(e => e.name === part);
        if (twitch) {
            if (twitch.imageUrl.includes("twemoji")) {
                nodes.push(
                    <span key={`twitch-${twitch.id}-${part}-${index}`}>
                        {part}
                    </span>
                );
            } else {
                nodes.push(
                    <img
                        key={`twitch-${twitch.id}-${part}-${index}`}
                        src={twitch.imageUrl}
                    />
                );
            }
            continue;
        }

        // 通常テキスト
        nodes.push(<span key={`text-${part}-${index}`}>{part} </span>);
    }

    return nodes;
}

/**
 * テキストをU+2003で正規化して分割する関数
 * @param text - 入力テキスト
 * @returns U+2003で分割されたテキストの配列
 */
function splitByU2003(text: string): string[] {
    return text
        .replace(/\u2003/g, " U+2003 ")
        .replace(/\s+/g, " ")
        .trim()
        .split("U+2003")
        .map(line => line.trim());
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
    twitchEmotes: Emote[], 
    externalEmotes: ExternalEmoteMap,
    customStamps: CustomStampMap
): React.ReactNode[] {
    const lines = splitByU2003(text);

    return lines.length === 1
        ? renderLine(lines[0], twitchEmotes, externalEmotes, customStamps)
        : [<div style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                margin: 0,
            }}>
                {lines.map((line, index) => (
                    <div
                        key={`line-${index}`}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            lineHeight: "1em",
                            gap: 0,
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {renderLine(line, twitchEmotes, externalEmotes, customStamps)}
                    </div>
                ))}
            </div>];
}

/**
 * Twitchのエモートをロードしてメッセージテキストをエモートでレンダリングするためのカスタムフック
 * @returns エモートマップとレンダリング関数
 */
export function useTwitchEmotes(customStamps: CustomStampConfig[] = []) {
    const emotesCache = useRef<ExternalEmoteMap>(new Map());
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

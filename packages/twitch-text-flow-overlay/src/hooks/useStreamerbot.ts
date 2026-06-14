import { StreamerbotClient } from '@streamerbot/client';
import { useState, useEffect, useRef } from 'react';
import type { ConnectionStatus, UseStreamerBotOptions, Message } from '../domain/types';
import { useMonitorInteraction } from './useMonitorInteraction';
import { useIntro } from '../providers/IntroProvider';

/**
 * メッセージを取得します。
 * @param data - データ
 * @returns メッセージ
 */
function getMessage({ data }: { data: any }): Message {
    const message = data?.text ?? data?.message?.message ?? '';
    const emotes = [...(data?.message?.emotes || []), ...(data?.cheerEmotes || [])];

    if (import.meta.env.MODE === 'development') {
        console.log('Received message data:', data);
    }

    return {
        text: message || '',
        emotes: emotes,
    }
}

/**
 * Streamerbotクライアントを使用するためのカスタムフック
 * @param param0 - オプションオブジェクト
 * @returns シャウトアウトコマンドを送信する関数と接続状態
 */
export function useStreamerBot({ 
    host = "127.0.0.1", 
    port = 8080, 
    endpoint = "/", 
    password, 
    onComment,
    monitorInteractions = false,
}: UseStreamerBotOptions) {
    const { addAudience,  audienceData } = useMonitorInteraction();
    const { addIntro } = useIntro();
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const clientRef = useRef<StreamerbotClient | null>(null);

    useEffect(() => {
        setStatus('connecting');

        const client = new StreamerbotClient({
            host,
            port,
            endpoint,
            password,
            autoReconnect: true,
            onConnect: () => setStatus('connected'),
            onDisconnect: () => setStatus('disconnected'),
            onError: () => setStatus('error'),
        });

        clientRef.current = client;

        const handleComment = ({ data }: { data: any }) => {
            const message = getMessage({ data });

            if (message) {
                onComment(message);
            }
        };

        client.on("Twitch.ChatMessage", ({ data } : { data: any }) => {
            // コメントイベント
            if (monitorInteractions) {
                const name = data?.user?.name;
                if (typeof name === 'string' && name !== '') {
                    addAudience("comment", name);
                }
            }
            handleComment({ data });
        });

        client.on("Twitch.Cheer", ({ data } : { data: any }) => {
            // bit or cheer
            if (monitorInteractions) {
                const name = data?.user?.name;
                if (typeof name === 'string' && name !== '') {
                    addAudience("cheer", name);
                }
            }
            handleComment({ data });
        });

        client.on("Twitch.Raid", ({ data } : { data: any }) => {
            // raid
            if (monitorInteractions) {
                const name = data?.user?.name;
                if (typeof name === 'string' && name !== '') {
                    addAudience("raid", name);
                }
            }
        });

        client.on("Twitch.RaidSend", async () => {
            if (monitorInteractions) {
                // ダウンロード処理
                await downloadAudienceData(audienceData);
            }
        });

        client.on("Twitch.Sub", ({ data } : { data: any }) => {
            // 新規サブスク
            if (monitorInteractions) {
                const name = data?.user?.name;
                if (typeof name === 'string' && name !== '') {
                    addAudience("subscribe", name);
                }
            }
            handleComment({ data });
        });

        client.on("Twitch.ReSub", ({ data } : { data: any }) => {
            // 継続サブスク
            if (monitorInteractions) {
                const name = data?.user?.name;
                if (typeof name === 'string' && name !== '') {
                    addAudience("subscribe", name);
                }
            }
            handleComment({ data });
        });

        client.on("Twitch.GiftSub", ({ data } : { data: any }) => {
            // ギフトサブスク
            if (monitorInteractions) {
                const name = data?.user?.name;
                if (typeof name === 'string' && name !== '') {
                    addAudience("gift", name);
                }
            }
            handleComment({ data });
        });

        client.on("Twitch.GiftBomb", ({ data } : { data: any }) => {
            // ギフト爆弾
            const name = data?.user?.name;
            if (monitorInteractions) {
                if (typeof name === 'string' && name !== '') {
                    addAudience("gift", name);
                }
            }
            const recipients = data.recipients;
            
            handleComment({ 
                data: { 
                    text: `${name ?? "Unknown User"} has sent ${recipients.length} gift subs!` },
                } as any
            );
        });

        client.on("General.Custom", (payload) => {
            if (payload.data?.eventType === "Raid.IntroRequested") {
                addIntro({
                    raiderName: payload.data?.raider?.name ?? "Unknown Raider",
                    displayName: payload.data?.raider?.displayName ?? "Unknown Raider",
                    iconUrl: payload.data?.raider?.iconUrl ?? "",
                    viewerCount: payload.data?.raider?.viewerCount ?? 0,
                    clips: Array.isArray(payload.data?.raider?.clips) ? payload.data.raider.clips.map((clip: any) => ({
                        videoUrl: clip?.url ?? "",
                        title: clip?.title ?? "",
                        duration: typeof clip?.duration === 'number' ? clip.duration : 0,
                    })) : [],
                });
            }
        });

        client.on("Raw.Action", async ({ data }) => {
            if (data.arguments.isTest) {
                if (data.arguments.triggerCategory === "Custom" && data.arguments["customEvent.event"] === "download") {
                    if (monitorInteractions) {
                        await downloadAudienceData(audienceData);
                    }
                }
            }
        });

        return () => {
            client.disconnect?.();
            clientRef.current = null;
        };
    }, [host, port, endpoint, password, onComment, monitorInteractions, addAudience, audienceData, addIntro]);

    /**
     * シャウトアウトコマンドをStreamerBotに送信します。
     * @param userName シャウトアウトするユーザーの名前
     */
    const sendShoutoutCommand = async (userName: string) => {
        const client = clientRef.current;
        if (!client) {
            return;
         }

         try {
            await client.doAction({
                name: "RaidShoutout",
            }, {
                raiderUserName: userName,
            });
         } catch (error) {
            console.error('Failed to send shoutout command:', error);
         }
    };

    const downloadAudienceData = async (data: string) => {
        const client = clientRef.current;
        if (!client) {
            return;
         }

         try {
            await client.doAction({
                name: "twitch-text-flow-overlay_audience_download",
            }, {
                data,
            });
         } catch (error) {
            console.error('Failed to download audience data:', error);
         }
    }

    return { sendShoutoutCommand, status };
}
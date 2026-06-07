import { StreamerbotClient } from '@streamerbot/client';
import { useState, useEffect, useRef } from 'react';
import type { ConnectionStatus, UseStreamerBotOptions, Message } from '../domain/types';
import { useMonitorInteraction } from './useMonitorInteraction';

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
 * @returns 接続状態
 */
export function useStreamerBot({ 
    host = "127.0.0.1", 
    port = 8080, 
    endpoint = "/", 
    password, 
    onComment,
    monitorInteractions = false,
}: UseStreamerBotOptions) {
    const { addAudience,  downloadAudienceData } = useMonitorInteraction();
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
            addAudience("comment", data.user.name);
            handleComment({ data });
        });

        client.on("Twitch.Cheer", ({ data } : { data: any }) => {
            // bit or cheer
            const user = data.user;
            addAudience("cheer", user.name);
            handleComment({ data });
        });

        client.on("Twitch.Raid", ({ data } : { data: any }) => {
            // raid
            const user = data.user;
            addAudience("raid", user.name);
        });

        client.on("Twitch.RaidSend", () => {
            if (monitorInteractions) {
                // ダウンロード処理
                downloadAudienceData();
            }
        });

        client.on("Twitch.Sub", ({ data } : { data: any }) => {
            // 新規サブスク
            const user = data.user;
            addAudience("subscribe", user.name);
            handleComment({ data });
        });

        client.on("Twitch.ReSub", ({ data } : { data: any }) => {
            // 継続サブスク
            const user = data.user;
            addAudience("subscribe", user.name);
            handleComment({ data });
        });

        client.on("Twitch.GiftSub", ({ data } : { data: any }) => {
            // ギフトサブスク
            const user = data.user;

            addAudience("gift", user.name);
            handleComment({ data });
        });

        client.on("Twitch.GiftBomb", ({ data } : { data: any }) => {
            // ギフト爆弾
            const user = data.user;
            const recipients = data.recipients;

            addAudience("gift", user.name);
            
            handleComment({ 
                data: { 
                    text: `${user.name} has sent ${recipients.length} gift subs!` },
                } as any
            );
        });

        // テスト用のコメントイベント
        client.on("Raw.Action", ({ data }) => {
            if (data.arguments.isTest) {
                if (data.arguments.triggerCategory === "Custom" && data.arguments["customEvent.event"] === "download") {
                    if (monitorInteractions) {
                        downloadAudienceData();
                    }
                } else if (data.arguments.triggerName === "Test" &&
                    data.arguments.triggerCategory === "Core") {
                        const regex = /comment/i;
                        for (let key in data.arguments) {
                            if (regex.test(key.toString())) {
                                handleComment({
                                    data: {
                                        message: {
                                            message: data.arguments[key],
                                            emotes: []
                                        },
                                    },
                                });
                            }
                        }
                    
                        handleComment({
                            data: {
                                message: { 
                                    message: "Kappa これはU+2003エモートテストです。",
                                    emotes: [
                                        {
                                            id: "25",
                                            name: "Kappa",
                                            startIndex: 0,
                                            endIndex: 4,
                                            imageUrl: "https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0",
                                            type: "Twitch"
                                        }
                                    ]
                                },
                            },
                        });
                }
            }
        });

        return () => {
            client.disconnect?.();
            clientRef.current = null;
        };
    }, [host, port, endpoint, password, onComment, monitorInteractions, addAudience, downloadAudienceData]);

    return status;
}
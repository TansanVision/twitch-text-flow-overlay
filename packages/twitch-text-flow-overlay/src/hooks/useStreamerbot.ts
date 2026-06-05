import { StreamerbotClient } from '@streamerbot/client';
import { useState, useEffect, useRef } from 'react';
import type { ConnectionStatus, UseStreamerBotOptions, Message } from '../domain/types';

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
    onComment 
}: UseStreamerBotOptions) {
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

        client.on("Twitch.ChatMessage", handleComment);

        client.on("Twitch.Cheer", ({ data }) => {
            // bit or cheer
            handleComment({ data });
        });

        client.on("Twitch.Raid", () => {
            // raid
        });

        client.on("Twitch.Sub", ({ data }) => {
            // 新規サブスク
            handleComment({ data });
        });

        client.on("Twitch.ReSub", ({ data }) => {
            // 継続サブスク
            handleComment({ data });
        });

        client.on("Twitch.GiftSub", ({ data }) => {
            // ギフトサブスク
            handleComment({ data });
        });

        client.on("Twitch.GiftBomb", ({ data } : { data: any }) => {
            // ギフト爆弾
            const user = data.user;
            const recipients = data.recipients;
            
            handleComment({ 
                data: { 
                    text: `${user.name} has sent ${recipients.length} gift subs!` },
                } as any
            );
        });

        // テスト用のコメントイベント
        client.on("Raw.Action", ({ data }) => {
            if (data.arguments.isTest) {
                if (data.arguments.triggerName === "Test" &&
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
    }, [host, port, endpoint, password, onComment]);

    return status;
}
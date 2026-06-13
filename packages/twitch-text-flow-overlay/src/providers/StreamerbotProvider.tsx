import React, { createContext, useContext } from 'react';
import type { AppConfig } from '../domain/types';
import { useStreamerBot } from '../hooks/useStreamerbot';

type StreamerBotProviderProps = {
    children: React.ReactNode;
    config: AppConfig;
    handleComment: (message: { text: string; emotes: any[] }) => void;
}

const StreamerBotContext = createContext<{ sendShoutoutCommand: (userName: string) => Promise<void> } | null>(null);

export const StreamerBotProvider: React.FC<StreamerBotProviderProps> = ({ children, config, handleComment }) => {
    const { sendShoutoutCommand } = useStreamerBot({
        host: config.host,
        port: config.port,
        endpoint: config.endpoint,
        password: config.password,
        onComment: handleComment,
        monitorInteractions: config.monitorInteractions,
    });

    return (
        <StreamerBotContext.Provider value={{ sendShoutoutCommand }}>
            {children}
        </StreamerBotContext.Provider>
    );
}

/**
 * StreamerBotContextを使用するためのカスタムフック
 * @returns StreamerBotContextの値
 */
export const useStreamerBotContext = () => {
    const context = useContext(StreamerBotContext);

    return context;
}
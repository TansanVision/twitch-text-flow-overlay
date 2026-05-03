import type { Command } from './types';

/**
 * コマンドの種類とルールを定義
 */
const rules = {
    color: ["white2", "niconicowhite", "red2", "truered", "pink2", "orange2", "passionorange", 
        "yellow2", "madyellow", "cyan2", "blue2", "marineblue", "purple2", "nobleviolet", 
        "black2", "white", "red", "orange", "blue", "green", "yellow", "pink", "cyan", "purple", "black"] as Command[],
    size: ["small", "medium", "big"] as Command[],
    verticalAlignment: ["ue", "naka", "shita"] as Command[],
};

/**
 * コメントの横位置を指定するコマンドの型定義
 * @param text - コメントのテキスト
 * @return コメントの横位置を指定するコマンドが含まれている場合はtrue、それ以外の場合はfalse
 */
export const extractTokens = (
    text: string,
): { 
    tokens: Record<string, Command | undefined>, 
    remainingText: string,
    removeLength: number
 } => {
    const parts = text.split(/\s+/);
    const tokens: Record<string, Command | undefined> = {
        color: undefined,
        size: undefined,
        verticalAlignment: undefined,
    };

    const allCommands = new Set<Command>([
        ...rules.color,
        ...rules.size,
        ...rules.verticalAlignment,
    ]);

    let index = 0;
    let commandCount = 0;

    while (index < parts.length && allCommands.has(parts[index] as Command)) {
        const command = parts[index] as Command;
        if (rules.color.includes(command)) {
            if (!!rules?.color) {
                tokens.color = command;
            }
            commandCount++;
        } else if (rules.size.includes(command)) {
            if (!!rules?.size) {
                tokens.size = command;
            }
            commandCount++;
        } else if (rules.verticalAlignment.includes(command)) {
            if (!!rules?.verticalAlignment) {
                tokens.verticalAlignment = command;
            }
            commandCount++;
        }

        index++;
    }

    const remainingText = parts.slice(commandCount).join(' ');

    let removedLength = 0;

    if (commandCount > 0) {
        removedLength = text.length - remainingText.length;
    }

    return {
        tokens,
        remainingText,
        removeLength: removedLength
     };
}

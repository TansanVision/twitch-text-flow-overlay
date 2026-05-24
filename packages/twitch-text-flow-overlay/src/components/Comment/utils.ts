import type { Command } from './types';

/**
 * コマンドの種類とルールを定義
 */
const rules = {
    effect: ["sakura", "snow", "maruta", "kamifubuki", "rain"] as Command[],
    color: ["white2", "niconicowhite", "red2", "truered", "pink2", "orange2", "passionorange", 
        "yellow2", "madyellow", "cyan2", "blue2", "marineblue", "purple2", "nobleviolet", 
        "black2", "white", "red", "orange", "blue", "green", "yellow", "pink", "cyan", "purple", "black", "elementalgreen", "green2"] as Command[],
    size: ["small", "medium", "big"] as Command[],
    alignment: ["ue", "naka", "shita", "migi", "hidari", "migiue", "migishita", "hidariue", "hidarishita"] as Command[],
};

/**
 * コメント先頭のコマンドを抽出し、抽出結果と残りのテキストを返す
 * @param text - コメントのテキスト
 * @returns 抽出したコマンドのトークン、コマンドを除いた残りのテキスト、除去した文字数
 */
export const extractTokens = (
    text: string,
): { 
    tokens: Record<string, Command | undefined>, 
    remainingText: string,
    removeLength: number
 } => {
    // 先頭の空白を許容するなら、解析前に先頭の空白をスキップする
    const parts = text.trimStart().split(/\s+/);
    const tokens: Record<string, Command | undefined> = {
        color: undefined,
        size: undefined,
        alignment: undefined,
        effect: undefined,
    };

    const allCommands = new Set<Command>([
        ...rules.color,
        ...rules.size,
        ...rules.alignment,
        ...rules.effect,
    ]);

    let index = 0;
    let commandCount = 0;

    while (index < parts.length && allCommands.has(parts[index] as Command)) {
        const command = parts[index] as Command;
        if (rules.color.includes(command)) {
            if (!tokens?.color) {
                tokens.color = command;
            }
            commandCount++;
        } else if (rules.size.includes(command)) {
            if (!tokens?.size) {
                tokens.size = command;
            }
            commandCount++;
        } else if (rules.alignment.includes(command)) {
            if (!tokens?.alignment) {
                tokens.alignment = command;
            }
            commandCount++;
        } else if (rules.effect.includes(command)) {
            if (!tokens?.effect) {
                tokens.effect = command;
            }
            commandCount++;
        }

        index++;
    }

    let scanIndex = 0;

    for (let i = 0; i < commandCount; i++) {
        // 先頭空白をスキップして現在のコマンド開始位置まで進める
         while (scanIndex < text.length && /\s/.test(text[scanIndex])) {
             scanIndex++;
         }

         // コマンド本体をスキャンして次の区切り位置まで進める
         while (scanIndex < text.length && !/\s/.test(text[scanIndex])) {
             scanIndex++;
         }

        // 最後のコマンドに続く空白も除去対象に含め、残りテキストの開始位置に揃える
        while (scanIndex < text.length && /\s/.test(text[scanIndex])) {
            scanIndex++;
        }
    }

    return {
        tokens,
        remainingText: text.slice(scanIndex),
        removeLength: scanIndex,
     };
}

import { v4 as uuidv4 } from 'uuid';
import type { Emote, ExternalEmoteMap, CustomStampMap, Token, Comment } from '../domain/types';
import { isCommandString, isSizeCommandString, isAlignmentCommandString, isColorCommandString, isEffectCommandString } from "../domain/types";
import { getFlowStyle } from '../components/Comment/Flow';
import { Sakura } from '../components/Comment/Sakura';
import { Balloons } from '../components/Comment/Balloons';
import { Snow } from '../components/Comment/Snow';
import { Kamifubuki } from '../components/Comment/Kamifubuki';
import { BouRamen } from '../components/Comment/BouRamen';
import { Chikuwa } from '../components/Comment/Chikuwa';
import { Flow } from '../components/Comment/Flow';
import { Maruta } from '../components/Comment/Maruta';
import { Rain } from '../components/Comment/Rain';


/**
 * 文字列とキーワードのリストを受け取り 、文字列をキーワードで分割してトークン化する関数。
 * キーワードは大文字小文字を区別せずにマッチされ、トークンにはキーワードであるかどうかのフラグが付与される。
 * キーワードは長いものから優先的にマッチされるようにソートされる。
 * @param text 分割対象の文字列
 * @param keywords　キーワードのリスト
 * @returns トークンの配列。各トークンはテキスト、キーワードフラグ、タイプを含むオブジェクト。
 */
const tokenize = (text: string, keywords: string[]) : Token[] => {
    if (!keywords || keywords.length === 0) {
        return [{
            text,
            isKeyword: false,
            type: 'text',
            subType: 'none',
            dataUri: undefined,
            imageUrl: undefined
        }];
    }

    const normalizedKeywords = 
        keywords.filter(Boolean)
                .sort((a, b) => b.length - a.length);

    const escapedKeywords = 
        normalizedKeywords.map((keyword) => keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));

    const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'g');

    const keywordsSet = new Set(normalizedKeywords);

    const tokens =
        text.split(regex)
            .filter(token => token.trim() !== '');

    return tokens.map(token => {
        const isKeyword = keywordsSet.has(token);

        return {
            text: token,
            isKeyword,
            type: isKeyword ? 'keyword' : 'text',
            subType: 'none',
            dataUri: undefined,
            imageUrl: undefined
        };
    });
}

/**
 * フェーズ1: コメント先頭のコマンドを抽出し、抽出結果と残りのテキストを返す
 * @param text - コメントのテキスト
 * @returns 抽出したコマンドのトークン、コマンドを除いた残りのテキスト、除去した文字数
 */
const phase1 = (
    text: string,
): { 
    tokens: Record<string, string | undefined>, 
    remainingText: string,
    removeLength: number
 } => {
    // 先頭の空白を許容するなら、解析前に先頭の空白をスキップする
    const parts = text.trimStart().split(/\s+/);
    const tokens: Record<string, string | undefined> = {
        color: undefined,
        size: undefined,
        alignment: undefined,
        effect: undefined,
    };

    let index = 0;
    let commandCount = 0;

    while (index < parts.length && isCommandString(parts[index])) {
        const command = parts[index];
        if (isColorCommandString(command)) {
            if (!tokens?.color) {
                tokens.color = command;
            }
            commandCount++;
        } else if (isSizeCommandString(command)) {
            if (!tokens?.size) {
                tokens.size = command;
            }
            commandCount++;
        } else if (isAlignmentCommandString(command)) {
            if (!tokens?.alignment) {
                tokens.alignment = command;
            }
            commandCount++;
        } else if (isEffectCommandString(command)) {
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

/**
 * フェーズ2: 改行文字列で分割する。
 * @param text 分割対象の文字列
 * @return 改行で分割された文字列の配列
 */
const phase2 = (text: string) : string[] => {
    const breaklineCommand = "U+2003";
    return text.split(breaklineCommand);
}

/**
 * フェーズ3: 各キーワードに対処する
 * @param text 分割対象の文字列
 * @param twitchEmotes twitchのエモートのリスト
 * @param externalEmotes 外部エモートのマップ
 * @param customStamps　カスタムスタンプのマップ
 * @returns トークンの配列。各トークンはテキスト、キーワードフラグ、タイプを含むオブジェクト。
 */
const phase3 = (text: string, 
    twitchEmotes: Emote[], 
    externalEmotes: ExternalEmoteMap, 
    customStamps: CustomStampMap) : Token[] => {
    const keywords = [
        ...twitchEmotes.filter(emote => !emote.imageUrl.includes("twemoji")).map(emote => emote.name),
        ...Array.from(externalEmotes.values()).map(emote => emote.name),
        ...Array.from(customStamps.keys()),
    ];

    const tokens = tokenize(text, keywords);

    return tokens.map(token => {
        if (token.isKeyword && token.type === 'keyword') {
            const stampData = customStamps.get(token.text);
            if (stampData) {
                return {
                    ...token,
                    subType: 'custom',
                    dataUri: stampData.dataUri,
                    imageUrl: undefined,
                };
            } else if (externalEmotes.has(token.text)) {
                return {
                    ...token,
                    subType: 'external',
                    dataUri: undefined,
                    imageUrl: externalEmotes.get(token.text)?.url,
                };
            } else if (twitchEmotes.some(emote => emote.name === token.text)) {
                const twitchEmote = twitchEmotes.find(emote => emote.name === token.text);
                return {
                    ...token,
                    subType: twitchEmote?.imageUrl.includes("twemoji") ? 'none' : 'twitch',
                    dataUri: undefined,
                    imageUrl: twitchEmote?.imageUrl,
                };
            }
        }

        return token;
    });
}

/**
 * トークンからエフェクトReactノードに変換する
 * @param effect コマンドで指定されたエフェクトの種類
 * @returns エフェクトに対応するReactノード
 */
const getEffectNode = (effect: string): React.ReactNode => {
    switch (effect) {
        case "sakura":
            return <Sakura />;
        case "balloons":
            return <Balloons />;
        case "snow":
            return <Snow />;
        case "kamifubuki":
            return <Kamifubuki />;
        case "marutai":
            return <BouRamen />;
        case "chikuwa":
            return <Chikuwa />;
        case "maruta":
            return <Maruta />;
        case "rain":
            return <Rain />;
        default:
            return null;
    }
};

/**
 * Twitchのメッセージテキストをエモートでレンダリングする関数
 * @param text - メッセージテキスト
 * @param twitchEmotes - Twitchのエモートデータ
 * @param externalEmotes - 外部エモートのマップ
 * @param customStamps - カスタムスタンプのマップ
 * @returns レンダリングされたReactノードの配列
 */
export const getNodes = (text: string, 
    twitchEmotes: Emote[], 
    externalEmotes: ExternalEmoteMap, 
    customStamps: CustomStampMap) : Comment[] => {

    if (!text) {
        return [];
    }

    let nodes: Comment[] = [];

    // フェーズ0: 先頭コマンドを先に抜き出す
    const { tokens: headTokens, remainingText } = phase1(text);

    if (headTokens.effect) {
        const effectNode = getEffectNode(headTokens.effect);
        if (effectNode) {
            nodes.push({ id: `effect-${uuidv4()}`, node: effectNode });
        }
    }

    if (remainingText.trim() === "") {
        // コマンドだけのコメントの場合、コマンドに対応するエフェクトを返して終了する
        return nodes;
    }

    // フェーズ1: 改行文字列で分割する。
    const textWithoutBreaklines = phase2(remainingText);

    // フェーズ2: 各キーワードに対処する
    const breaklinesTexts = textWithoutBreaklines.map(line => phase3(line, twitchEmotes, externalEmotes, customStamps));

    // 行でまとめる
    const lineNodes = breaklinesTexts.map((tokens, index) => {
        const nodes = tokens.map((token, tokenIndex) => {
            if (token.isKeyword) {
                if (token.subType === 'custom' ) {
                    return <img key={`token-${index}-${tokenIndex}`} src={token.dataUri} alt={token.text} />;
                } else if (token.subType === 'twitch' || token.subType === 'external') {
                    return <img key={`token-${index}-${tokenIndex}`} src={token.imageUrl} alt={token.text} />;
                }
            }

            return <span key={`token-${index}-${tokenIndex}`}>{token.text}</span>;
        });

       return <div 
            key={`line-${index}`} 
            style={{
                display: "flex",
                flexDirection: "row",
                lineHeight: "1em",
                gap: 0,
                margin: 0,
                padding: 0,
            }}>
            {nodes}
        </div>;
    });

    // 改行のためのdivでまとめる
    const flowNode = <div 
        style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 0, 
            margin: 0 }}>
        {lineNodes}
    </div>;

    // 文字列系トークン
    let flowClassName = getFlowStyle([
            headTokens.size || "default",
            headTokens.color || "default",
            headTokens.alignment || "default",
        ]);

    nodes.push({ id: `flow-${uuidv4()}`, node: <Flow className={flowClassName}>
        {flowNode}
    </Flow> });

    return nodes;
}

import { useEffect, useState, useMemo, useCallback} from 'react';
import { CommentServiceContainer } from './components/CommentService/CommentServiceContainer';
import type { Comment } from './components/Comment/types';
import { v4 as uuid } from 'uuid';
import { useStreamerBot } from './hooks/useStreamerbot';
import { useTwitchEmotes } from './hooks/useTwitchEmotes';
import type { Message } from './hooks/useStreamerbot';
import type { AppConfig } from './types';
import { isCommand } from './components/Comment/types';

const defaultConfig = {
  host: "127.0.0.1",
  port: 8080,
  endpoint: "/",
  password: undefined,
  customStamps: [],
};

/**
 * アプリケーションの設定を取得する関数
 * @returns アプリケーションの設定オブジェクト
 */
function getConfig(): AppConfig {
  const configElement = document.getElementById('config');

  if (configElement) {
    try {
      const rawConfigText = configElement.textContent ?? '';
      const configText = rawConfigText.trim() === '' ? '{}' : rawConfigText;
      const parsedConfig: unknown = JSON.parse(configText);
      const config = parsedConfig && typeof parsedConfig === 'object'
        ? (parsedConfig as Record<string, unknown>)
        : {};
      const port = Number(config.port);

      return {
        host: typeof config.host === 'string' && config.host !== '' 
          ? config.host 
          : defaultConfig.host,
        port: Number.isNaN(port) || !Number.isFinite(port) || port <= 0 || port > 65535 
          ? defaultConfig.port 
          : port,
        endpoint: typeof config.endpoint === 'string' && config.endpoint !== '' 
          ? config.endpoint 
          : defaultConfig.endpoint,
        password: typeof config.password === 'string' && config.password !== ''
          ? config.password
          : defaultConfig.password,
        customStamps: Array.isArray(config.customStamps)
           ? config.customStamps.reduce<Array<{ commandName: string; dataUri: string; effectType: 'default' }>>(
               (validStamps, stamp, index) => {
                 if (!stamp || typeof stamp !== 'object') {
                   console.warn(`
                     無効なカスタムスタンプ at index ${index}: オブジェクトである必要があります。スキップします。
                   `);
                   return validStamps;
                 }
                 const candidate = stamp as { commandName?: unknown; dataUri?: unknown; effectType?: unknown };
                 if (typeof candidate.commandName !== 'string' || candidate.commandName === '') {
                    console.warn(
                      `カスタムスタンプのコマンド名が無効です at index ${index}: "commandName" 空文字列であってはならず、かつ必須です。スキップします。`
                    );
                   return validStamps;
                 }
                 if (/\s/.test(candidate.commandName)) {
                   console.warn(
                    `無効なカスタムスタンプのコマンド名 "${candidate.commandName}" at index ${index}: コマンド名に空白を含めることはできません。スキップします。`
                   );
                   return validStamps;
                 }
                 // 既存のコマンドと重複するコマンド名は許容しない（後勝ちさせない）
                 if (isCommand(candidate.commandName)) {
                    console.warn(
                      `既存のコマンドと重複するコマンド名 "${candidate.commandName}" at index ${index}: 既存のコマンドと同じ名前のカスタムスタンプは許容されません。スキップします。`
                    );
                   return validStamps;
                 }
                 if (typeof candidate.dataUri !== 'string' || candidate.dataUri === '') {
                   console.warn(
                     `無効なカスタムスタンプ "${candidate.commandName}" at index ${index}: "dataUri" は空文字列であってはならず、かつ必須です。スキップします。`
                   );
                   return validStamps;
                 }
                 if (!/^data:image\/(png|jpeg|gif);base64,/.test(candidate.dataUri)) {
                   console.warn(
                     `無効なカスタムスタンプ "${candidate.commandName}" at index ${index}: "dataUri" は有効な png/jpeg/gif のデータ URI である必要があります。スキップします。`
                   );
                   return validStamps;
                 }
                 if (typeof candidate.effectType === 'string' && candidate.effectType !== 'default') {
                   console.warn(
                    `無効なカスタムスタンプ "${candidate.commandName}" at index ${index}: "effectType" は現状 "default" のみ対応しています。指定された値 "${candidate.effectType}" はサポートされていないため、"default" として扱います。`
                   );
                 }
                 validStamps.push({
                   commandName: candidate.commandName,
                   dataUri: candidate.dataUri,
                   effectType: 'default', // 現状はdefaultのみ対応。未対応のeffectType指定時は警告してdefaultにフォールバックする。
                 });
                 return validStamps;
               },
               []
             )
           : defaultConfig.customStamps,
      };
    } catch (error) {
      console.error('Failed to parse config JSON:', error);
      return defaultConfig;
    }
  } else {
    return defaultConfig;
  }
}

/**
 * アプリケーションのエントリーポイント
 * @returns JSX.Element
 */
function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const config = useMemo(() => getConfig(), []);

  const { getNodesAndCommands } = useTwitchEmotes(config.customStamps);

  const handleComment = useCallback((message: Message) => {
    addComment(message);
  }, []);

  useStreamerBot({
    host: config.host,
    port: config.port,
    endpoint: config.endpoint,
    password: config.password,
    onComment: handleComment,
  });

  useEffect(() => {
    setComments([]);
  }, []);

  const addComment = useCallback((message: Message) => {
    if (message.text.trim() === '') {
      return;
    }

    const { nodes, commands } = getNodesAndCommands(message.text, message.emotes);

    const comment: Comment = {
      id: uuid(),
      node: nodes,
      state: 'active',
      commands: commands,
    };

    setComments((prevComments) => {
      if (prevComments.findIndex(c => c.state === 'inactive') === -1) {
        return [...prevComments, comment];
      }

      const index = prevComments.findIndex(c => c.state === 'inactive');
      const updatedComments = [...prevComments];
      updatedComments[index] = comment;
      return updatedComments;
    });
  }, [getNodesAndCommands]);

  const clickToAddTestComment = useCallback(() => {
    // obs上ではクリックできない = テスト用のコメントを追加
    addComment({ 
      text: "ue shita yellow red big Kappa test🍰", 
      emotes: [{
          id: "25",
          name: "Kappa",
          startIndex: 24,
          endIndex: 28,
      }] });

      addComment({ 
        text: "white2 test🍰", 
        emotes: [] });

      addComment({ 
        text: "yellow naka test🍰", 
        emotes: [] });

      addComment({ 
        text: "small blue shita test🍰", 
        emotes: [] });

      addComment({ 
        text: "small purple migi test🍰", 
        emotes: [] });

      addComment({ 
        text: "purple2 migiue test🍰", 
        emotes: [] });

      addComment({ 
        text: "purple2 migishita test🍰", 
        emotes: [] });

      addComment({ 
        text: "small green2 hidari test🍰", 
        emotes: [] });

      addComment({ 
        text: "green2 hidariue test🍰", 
        emotes: [] });

      addComment({ 
        text: "green2 hidarishita test🍰", 
        emotes: [] });
  }, [addComment]);

  const releaseComment = useCallback((id: string) => {
    setComments((prevComments) => {
      const index = prevComments.findIndex(c => c.id === id);
      const updatedComments = [...prevComments];
      updatedComments[index].state = 'inactive';
      return updatedComments;
    });
  }, []);

  return (
    <div className='overlay' onClick={clickToAddTestComment}>
      <CommentServiceContainer 
        comments={comments}
        onRelease={releaseComment}
      />
    </div>
  )
}

export default App

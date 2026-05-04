import { useEffect, useState, useMemo, useCallback} from 'react';
import { CommentServiceContainer } from './components/CommentService/CommentServiceContainer';
import type { Comment } from './components/Comment/types';
import { v4 as uuid } from 'uuid';
import { useStreamerBot } from './hooks/useStreamerbot';
import { useTwitchEmotes } from './hooks/useTwitchEmotes';
import type { Message } from './hooks/useStreamerbot';
import type { AppConfig } from './types';

const defaultConfig = {
  host: "127.0.0.1",
  port: 8080,
  endpoint: "/",
  password: undefined,
  customStamps: [],
};

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
          ? config.customStamps.map((stamp) => ({
              commandName: typeof stamp.commandName === 'string' ? stamp.commandName : '',
              dataUri: typeof stamp.dataUri === 'string' ? stamp.dataUri : '',
              effectType: stamp.effectType === 'default' ? 'default' : 'default',
            }))
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

import { useEffect, useState, useMemo, useCallback} from 'react';
import { CommentServiceContainer } from './components/CommentService/CommentServiceContainer';
import type { Comment } from './components/Comment/types';
import { v4 as uuid } from 'uuid';
import { useStreamerBot } from './hooks/useStreamerbot';
import { useTwitchEmotes } from './hooks/useTwitchEmotes';
import type { Message } from './hooks/useStreamerbot';

function getConfig() {
  const params = new URLSearchParams(window.location.search);

  return {
    host: params.get('host') || '127.0.0.1',
    port: Number(params.get('port')) || 8080,
    endpoint: params.get('endpoint') || '/',
    password: params.get('password') || undefined,
  }
}

/**
 * アプリケーションのエントリーポイント
 * @returns JSX.Element
 */
function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const config = useMemo(() => getConfig(), [window.location.search]);

  const { getNodesAndCommands } = useTwitchEmotes();

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
  }, [comments, getNodesAndCommands]);

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

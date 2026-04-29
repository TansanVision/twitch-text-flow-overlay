import { useEffect, useState, useMemo, useCallback} from 'react';
import { CommentServiceContainer } from './components/CommentService/CommentServiceContainer';
import type { Comment } from './components/Comment/types';
import { v4 as uuid } from 'uuid';
import { useStreamerBot } from './hooks/useStreamerbot';
import { useTwitchEmotes } from './hooks/useTwitchEmotes';
import type { Message } from './hooks/useStreamerbot';
import { UniqueCommands, RemoveCommands } from './components/Comment/types';
import type { Command } from "./components/Comment/types";

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

  const { getNodes } = useTwitchEmotes();

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

    const comment: Comment = {
      id: uuid(),
      node: getNodes(RemoveCommands(message.text), message.emotes),
      state: 'active',
      commands: UniqueCommands(
        message.text.split(' ').filter(word => word.startsWith("ue") || word.startsWith("naka") || word.startsWith("shita") || word.startsWith("small") || word.startsWith("medium") || word.startsWith("big") || ["red", "pink", "orange", "yellow", "green", "cyan", "blue", "purple", "black", "white2", "niconicowhite", "red2", "truered", "pink2", "orange2", "passionorange", "yellow2", "mellowyellow", "cyan2", "blue2", "marineblue", "black2"].includes(word) ? word : "").map(cmd => cmd.toLowerCase()) as Command[]
      )
    };

    if (comments.findIndex(c => c.state === 'inactive') !== -1) {
      setComments((prevComments) => {
        const index = prevComments.findIndex(c => c.state === 'inactive');
        const updatedComments = [...prevComments];
        updatedComments[index] = comment;
        return updatedComments;
      });
    } else {
      setComments((prevComments) => [...prevComments, comment]);
    }
  }, [comments, getNodes]);

  const releaseComment = useCallback((id: string) => {
    setComments((prevComments) => {
      const index = prevComments.findIndex(c => c.id === id);
      const updatedComments = [...prevComments];
      updatedComments[index].state = 'inactive';
      return updatedComments;
    });
  }, []);

  return (
    <div className='overlay' onClick={() => addComment({ text: "test🍰", emotes: [] })}>
      <CommentServiceContainer 
        comments={comments}
        onRelease={releaseComment}
      />
    </div>
  )
}

export default App

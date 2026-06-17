import { useEffect, useState, useMemo, useCallback} from 'react';
import { CommentServiceContainer } from './components/CommentService/CommentServiceContainer';
import { useStreamerBot } from './hooks/useStreamerbot';
import { useTwitchEmotes } from './hooks/useTwitchEmotes';
import type { Comment, Message, AppConfig, BuiltInEffects } from './domain/types';
import { isCommand } from './domain/types';
import { builtInEffectsDefault } from './domain/constant';

const defaultConfig: AppConfig = {
  host: "127.0.0.1",
  port: 8080,
  endpoint: "/",
  password: undefined,
  customStamps: [],
  monitorInteractions: false,
  builtInEffects: builtInEffectsDefault
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
      const rawBuiltInEffects =
        config.builtInEffects && typeof config.builtInEffects === 'object'
          ? (config.builtInEffects as Record<string, unknown>)
          : {};
       const builtInEffects: BuiltInEffects = {
         sakura: typeof rawBuiltInEffects.sakura === 'boolean' ? rawBuiltInEffects.sakura : defaultConfig.builtInEffects.sakura,
         snow: typeof rawBuiltInEffects.snow === 'boolean' ? rawBuiltInEffects.snow : defaultConfig.builtInEffects.snow,
         balloons: typeof rawBuiltInEffects.balloons === 'boolean' ? rawBuiltInEffects.balloons : defaultConfig.builtInEffects.balloons,
         marutai: typeof rawBuiltInEffects.marutai === 'boolean' ? rawBuiltInEffects.marutai : defaultConfig.builtInEffects.marutai,
         maruta: typeof rawBuiltInEffects.maruta === 'boolean' ? rawBuiltInEffects.maruta : defaultConfig.builtInEffects.maruta,
         chikuwa: typeof rawBuiltInEffects.chikuwa === 'boolean' ? rawBuiltInEffects.chikuwa : defaultConfig.builtInEffects.chikuwa,
         kamifubuki: typeof rawBuiltInEffects.kamifubuki === 'boolean' ? rawBuiltInEffects.kamifubuki : defaultConfig.builtInEffects.kamifubuki,
         rain: typeof rawBuiltInEffects.rain === 'boolean' ? rawBuiltInEffects.rain : defaultConfig.builtInEffects.rain,
       };

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
                    console.warn(`無効なカスタムスタンプ at index ${index}: オブジェクトである必要があります。スキップします。`);
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
                 if (validStamps.some((validStamp) => validStamp.commandName === candidate.commandName)) {
                    console.warn(
                      `重複するカスタムスタンプのコマンド名 "${candidate.commandName}" at index ${index}: customStamps 内で同じ "commandName" は複数定義できません。先に定義された設定を優先し、この項目はスキップします。`
                    );
                    return validStamps;
                  }
                 if (typeof candidate.dataUri !== 'string' || candidate.dataUri === '') {
                  console.warn(
                    `無効なカスタムスタンプ "${candidate.commandName}" at index ${index}: "dataUri" は空文字列であってはならず、かつ必須です。スキップします。`
                  );
                  return validStamps;
                 }
                 if (!/^data:image\/(bmp|png|jpeg|gif);base64,/.test(candidate.dataUri)) {
                  console.warn(
                    `無効なカスタムスタンプ "${candidate.commandName}" at index ${index}: "dataUri" は有効な bmp/png/jpeg/gif のデータ URI である必要があります。スキップします。`
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
         monitorInteractions: typeof config.monitorInteractions === 'boolean' ? config.monitorInteractions : defaultConfig.monitorInteractions,
         builtInEffects: builtInEffects,
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

  const { getNodes } = useTwitchEmotes(config.customStamps, config.builtInEffects);

  const handleComment = useCallback((message: Message) => {
    addComment(message);
  }, []);

  useStreamerBot({
    host: config.host,
    port: config.port,
    endpoint: config.endpoint,
    password: config.password,
    onComment: handleComment,
    monitorInteractions: config.monitorInteractions,
  });

  useEffect(() => {
    setComments([]);
  }, []);

  const addComment = useCallback((message: Message) => {
    if (message.text.trim() === '') {
      return;
    }

    const nodes = getNodes(message.text, message.emotes);

    setComments((prevComments) => {
      return [...prevComments, ...nodes];
    });
  }, [getNodes]);

  const releaseComment = useCallback((id: string) => {
    setComments((prevComments) => {
      const index = prevComments.findIndex(c => c.id === id);
      if (index === -1) {
        return prevComments;
      }
      const updatedComments = [...prevComments];
      updatedComments.splice(index, 1);
      return updatedComments;
    });
  }, []);

  return (
    <div className='overlay'>
      <CommentServiceContainer 
        comments={comments}
        onRelease={releaseComment}
      />
    </div>
  )
}

export default App

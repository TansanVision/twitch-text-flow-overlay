# twitch-text-flow-overlay

Streamer.botを利用したオーバーレイです。
基本的な機能はチャットで書かれたコメントがが右から左へ流れます。(ただしエモートいくつかには対応できていません。)

## 設定方法

- OBSの設定
  - ブラウザソースにtwitch-text-flow-overlay.htmlを追加してください。
  - ツール > WebSocketサーバー > \[WebSocketサーバーの設定を有効にする\]にチェックを入れ、「認証を有効にする」にもチェックを入れます。
    ![OBS側の設定](images/obs側の設定.png)
- Streamer.bot側の設定
  - Twitchアカウントを連携してください。(結構な権限を付与するため、ここで同意できない場合はStreamer.botやこのオーバーレイをしないでください。)
  - Streamer.botとOBSを連携する設定を行います。
    - Stream App > OBS Studioをクリックします
    - Nameに任意の名前を入力します。
    - Passwordを入力します。これはOBSのサーバーパスワードの部分です。OBSの接続情報を表示するボタンを押すことで確認することができます。
    - 「Auto connect on Startup」と「Reconnect on disconnect」にチェックを入れます。
    - 「OK」で適用します。
      ![streamerbotとOBS連携](images/streamberbotとobs連携接続設定.png)
  - Streamer.botとtwitch-text-flow-overlayを連携
    - Servers/ClientsタブのWebSocket ServerをOnにしてください。
    - AddressやPort、Endpointを変更している方はtwitch-text-flow-overlay.htmlに変更が必要です。(デフォルト値はhost = 127.0.0.1,port = 8080,endpoint = /)(Streamer.botのWebSocketのpasswordを設定した場合はこちらにも設定してください。passwordは最初は記述されていません。)
       - ※ password は秘密情報です。twitch-text-flow-overlay.html など配布・共有・公開され得るファイルに記述する場合は、リポジトリへコミットしないでください。また、第三者が閲覧できる場所には置かないでください。
    - twitch-text-flow-overlay.html
      ![config値の変更箇所](images/config値の変更箇所.png)

## リンク
- [Streamer.bot](https://streamer.bot/)

## 動作確認環境
  - Windows 11 Home (25H2)
  - OBS Studio 32.1.2(64 bit)
  - Streamer.bot(v1.0.4)

## コマンド一覧

基本的にはニコ動のコマンドに近しい動作です。

```
[コマンド] [コメント]
```
でその効果が得られます。


例えば
```
shita small これはコメントです。
```


- 文字サイズ

|コマンド|効果|
|small|小さいサイズのコメント|
|big|通常より大きいサイズのコメント|
|midium|通常サイズのコメント|

- 文字位置

|コマンド|効果|
|---|---|
|ue|画面上部に配置|
|shita|画面下部に配置|
|naka|画面中央に配置|
|migi|画面中央右に配置|
|migiue|画面右上に配置|
|migishita|画面右下に配置|
|hidari|画面中央左に配置|
|hidariue|画面左上に配置|
|hidarishita|画面左下に配置|

- 文字色

|コマンド|効果|
|---|---|
|white|#ffffff|
|red|#ff0000|
|pink|#ff8080|
|orange|#ff0000|
|yellow|#ffff00|
|green|#00ff00|
|cyan|#00ffff|
|blue|#0000ff|
|purple|#c000ff|
|black|#000000|
|white2 or niconicowhite|#cccc99|
|red2 or truered|#cc00ff|
|pink2|#ff33cc|
|orange2 or passionorange|#ff6600|
|yellow2 or madyellow|#999900|
|green2 or elementalgreen|#00cc66|
|cyan2|#00cccc|
|blue2 or marineblue|#3399ff|
|purple2 or nobleviolet|#6633cc|
|black2|#666666|

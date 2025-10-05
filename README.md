![public status](https://img.shields.io/badge/Public%20status-public-green.svg)
#  ATP - Audio Transmission Protocol v1

ATP (Audio Transmission Protocol) は、軽量・低遅延で音声を配信できる独自プロトコルです。  
ラジオのようにリアルタイムで音声を配信でき、ブラウザからも簡単に再生可能です。

---

## 特徴

- 独自スキーム `atp://host:port/`  
- Node.js で簡単にサーバー構築可能  
- ファイル配信・ライブマイク配信に対応  
- クライアントはCDN経由で簡単に利用可能  
- 低遅延WebSocketベースでリアルタイム配信  

---

## クライアントCDN

最新クライアントスクリプトは jsDelivr から利用可能：

```html
<script src="https://cdn.jsdelivr.net/gh/Wataamee777/ATP-V1@main/ATP-client/atp-client.js"></script>
````

使用例：

```html
<script>
  ATP.connect("atp://localhost:8080");
</script>
```

---

## サーバー

### 1. ファイル配信版

```bash
npm install ws
node atp-server.js radio.mp3
```

* 指定したMP3/WAVファイルをクライアントに配信

### 2. ライブマイク配信版

```bash
npm install ws mic
node atp-server-live.js
```

* マイク入力をリアルタイムで配信

---

## 使い方（簡単サンプル）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ATP Player</title>
</head>
<body>
  <h2>ATP v1 Radio</h2>

  <script src="https://cdn.jsdelivr.net/gh/Wataamee777/ATP-V1@main/ATP-client/atp-client.js"></script>
  <script>
    ATP.connect("atp://localhost:8080");
  </script>
</body>
</html>
```

---

## 注意点

* 現在は TLS 非対応 (`atps://` は未実装)
* Linux / macOS 推奨（マイクライブ配信の場合）
* Windows でマイク配信する場合は SoX などの追加設定が必要
* 複数リスナー対応可だが、サーバーの負荷に注意

---

Created by [わたあめえ](https://wataamee777.f5.si)

---

マストドンの公開ハッシュタグタイムラインの画面にシェアボタンを置きます。

トゥートしたからと言って載るとは限りません（そのインスタンスに自分をフォローしているユーザがいるかどうか）。

[Tampermonkey](http://tampermonkey.net/)で使用することを前提としています。

他のインスタンスの公開ハッシュタグタイムラインを対象にする場合は @match を適宜追加・変更ください。

## 以下の情報が必要です。

- YOUR_MASTODON_DOMAIN
- ACCESS_TOKEN

## ACCESS_TOKEN の取得方法

今は簡単に出来るようです。

ユーザ設定 > 開発 > 新規アプリ

で「アプリ名」を適当に入れます（「アプリのウェブサイト」は空でOK）。

新規登録されたアプリのアプリ名を叩き、表示された「アクセストークン」をスクリプトへコピペしてください。
---
layout: post
title: "YOLOで機械学習~物体検知とロボカップでの応用~"
date: 2025-2-24 10:00:00 +0900
tag: [robot, rotarymars's article, machine learning]
thumbnail-img: "/assets/images/2025-1-26-thumbnail.jpg"
author: "rotarymars"
---
こんにちは。rotarymarsです。

久しぶりにブログを書いている気分です。

今回は前回出した機械学習とは少し違う、いわゆる「物体検出」と呼ばれるものの類を書いていこうと思います。

# 今回目指すもの
- 今まで見たことのない画像から、「顔」を検知し、四角で囲む

これができるようにしていきたいと思います。

# 準備
今回は以下の条件が揃っている前提で話をしていきます。
- python (今回は3.11系で作っています。もし心配であればpyenvやasdfなどでバージョンを固定してください。)
- docker（ラベリングのソフトを立ち上げるために使用します。）
- direnv（もしくはvirtualenvなどで仮想環境を立ち上げます。）

# 手順
まず作業ディレクトリを作成しましょう。
```bash
mkdir ball_detection && cd $_
```
次に、以下の内容の.envrcファイルを作成します。
```bash
layout python
```
これで、必要に応じて以下のコマンドを実行します。
```bash
direnv allow
```
ここで仮想環境が出来上がっているはずです。確認しましょう。
```bash
which python
# /home/rotarymars/projects/***/ball_detection/.direnv/python-3.12.6/bin/python
```
次に、必要になるパッケージをインストールします。
以下のrequirements.txtを作成しましょう。
```
ultralytics==8.3.32
```
そして、次のように実行します。
```bash
pip install -r requirements.txt
```
しばらく待つと、インストールが完了するはずです。

次に、ラベリングに必要なソフトを立ち上げるための準備をしましょう。

label studioというものを使ってラベリングしていきます。

現在のディレクトリの下にlabel_studioというディレクトリを作成します。
```bash
mkdir label_studio && pushd $_
```
次のようなdocker-compose.ymlを作成します。
```yaml
version: "3.9"

services:
  label_studio:
    image: heartexlabs/label-studio:latest
    volumes:
      - label-studio-data:/label-studio/data
    ports:
      - 8080:8080

volumes:
  label-studio-data:
```
作成後、そのコンテナを立ち上げます。
```bash
docker compose up -d
```
初回時はコンテナのダウンロードにより起動に時間がかかりますが、2回目以降はより早く起動するはずです。

もしコンテナを止めたいことがあれば、
```bash
docker compose down
```
とします。

それでは、一つ前のディレクトリに進みます。
```bash
popd
```
次に、[localhost:8080](localhost:8080)にアクセスします。

次のような画面が出るはずです。
![login](/assets/images/2025-02-24-label_studio_login_screen.png)
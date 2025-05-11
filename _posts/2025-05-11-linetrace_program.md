---
layout: post
title: "ライントレースのプログラム"
date: 2025-5-11 10:00:00 +0900
tag: [robot, rotarymars's article, line-trace, program]
thumbnail-img: "/assets/images/null.png"
author: "rotarymars"
---
こんにちは。rotarymarsです。

最初は余談になってしまいますが、ブログの更新頻度を改めて決定したのでお伝えしたいと思います。

| ALPAKA | その月を3で割ったあまりが0もしくは1 |
| K10-K10 | その月を3で割ったあまりが0もしくは2 |
| rotarymars | その月を3で割ったあまりが1もしくは2 |

これらの月に1度は記事を更新するようにしていきたいと思いますので、よろしくおねがいします。

# 今回の記事の内容について
今回は、私達が現在検討しているライントレースプログラムについて書いていきたいと思っています。

プログラムは、[この時点](https://github.com/techno-robocup/robocup2025_raspberrypi_program/tree/2aa6a78f848aa399d7de8e9522e22457549cda2c)でのものについて解説していきたいと思いますので、よろしくおねがいします。

# まず何を使ってライントレースをするのか
私達は、昨年に引き続き、カメラを用いたライントレースを実行したいと考えています。

具体的には、Raspberrypiに[このような](https://www.marutsu.co.jp/pc/i/2582866/?srsltid=AfmBOopbmXQJaQxBT3iPoE_9YWJHDGGlkC7d1VmHUMrUX68OTDen-XPl)カメラを接続し、画像を取得してライントレースをしていきたいと考えています。

まだ機体が出来上がっていないので実際にテスト走行はできていないということだけお伝えしておきたいと思います。

# 実際のプログラム
かなり長々としたプログラムになってしまったので段階的に貼り付けていきたいと思います。また、とてもきたないので、読みにくいかもしれません(いつかクラスにしたいと思いながら何もしていません)。



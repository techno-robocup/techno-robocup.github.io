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

なお、今回は特にライントレースに関係しているmodules/settings.pyを見ていきます。

```python
from libcamera import controls
from picamera2 import MappedArray
import cv2
import time
import numpy as np
import threading
# 途中略
def Linetrace_Camera_Pre_callback(request):
  if DEBUG_MODE:
    print("Linetrace precallback called", str(time.time()))

  global lastblackline, slope

  try:
    with MappedArray(request, "lores") as m:
      image = m.array

      camera_x = Linetrace_Camera_lores_width
      camera_y = Linetrace_Camera_lores_height

      if DEBUG_MODE:
        cv2.imwrite(f"bin/{str(time.time())}_original.jpg", image)

      gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

      _, binary_image = cv2.threshold(gray_image, Black_White_Threshold, 255,
                                      cv2.THRESH_BINARY_INV)

      if DEBUG_MODE:
        cv2.imwrite(f"bin/{str(time.time())}_binary.jpg", binary_image)

      kernel = np.ones((3, 3), np.uint8)
      binary_image = cv2.erode(binary_image, kernel, iterations=2)
      binary_image = cv2.dilate(binary_image, kernel, iterations=3)

      detect_green_marks(image, binary_image)

      contours, _ = cv2.findContours(binary_image, cv2.RETR_TREE,
                                     cv2.CHAIN_APPROX_NONE)

      if not contours:
        return

      best_contour = find_best_contour(contours, camera_x, camera_y,
                                       lastblackline)

      if best_contour is None:
        return

      cx, cy = calculate_contour_center(best_contour)

      with LASTBLACKLINE_LOCK:
        lastblackline = cx

      with SLOPE_LOCK:
        slope = calculate_slope(best_contour, cx, cy)

      if DEBUG_MODE:
        debug_image = visualize_tracking(image, best_contour, cx, cy)
        cv2.imwrite(f"bin/{str(time.time())}_tracking.jpg", debug_image)

  except Exception as e:
    if DEBUG_MODE:
      print(f"Error in line tracing: {e}")
```
とりあえず順に見ていきましょう。
## Line 1 ~ 6
見てのとおりですね。必要なライブラリ（Pythonではモデュールというらしいですが）をインクルード（Pythonではインポートというらしいですが）しています。
## Line 8 ~
いよいよ解説らしいものができます。

まずprecallbackとは何なのか、解説したいと思います。

Raspberrypiでは、`rpicam-hello`というコマンドを用いることでカメラ画像のプレビューが可能になっています（コマンド名が違うかもしれません）。

そのコマンドは、画像の取得リクエストを投げ、その後画像を表示するということをしているプログラムです。

その時に使われている物が、`picamera2`というライブラリ(モジュール)です。

具体的には、カメラオブジェクトを生成する時点で、`precallback function`というものを指定できるようになっています。

それは、デフォルトでは`None`になっていて、画像を取得した時のフックが何もない状態になっています。

しかし、ここに関数を登録することによって、その関数の第一引数(この場合は`request`)にオブジェクトが渡されます。

これを`MappedArray(request, "lores").array`とすることによって、`request`に格納されている画像データが`numpy`の配列、`lores`画質で取得できます。

これによって画像が必要になるたびに`capture`することを回避でき、高速に画像を取得することができます(中身の処理が重いと関数自体の処理速度が下がるので何とも言えませんが、何もしなければ20msec/frameくらいで取得できます)。

ただし、万が一その関数にCPUリソースを大きく消費する操作などが含まれている場合、使っていないときにカメラを停止しなければ、大きく電力を消費することになります。

そのため、使うとき、使わないときで分けてカメラをスタート、ストップするべきです。

### Line 9 ~ 10
見てのとおりです。DEBUG_MODEが有効な時に関数が呼ばれたUNIX TIMEをprintしています。
### Line 12
グローバル変数を宣言しています。

ここで使われている変数について話しておきます。

| 変数名 | 使用用途 |
| --- | --- |
| lastblackline | 前回の黒線の中心座標 |
| slope | 黒線の傾き |

これらをグローバル変数にすることで、mainプロセスからもアクセスできるようにしています。

### Line 14 ~ 22
とりあえずいったんすべての例外を無視します。

画像を変数`image`にnumpy配列として格納します。

`camera_x`と`camera_y`にカメラの縦横の画素数を格納します。

そして、DEBUG_MODEが有効な時には、生画像を保存します。

### Line 24 ~ 30
画像をいったんグレースケールに変換します。これは画像をその後二値化したいためです。

26行目で、binary_imageに`Black_White_Threshold`を閾値として二値化した画像を格納します。黒に近いものがが白色、白に近いものが黒色になります。

ここで余談にはなりますが、グレースケールに変換する理由として、カラー画像をそのまま白黒に二値化することができないためです。そのまま関数にかけてしまうと、それぞれの色(r, g, b)がそれぞれの閾値として二値化されてしまい、彩度の高い(?)画像が出来上がってしまいます(言葉で説明することは難しいので実際に見てみることをお勧めします)。

そして、二値化した画像を`DEBUG_MODE`が有効な時は保存します。

### Line 32 ~ 35
ここでは、二値化した画像に含まれているノイズを除去します。

具体的にそれぞれの関数がどのようなことをしているのか解説します。

#### kernel = np.ones((3, 3), np.uint8)
これは、3x3の`numpy`二次元配列を生成します。要素はすべて`1`です。

#### binary_image = cv2.erode(binary_image, kernel, iterations=2)
先ほど作成した`kernel`を用いて、binary_imageのノイズを除去します。具体的に、`kernel`が画像全体を移動し、もし`kernel`の範囲内に含まれるピクセルのうち一つでも黒色(0)であれば、その中心のピクセルを黒色(0)に変換します。

これによって、白色の塊が小さくなり、ノイズが除去されます。

なお、黒、白の判定は`kernel`の各要素の数字を下回るか否かをもって判断されます。

`iterations=2`なので、これを2回実行します。
#### binary_image = cv2.dilate(binary_image, kernel, iterations=3)
これは、`erode`の逆の操作を行います。つまり、黒色の塊が大きくなります。

具体的には、一つでも白色(1)が含まれている場合、その中心のピクセルを白色(1)に変換します。

`iterations=3`なので、これを3回実行します。

### Line 36
ここでは、緑色のマークを認識、相対的な位置の判定を実行しています。あとで関数を解説します。

### Line 37 ~ 45
`contours`にcv2の関数を用いて白と黒の境界線を認識しています。

その後、自分で作成した`find_best_contour`関数を用いて、最も適切な輪郭を取得し、`best_contour`に格納します。

`find_best_contour`関数もあとで解説します。

### Line 47 ~ 50
ここでは、`best_contour`の中心座標を取得しています。

best_contourがない場合はそのまま処理を終えています。

### Line 53 ~ 56
ここでは、`lastblackline`と`slope`を更新しています。

`lastblackline`とは、`blackline`のx座標を表しており、`best_contour`を探すのに用いています。

`slope`は黒線の傾きを出しています。

具体的には、画像の最も下の中心から`best_contour`の中心までの傾きを出しています。

ちなみに、`with ..._LOCK:`は、`..._LOCK`というオブジェクトをロックしています。

ロックとは、あるプロセスがある変数を使用している時、他のプロセスがその変数を使用することを防ぐためのものです。

これによって、この変数への書き込みがアトミック（排他的）になります（同時編集されておかしなことにならないことが保証される。読み取り時にも設定する必要がある。）。

※あまり詳しくないですが、おそらくOSレベルでの操作になるため、あまり乱用しないほうが高速に処理できると思います。

### Line 57 ~
`DEBUG_MODE`が有効な時は画像を保存してくれます。

あとは、例外を処理しています。簡単ですね。

# 最後に
おおよそプログラムがどのように動いているのか理解していただけたら幸いです。緑マークを検出する関数で引数で渡された画像を直接書き換えてしまっているところだけ早めに治したいと思っています。

チームメンバーにもこのブログを読んでプログラムの内容について理解してほしいなと思っています。

ありがとうございました。

↑↑僕もK10-K10に見習い最後につけてみようと思いました。↑↑
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
## Line 


# 最後に
おおよそプログラムがどのように動いているのか理解していただけたら幸いです。緑マークを検出する関数で引数で渡された画像を直接書き換えてしまっているところだけ早めに治したいと思っています。

チームメンバーにもこのブログを読んでプログラムの内容について理解してほしいなと思っています。

ありがとうございました。

↑↑僕もK10-K10に見習い最後につけてみようと思いました。↑↑
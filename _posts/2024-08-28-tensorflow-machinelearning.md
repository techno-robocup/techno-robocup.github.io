---
layout: post
title: "tensorflowで簡単に機械学習"
date: 2024-08-28 10:00:00 +0900
tag: [machine-learning]
thumbnail-img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/TensorFlow_logo.svg"
author: "rotarymars"
---
# 記事の概要
現代のAIの時代において、自分たちでシンプルに機械学習を実装してみよう。

# 今回の機械学習の内容
今回の機械学習では、画像のクラス分けをします。  
例を見てみましょう。

![2](/assets/images/2024-08-28-digit2.png)

皆さんはこの数字を瞬時に"2"と判断できるかと思います。

このように、機械が同じように"2"と正しく判定することができたら、素晴らしいと思いませんか？

~~ALPAKA: 思いません~~

どうして、僕たちはこのように数字を判断することができるのでしょうか。

それは、今まで「このような形をしたものが2」と知っているからです。

同じように、コンピュータにも教えてあげれば、自分で学んでくれます。

それが機械学習です。

今回は、自分たちが手書きした数字を認識してくれるプログラムを作っていきます。

# 始める前に
僕自身があまり機械学習について詳しくなく、ここで述べられているものは間違っている場合があります。

間違いがあればgithubアカウントのEmailより、教えてくださると助かります。

# 始める前の準備
今回は機械学習にpythonを用います。

また、今回の記事はwsl上のUbuntuでの実装をしました。

一応、dockerでのテストもしました。

それでは、pythonをインストールしましょう。

特にバージョン管理ツールを使用するのでなければ、
```bash
apt update
apt -y upgrade
apt install python3 pip
```
となります。

少なくとも僕の環境では、python3を入れるときにリージョンを聞かれました。

python3とpipが入ったことを確認しましょう。
```bash
$ python3 --version
Python 3.12.3
$ pip --version
pip 24.0 from /usr/lib/python3/dist-packages/pip (python 3.12)
```

それでは、必要なパッケージをインストールしていきます。
```bash
pip install opencv-python tqdm numpy matplotlib tensorflow
```

opencvは画像の読み込み、tqdmはプログレスバーの表示、numpyは配列の作成、matplotlibは画像の表示、tensorflowは機械学習のモデル作成に使用します。

これで必要な環境は揃いました。

# 手書き数字データの作成
手書き数字のデータは、モジュールに含まれていますが、今回はそれを使わずに自分でデータを作ってみます。

僕は、windowsの標準アプリ「ペイント」を用いて、縦横28pxに数字を書き込みました。

今回のプログラムでは、学習用のpythonファイルと同じ階層にdataという名のディレクトリの下に、数字ごとのディレクトリの下に対応する数字があるということを前提に勧めていきます。

つまり、
```
.
`-- data
    |-- 0
    |   `-- 1.png
    |-- 1
    |   `-- 1.png
    |-- 2
    |   `-- 1.png
    |-- 3
    |   `-- 1.png
    |-- 4
    |   `-- 1.png
    |-- 5
    |   `-- 1.png
    |-- 6
    |   `-- 1.png
    |-- 7
    |   `-- 1.png
    |-- 8
    |   `-- 1.png
    `-- 9
        `-- 1.png
```
ということです。

また、今回は画像が黒白であることを前提に進めていこうと思います。
# プログラムの作成
好きなエディタを用いてプログラムを作成していきましょう。

僕はプログラムの名前をtrain.pyにしました。

まず、必要なモジュールをインポートします。
```python
import cv2 as cv
import random
import tqdm
import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
```

次に、モデルの作成をします。
```python
model = tf.keras.models.Sequential()
model.add(tf.keras.layers.Flatten(input_shape=(28,28)))
model.add(tf.keras.layers.Dense(units=200, activation=tf.nn.relu))
model.add(tf.keras.layers.Dense(units=100, activation=tf.nn.relu))
model.add(tf.keras.layers.Dense(units=10, activation=tf.nn.softmax))
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
```
ここでしているのは、1行目でモデルの宣言、2から5行目で層の追加、最後の行でそれをコンパイルしています。

層とはなんぞや、ということについては次回の記事で話そうと思います。

次に、ディレクトリから今回学習対象の写真を読み込みましょう。

```python
files = []
for i in range(0, 10):
    path = f"./data/{str(i)}/"
    tmpfiles = os.listdir(path)
    tmpfiles = [path + j for j in tmpfiles]
    files = files + tmpfiles
random.shuffle(files)
```
最後にランダムでシャッフルしているのは、学習する順番をランダムにすることで、毎回生成されるモデルが変わるようにするためです。

それでは、実際に学習させましょう。

今回は、最初に画像を全て読み込むのではなく、少しずつ、必要なときに読み込んでいきます。

それは、仮に全ての写真をメモリ上に乗せられなくても良いようにするためです。

```python
MAX_PICTURE = 100000 # 何枚の画像を同時にメモリに配置するか
EPOCH = 100 # 何回画像を学習させるか
nowindex = 0 # どこのインデックスまで行ったか
for i in tqdm.tqdm(range(EPOCH)):
    nowindex = 0
    train_x = []
    train_y = []
    while True:
        filepath = files[nowindex]
        img = cv.imread(filepath)[:, :, 0]
        img = np.invert(img)
        train_x.append(img) # 画像を配列に追加
        train_y.append(int(filepath[7])) # なんの数字か配列に追加
        nowindex += 1
        if len(train_x) >= MAX_PICTURE or nowindex >= len(files):
            train_x = np.array(train_x) # numpyの配列に変換
            train_y = np.array(train_y) # 同上
            model.train_on_batch(train_x, train_y) # 学習させる✏
            train_x = []
            train_y = []
        if nowindex >= len(files):
            break
model.save("model.h5") # 作成したモデルを保存
```

長いですが、こんな感じのコードです。

ただループを回すと経過を見ることができないので、tqdmというプログレスバーを表示してくれるものを使いました。

最後の行では、出来上がったモデルを保存しています。

ここまでがtrain.pyです。

さて、一旦ここで動かして見ましょう。

```bash
python3 train.py
```
僕の環境はGPUのドライバが入っているので、30秒前後で終わりました。

次に、このモデルがどれくらいの精度であるか、確かめてみましょう。

個人的に、95%を超えてこればいいのかなという感じです。

テスト用のデータは、以下のように配置されていることを想定しています。
```bash
 test
    ├── 0-0.png
    ├── 0-1.png
    ├── 1-0.png
    ├── 1-1.png
    ├── 2-0.png
    ├── 2-1.png
    ├── 3-0.png
    ├── 3-1.png
    ├── 4-0.png
    ├── 4-1.png
    ├── 5-0.png
    ├── 5-1.png
    ├── 6-0.png
    ├── 6-1.png
    ├── 7-0.png
    ├── 7-1.png
    ├── 8-0.png
    ├── 8-1.png
    ├── 9-0.png
    ├── 9-1.png
```
ハイフンの前の数字が実際に何が書かれているか、あとの数字は名前が被らないようにしているだけです。
それでは実装します。
```python
import cv2 as cv
import numpy as np
importatplotlib.pyplot as plt
import tensorflow as tf
import os

model = tf.keras.models.load_model('model.h5', custom_objects={'softmax_v2': tf.nn.softmax}) # モデルの読み込み

test_x = []
test_y = []
for i in os.listdir("./test/"):
    img = cv.imread("./test/" + i)[:, :, 0]
    img = np.invert(img)
    test_x.append(img)
    test_y.append(int(i[0]))

loss, accuracy = model.evaluate(test_x, test_y)
print("loss: ", loss)
print("accuracy: ". accuracy)

```
このような感じで精度を判定できます。

ここで、今度は自分の書いた数字を予測してもらいましょう。
```python
model = tf.keras.models.load_model('model.h5', custom_objects={'softmax_v2': tf.nn.softmax})
img = cv.imread(path)[:, :, 0]
img = np.invert(np.array([img]))
prediction = model.predict(img)
print(prediction)
```
これで、どれくらいの確率でどの数字かを表示できます。

もし、一番確率の大きいもののみを表示したい場合は、
```python
print(np.argmax(prediction))
```
としてください。

# 実際に動かしてみる
僕も実際に動かしてみました。

結果、92%程度です。

思ったほど精度は出ませんでしたが、学習用データが今回は少ないので、今回はこれで良しとしようと思います。

それでは、次回はニューロン周りのことについて記事を書こうと思います。

[今回のプログラム](https://github.com/rotarymars/handwritten-digit-recognition)


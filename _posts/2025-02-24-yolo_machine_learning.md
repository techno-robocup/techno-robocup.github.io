---
layout: post
title: "YOLOで機械学習~物体検知とロボカップでの応用~"
date: 2025-02-24 10:00:00 +0900
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

ログインして、先に進みます。

次に、プロジェクトを作成しましょう。
![create project](/assets/images/2025-02-24-label_studio_create_project.png)

真ん中にあるCreate projectを選択し、プロジェクト名を決めて入力します。

次に、上部のlabeling setupを選択し、"object detection with bounding boxes"を選択します。
![labeling setup](/assets/images/2025-02-24-label_studio_labeling_setup.png)

ラベリングしたい項目を追加します。
![add label](/assets/images/2025-02-24-label_studio_add_label.png)

既存のラベルをバツボタンで削除し、新たに"face"というラベルを追加します。

これらの操作が終わったら、右上の"save"ボタンを押して、保存します。

学習に使用する画像を集めます。

ぼくは、いらすとやから画像をダウンロードします(合計して顔の数が20個ほどになるようにしてください)。

ダウンロードし終えたら、label studioの真ん中にあるgo to importを押して、インポートします。

![add picture](/assets/images/2025-02-24-label_studio_add_picture.png)
importボタンを押して、操作を終えます。

いよいよラベリングの時間です。

画面上部にある"label all tasks"という青いボタンを押します。

以下の動画のようにラベリングしましょう。

<video src="/assets/images/2025-02-24-label_studio_labelling.mp4" controls=true width="100%"></video>

submitボタンを押すと、次の画像が出てくるので、終わるまで続けましょう。

終わったら、次はエクスポートします。

プロジェクトの最初ん画面に行きExportを押します。

![export](/assets/images/2025-02-24-label_studio_export.png)

YOLO Formatを選択して、Exportを押します。

ダウンロードされたzipファイルを展開します。

作業ディレクトリのルートに戻って、
```bash
mkdir data
```
とします。

そして、展開したzipファイルを、data/exported_dataに移動します。

つまり、こうなるべきです。
```
data
└── exported_data
    ├── classes.txt
    ├── images
    │   ├── 0f767c8e-nigaoe_oomura_masujirou.png
    │   ├── 1518c60c-bubble_houkai.png
    │   ├── 24440423-sweets_dondurma_turkish_icecream.png
    │   ├── 2a5e13a9-youchien_bag_girl.png
    │   ├── 4bd228da-business_baby_ikukyuu.png
    │   ├── 5167ce88-vaccine_yoyaku_no_oldman.png
    │   ├── 51fe5d6f-ninja.png
    │   ├── 62e18297-kabu_chart_smartphone_woman_happy.png
    │   ├── 7e1120e1-tabearuki.png
    │   ├── 946ebdcb-microphone5_girl.png
    │   ├── 99051455-travel_people_seichi_junrei.png
    │   ├── 9d90e76b-kojinjouhou_businessman.png
    │   ├── 9e5e9080-vaccine_yoyaku_no_oldwoman.png
    │   ├── a5976a7b-music_kahon_man.png
    │   ├── e21e626a-jintesya_papa_dendou_sakamichi.png
    │   └── eeb1b314-people_rounyakunannyo.png
    ├── labels
    │   ├── 0f767c8e-nigaoe_oomura_masujirou.txt
    │   ├── 1518c60c-bubble_houkai.txt
    │   ├── 24440423-sweets_dondurma_turkish_icecream.txt
    │   ├── 2a5e13a9-youchien_bag_girl.txt
    │   ├── 4bd228da-business_baby_ikukyuu.txt
    │   ├── 5167ce88-vaccine_yoyaku_no_oldman.txt
    │   ├── 51fe5d6f-ninja.txt
    │   ├── 62e18297-kabu_chart_smartphone_woman_happy.txt
    │   ├── 7e1120e1-tabearuki.txt
    │   ├── 946ebdcb-microphone5_girl.txt
    │   ├── 99051455-travel_people_seichi_junrei.txt
    │   ├── 9d90e76b-kojinjouhou_businessman.txt
    │   ├── 9e5e9080-vaccine_yoyaku_no_oldwoman.txt
    │   ├── a5976a7b-music_kahon_man.txt
    │   ├── e21e626a-jintesya_papa_dendou_sakamichi.txt
    │   └── eeb1b314-people_rounyakunannyo.txt
    └── notes.json

```
画像等の名前は違って問題ありません。

いよいよ学習のための準備が始まります。

data/dataset.ymlを作成します。このとき、今回はラベリングするものの種類が１種類なので、問題ありませんが、複数種類ある場合はdata/exported_data/classes.txtと同じ順番で書くようにしましょう。

```yaml
train: train/
val: valid/

# クラスの個数（ラベリングの種類の個数）
nc: 1

names: ["face"]
```

data/random_copy.pyを作成します。これは、学習用の画像と学習過程の精度を評価するために使用する画像を分けます。
```python
#!/usr/bin/env python
import os
import random
import re

data_dir = 'exported_data/images'
train_data_dir = 'train'
test_data_dir = 'valid'
namelist = [
    f for f in os.listdir(data_dir) if os.path.isfile(os.path.join(data_dir, f))
]

random.shuffle(namelist)

name = [
    re.match(r"(.*).(jpg|png)", f).group(1) for f in namelist
]

for i in range(0, len(namelist)//5*4):
    os.system(f"cp {data_dir}/{namelist[i]} {train_data_dir}/images/")
    os.system(
        f"cp {data_dir}/../labels/{name[i]}.txt {train_data_dir}/labels/")

for i in range(len(namelist)//5*4, len(namelist)):
    os.system(f"cp {data_dir}/{namelist[i]} {test_data_dir}/images/")
    os.system(f"cp {data_dir}/../labels/{name[i]}.txt {test_data_dir}/labels")

os.system(f"cp {data_dir}/../classes.txt {train_data_dir}/classes.txt")
os.system(f"cp {data_dir}/../classes.txt {test_data_dir}/classes.txt")
os.system(f"cp {data_dir}/../classes.txt {test_data_dir}/classes.txt")
```
実行権限を与えます。
```bash
chmod u+x data/random_copy.py
```

必要なディレクトリを作成します。

作業ディレクトリのルートに移動して、
```bash
mkdir -p data/{train,valid}/{images,labels}
```
を実行して、その後data/random_copy.pyを実行します(cwdがdata/で実行します)。
```bash
./random_copy.py
```
次に、学習に使用するモデルをdata/にダウンロードします。

```bash
curl -L -o {model_name}.pt "https://github.com/ultralytics/assets/releases/download/v8.3.0/{model_name}.pt"
```
model_nameの部分は[こちら](https://github.com/ultralytics/ultralytics?tab=readme-ov-file)参照の上で選んでください。

今回は、yolo11nを使用します
```bash
curl -L -o yolo11n.pt https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.pt
```
実行するディレクトリを指定します。

プロジェクトのルートディレクトリの下に、setup_dirs.pyを作成します。
```python
#!/usr/bin/env python
import os
from ultralytics import settings

# Update a setting
dirname = os.path.dirname(__file__)
runs_dir = os.path.join(dirname, "runs")
print(f'set up runs_dir to {runs_dir}')
settings.update({'runs_dir': runs_dir})
```
再び実行権限を付与して実行します。
```bash
chmod u+x setup_dirs.py
./setup_dirs.py
```
いよいよ学習させていきます。
```bash
cd data
yolo detect train \
  data=${PWD}/dataset.yml \
  model=./yolo11n.pt \
  epochs=300 imgsz=640 device="cpu"
```
今回は３００回学習させます。途中で学習の精度が上がらなくなれば、途中で中止されるはずです。

気長に待ちましょう。

さて、終わったら、出力の最後の方に以下のように書かれたものがあると思います。
```
Results saved to /home/***/ball_detection/runs/detect/train
```
このディレクトリに移動します。
```bash
cd /home/***/ball_detection/runs/detect/train
cd weights
```

今いるディレクトリに学習データが入っています(best.pt)
これをルートにコピーします。
```bash
cp best.pt ../../../../best.pt   
```
実際に精度を確かめてみましょう。

次のpythonスクリプトを作成します。(predict.py)
```python
import os
import sys

from ultralytics import YOLO

# Load a model
model = YOLO("best.pt")  # load a custom model

if len(sys.argv) == 1:
    print("usage: predict.py test.jpg")
    exit(1)

dirname = os.path.dirname(__file__)
runs_dir = os.path.join(dirname, "runs", "predict")

# Predict with the model
results = model(source=sys.argv[1],
                project=runs_dir,
                name="ball",
                save=True)

print(results[0].boxes.xyxy)
print(results[0].boxes.cls)
print(results[0].boxes.conf)
print(results[0].names)
```
![testpic.png](/assets/images/2025-02-24-label_testpic.png)

この画像で試してみましょう。

```
python predict.py testpic.png
```
出力された数行の中で、以下の出力がありました。
```
Results saved to /home/***/ball_detection/runs/predict/ball
```
見てみましょう

![result](/assets/images/2025-02-24-label_result.png)

とても正しく表示されています。すごいですね。

# まとめ
物体検出の中身まで理解しようとするととても大変ですが、触りだけであればすぐにできるのでより身近に感じてもらえればと思います。
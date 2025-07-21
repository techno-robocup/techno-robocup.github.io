---
layout: post
title: "開発体制"
date: 2025-07-21 10:00:00 +0900
tag: [robot, rotarymars's article, software]
thumbnail-img: "/assets/images/2025-07-21-introducing.png"
author: "rotarymars"
---

こんにちは。rotarymarsです。

最近は機体に関連する記事ばっかりだったので、今回は雰囲気を変えて私達のチームの開発体制について書きたいと思っています。

# チームの構成

私達のチームは以下のような構成になっています。

| 役割 | 人数(延べ) | 誰 |
| --- | --- | -- |
| 機体 | 1 | ALPAKA |
| 回路 | 2 | K10-K10, rotarymars |
| ソフトウェア | 2 | K10-K10, rotarymars |
| ブログ | 3 | ALPAKA, K10-K10, rotarymars |

という感じになっています。

これを見ると平均してメンバー一人あたり`2個半`の役割を担っていることになっています(メンバー募集中です)。

# 機体の開発体制
機体の開発に携わっている人が一人なため、幸か不幸か、一人でベストな体制をとっているようです。

今後はもう少し自分も関わっていけたら良いなとは思いつつも、機体を同時に編集するというのは色々とデータの都合上難しいのかなというところです。

# 回路の開発体制
回路は二人でやっているので、二人の間で意思疎通できるようにしています。

私達は[kicad](https://www.kicad.org/)を使って回路を設計しているため、そのデータを[github](https://github.com/)にアップロードしています。

これによってプルするだけで二人が作業したデータが反映されるようになっています。

個人的に残念なのは、[kicad](https://www.kicad.org/)だとどこが編集されたのかvisualで確認できないのが不満なところです。

余談ではありますが、機体の作成に使っている[freecad](https://www.freecad.org/index.php)だと[BIM Diff](https://wiki.freecad.org/BIM_Diff/en)と呼ばれるもので視覚的なdiffが見られるようです。
# ソフトウェアの開発体制
ソフトウェアも同様、二人の間で意思疎通ができるように[github](https://github.com/)を使っています。

ソフトウェアは文字で書いているため、diffも見やすくなっていて他の開発よりもやりやすいです。

ここでも余談ではありますが、[delta](https://github.com/dandavison/delta)コマンドを用いると、[github](https://github.com/)と同様にキャラクターごとのdiffを見ることができるようになります。

![delta](/assets/images/2025-07-21-delta.png)

こんな感じのものがローカルで見られると、便利ですよね。

# ブログの開発体制
ブログも、[github](https://github.com/)で内容を管理しています。

私の周りには一から`html`と`CSS`を書いてとてもきれいなサイトを仕上げる人もいますが、私達は[jekyll](https://jekyllrb.com/)という静的サイトジェネレーターでブログを作成しています。

確かにセットアップは面倒ですが、その後の便利さを考えると、考える余地のあるものだと思っています。



# Easy Mode (やさしいモード) Terminology Dictionary

This document serves as the central dictionary for all measurement terminology used in the MVP, mapping standard marketing terms to "Easy Mode" plain-language terms.

| 内部プロパティ名 | 通常モード表示 | やさしいモード表示 | 通常モード説明（ツールチップ） | やさしいモード説明（ツールチップ） |
| :--- | :--- | :--- | :--- | :--- |
| `Sessions` | Sessions | 訪問数 | サイトが訪問された回数（セッション数） | サイトが見られた回数 |
| `Users` | Users | 訪問した人 | 対象期間内にサイトを訪問したユニークユーザー数 | サイトを見てくれた人の数 |
| `Conversions` | Conversions | 成果数 | 設定されたコンバージョンが達成された回数 | 目標（購入や登録など）が達成された回数 |
| `CVR` | CVR | 成果率 | セッションに対するコンバージョン率 | サイトを見た人のうち、どれくらいが成果につながったか |
| `Bounce Rate` | Bounce Rate | すぐ離脱した割合 | 1ページのみでエンゲージメントなく離脱したセッションの割合 | サイトに来てすぐ帰ってしまった人の割合 |
| `Engagement Rate` | Engagement Rate | よく読まれた割合 | エンゲージメントしたセッションの割合 | サイトをしっかり読んでくれた人の割合 |
| `Channel` | Channel | 流入元 | トラフィックの獲得チャネル | どこからサイトに来たか |
| `Campaign` | Campaign | 広告キャンペーン | UTMパラメータのキャンペーン名 | どの広告や企画で来たか |
| `Landing Page` | Landing Page | 最初に見られたページ | セッションが開始された最初のページパス | 一番最初に見られたページ |
| `Scroll Depth` | Scroll Depth | 読了率 | ページの最大スクロール到達深度 | ページが下までどれくらい読まれたか |
| `CTA Click` | CTA Click | ボタン押下数 | 主要なコールトゥアクションボタンのクリック数 | 重要なボタンが押された回数 |
| `Funnel` | Funnel | 成果までの流れ | コンバージョン達成に至る各ステップの通過率 | ページを見てから成果がでるまでのステップ |

> **Note to Developers:**
> All UI components must use the `useTerm()` hook from `src/lib/terminology.tsx` to display these terms conditionally based on the user's toggle state. Do not hardcode strings for these metrics.

# Phase 0 Research: EC 商品一覧（SPA, Mock）

## Decisions

- SPA 配信: CloudFront + S3（IaC: AWS CDK）
- データ: モック（MSW）。API 実装はスコープ外。将来の契約は OpenAPI で管理
- UI: React + Tailwind CSS + Radix UI + shadcn/ui
- ルーター: React Router（一覧のみ）
- 状態管理: Zustand（UI 状態）+ SWR（取得キャッシュ）
- 検索: 商品名の部分一致（正規化無し）
- フィルター: AND、在庫あり= 在庫>0 かつ 販売中（連動）
- ソート: 人気順（人気度整数の降順）、価格昇降、レビュー評価
- 無限スクロール: 300px 手前で 10 件ずつ、終端文言表示
- レビュー平均: 全レビュー対象、四捨五入（round half up）で小数 1 桁
- 低在庫バッジ: 閾値 5（固定）
- デプロイ: aws-s3-deployment による `web/dist` 配信、SPA fallback（index.html）

## Rationale

- SPA + S3/CloudFront: コスト・配信速度・簡便性のバランス
- MSW: コントローラブルなテスト・開発体験、将来の API 置換が容易
- Zustand + SWR: シンプルなローカル状態とフェッチ状態の分離
- Tailwind + shadcn/ui: コンポーネント生産性と可搬性
- CDK: IaC による再現性・変更追跡と CI/CD 連携の容易さ

## Alternatives Considered

- Redux/RTK Query → 本要件の複雑性に対して過剰
- Server Components → ホスティングと整合しない（SPA 要件）
- GraphQL → 将来拡張対象、現時点は REST 的契約を OpenAPI で管理

## Test Strategy (Google TestSize)

- Small: ユニット（関数、Zustand ストア、UI ロジック）→ Vitest
- Medium: React コンポーネント統合（RTL + MSW）
- Large: ユーザーフロー（検索 → スクロール → 追加読み込み）→ Playwright

## Unknowns / Clarifications

- なし（仕様により解消済み）

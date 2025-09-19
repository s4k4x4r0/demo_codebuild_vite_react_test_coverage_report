# Quickstart: EC 商品一覧（SPA, Mock）

## 前提

- Node.js LTS / npm
- VS Code（ESLint/Prettier 拡張）
- AWS アカウント/認証（CDK 用）

## セットアップ

1. 依存関係の導入（後続タスクで段階導入）

   - UI: React, Tailwind, Radix, shadcn/ui
   - 状態: Zustand, SWR
   - ルーター: React Router
   - バリデーション/フォーム: Valibot, React Hook Form
   - テスト: Vitest, @testing-library/react, MSW, Playwright
   - 品質: ESLint, Prettier, lint-staged, husky
   - IaC/他: AWS CDK, Amplify（Cognito 後続）, TypeSpec, OpenAPI Tooling

2. 開発サーバ

```bash
npm run dev
```

3. テスト

- Small/Medium（Vitest/RTL）

```bash
npm test
```

- Large（E2E: Playwright）

```bash
npm run e2e
```

4. Storybook

```bash
npm run storybook
```

5. モック（MSW）

- OpenAPI 契約（contracts/openapi.yaml）を基にハンドラを定義
- 開発サーバ起動時に MSW を有効化

6. ビルド

```bash
npm run vite build
```

7. デプロイ（AWS CDK）

- 事前準備

```bash
npm install
npm run cdk bootstrap
```

- デプロイ

```bash
npm run cdk deploy --require-approval never
```

- 期待結果: S3 バケット作成、CloudFront ディストリビューション作成、`web/dist` が配信される

## BDD/TDD 方針

- Red-Green-Refactor を厳守
- 受け入れ条件を元にテスト記述 → 実装
- Google TestSize 分類をテスト名に明記（[Small] / [Medium] / [Large]）

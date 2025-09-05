# CodeBuild x Vite x React x テストカバレッジレポート デモアプリ

CodeBuild でフロントエンドアプリのテストカバレッジを確認するデモです!!!

## 手順

1. `.envrc` ファイルの作成

環境変数を設定するための `.envrc` を作成する。
なお、`.envrc` は Git 管理外になっています。

```bash
touch .envrc
```

2. AWS リージョンの設定

環境変数で任意のリージョンを設定してください。

```bash: .envrc
# ...

# AWS リージョン
export AWS_REGION="ap-northeast-1"
```

3. AWS 認証情報の設定

環境変数で AWS 認証情報を設定してください。
セキュリティの観点からアクセスキーは非推奨です。
なるべく、一時的な認証情報を使用するようにしてください。

```bash: .envrc
# ...

# AWS認証情報
export AWS_ACCESS_KEY_ID="<Your AWS Access Key ID>"
export AWS_SECRET_ACCESS_KEY="<Your AWS Secret Access Key>"
export AWS_SESSION_TOKEN="<Your AWS Session Token>"
```

4. 環境変数の有効化

```bash
direnv allow
```

5. CDK の bootstrap（初回のみ）

```bash
npx cdk bootstrap
```

6. スタックのデプロイ

```bash
npx cdk deploy
```

# メモ

- Vite のテンプレートからファイル移行中。
  <https://ja.vite.dev/guide/#trying-vite-online>
- tsconfig.node.json の`moduleResolution`は`node`じゃないと CDK 動かないかも？

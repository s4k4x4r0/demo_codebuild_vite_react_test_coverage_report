# Implementation Plan: EC サイトにおいてユーザーが商品を閲覧する（一覧のみ）

**Branch**: `001-ec` | **Date**: 2025-09-19 | **Spec**: `/workspaces/demo_codebuild_vite_react_test_coverage_report/specs/001-ec/spec.md`
**Input**: Feature specification from `/workspaces/demo_codebuild_vite_react_test_coverage_report/specs/001-ec/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

ユーザーが SPA 上で商品一覧を検索・フィルター・ソートしながら閲覧できる機能を提供する（商品詳細はスコープ外）。データはモックを使用し、無限スクロールで 10 件ずつ読み込み。人気順は「人気度（整数、降順）」で定義。AWS 上に CloudFront + S3 を用いた静的ホスティングで提供し、AWS CDK によりインフラ構築とデプロイを本プロジェクト内で実施する。開発は BDD/TDD を採用し、Vitest/RTL/Playwright により Small/Medium/Large を分類して検証する。

## Technical Context

**Language/Version**: TypeScript (Node.js LTS)
**Primary Dependencies**: React, Vite, React Router, Tailwind CSS, Radix UI, shadcn/ui, Zustand, SWR, Valibot, React Hook Form, AWS Amplify（Cognito）, MSW, Vitest, React Testing Library, Storybook, Playwright, ESLint, Prettier, lint-staged, husky, AWS CDK, TypeSpec, OpenAPI, OpenAPI Generator
**Storage**: N/A（本機能はモックデータのみ）
**Testing**: Vitest + React Testing Library（Small/Medium）、Playwright（Large）
**Target Platform**: AWS（S3 + CloudFront で SPA 配信、CDK で IaC）
**Project Type**: web（SPA フロントエンド。現リポジトリの `web/` をベース）
**Performance Goals**: 初期表示 < 2s、無限スクロール追加読み込み < 1s（モック基準）
**Constraints**: SPA、サーバーレス配信、仕様に従った UI/UX、一切の正規化なし検索、AND フィルタ、インフラは AWS のみ
**Scale/Scope**: 商品一覧のみ、API 実装はスコープ外。S3+CloudFront の IaC（CDK）と SPA デプロイはスコープ内

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Test-First（BDD/TDD）: 準拠（Vitest/RTL/Playwright を先行）
- 契約駆動: OpenAPI を先行し、MSW モックは契約に準拠
- 単一責務・シンプル: UI/状態/データ整形の分離（コンポーネント/ストア/セレクタ）
- セキュリティ/秘密情報: 本機能はモックのみで機密なし（Amplify は後続）
- IaC 一貫性: CDK による S3/CloudFront 構築・更新・デプロイを標準化

評価: 現状違反なし（constitution.md に具体規定は未記載のため、一般原則でチェック）

## Project Structure

### Documentation (this feature)

```
specs/001-ec/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
# Option 1: Single project (DEFAULT)
web/
├── models/
├── services/
├── cli/
└── lib/

infra/
└── cdk/
    ├── bin/
    ├── lib/
    ├── package.json
    └── cdk.json

tests/
├── e2e/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 1（現行 `web/` 単独プロジェクト + `infra/cdk` を追加）

E2E（Playwright）は `tests/e2e/` 配下に配置し、リポジトリ直下の `playwright.config.ts` で testDir を `tests/e2e` に設定します。

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: `research.md`（本機能における BDD/TDD、テストサイズ、UI/状態/モック/デザイン指針、CDK での S3/CloudFront 構成方針を確定）

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Infrastructure design (CDK)**:
   - S3（静的サイトホスティング）+ CloudFront（OAC/OAI, SPA fallback 200 /index.html）
   - S3 ブロックパブリックアクセス、CloudFront キャッシュポリシー（静的アセット長期、HTML 短期）
   - aws-s3-deployment による `web/dist` の配信

**Output**: `data-model.md`, `contracts/openapi/openapi.yaml`（MSW モックの契約ベース）, `quickstart.md`（CDK 手順含む）

TypeSpec（SSOT）:

- API契約は TypeSpec を単一の真実の源泉（SSOT）として管理し、OpenAPI は生成物として扱う
- 生成コマンド: `npm run tsp:build`（`tspconfig.yaml` に従い `specs/001-ec/contracts` 配下へ出力）
- 手動編集は TypeSpec 側のみとし、生成された OpenAPI は直接編集しない

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass
- CDK インフラ → S3 バケット作成、CloudFront ディストリビューション/OAC 設定、S3Deployment によるアセット配信、キャッシュ無効化（デプロイ時）

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Infra order: CDK スタック → Web ビルド連携 → デプロイ検証
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_

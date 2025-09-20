# Tasks: EC サイトにおいてユーザーが商品を閲覧する（一覧のみ）

Root: `/workspaces/demo_codebuild_vite_react_test_coverage_report`
Feature Dir: `/workspaces/demo_codebuild_vite_react_test_coverage_report/specs/001-ec`

Notation:

- [P] = Can run in parallel (different files / no ordering conflict)
- deps: Upstream task IDs that must complete first

## TDD First: Setup → Tests → Implementation → Integration → Polish

### Setup

T001. Add Tailwind/PostCSS base setup [P]

- Files:
  - `web/tailwind.config.ts`
  - `web/postcss.config.js`
  - Ensure `web/src/index.css` includes Tailwind directives
- Content:
  - tailwind.config.ts: content=["./web/index.html", "./web/src/**/*.{ts,tsx}"], darkMode="class"
  - postcss: { tailwindcss, autoprefixer }
- deps: —

T002. Establish features-based dirs and placeholders [P]

- Files:
  - `web/src/features/product-list/{pages,components,store,services}/.keep`
  - `web/src/app/{router.tsx, providers.tsx}` (skeleton)
- deps: —

T003. Ensure Playwright config and e2e script wiring [P]

- Files:
  - `tests/e2e/playwright.config.ts`（verify baseURL）
  - `package.json` scripts: `e2e: "playwright test --config tests/e2e/playwright.config.ts"`
- deps: —

T004. TypeSpec build plumbing [P]

- Files:
  - `package.json` scripts: `tsp:build`
  - `specs/001-ec/contracts/typespec/*`
- Action:
  - Run once to verify output at `specs/001-ec/contracts/openapi/openapi.yaml`
- deps: —

### Contract tests（per contract）

T005. Contract test: GET /products schema conformity [P]

- Files:
  - `tests/contract/products.contract.test.ts`
- Scope:
  - Validate query params (q, inStockOnly, saleStatus, priceMin, priceMax, sort, offset, limit)
  - Validate response shape: items[], offset, limit, totalItems
- deps: T004

### MSW mocks（contract-aligned）

T006. MSW bootstrap and handlers [P]

- Files:
  - `web/src/mocks/{handlers.ts, browser.ts, server.ts}`
  - `web/src/main.tsx`（dev時のみ worker.start()）
- Handlers:
  - GET /products returns shape per OpenAPI; implement offset/limit windowing
- deps: T004, T005

### Unit/Integration tests（Small/Medium）

T007. Service: fetchProducts (SWR hook) – failing test first [P]

- Files:
  - `web/src/features/product-list/services/products.ts`
  - `web/src/features/product-list/services/products.test.ts`
- Tests:
  - Default sort=popularity_desc, offset=1, limit=10
  - Maps UI state → contract params
- deps: T006

T008. Store: Zustand state for filters/sort/pagination – failing test first [P]

- Files:
  - `web/src/features/product-list/store/useProductListStore.ts`
  - `web/src/features/product-list/store/useProductListStore.test.ts`
- State:
  - q, inStockOnly, saleStatus, sort, offset, limit, items, totalItems, isLoading, error
- deps: T006

T009. Component: ProductCard – failing test first [P]

- Files:
  - `web/src/features/product-list/components/ProductCard.tsx`
  - `web/src/features/product-list/components/ProductCard.test.tsx`
- Acceptance:
  - 名称/価格/サムネイル/レビュー平均/在庫有無/低在庫バッジ
- deps: T006

T010. Page: ProductListPage – failing test first（list + filters + sort UI）

- Files:
  - `web/src/features/product-list/pages/ProductListPage.tsx`
  - `web/src/features/product-list/pages/ProductListPage.test.tsx`
- Includes:
  - 無限スクロール（300px閾値）、在庫あり連動（販売中）
- deps: T007, T008, T009

### Implementation（make tests pass）

T011. Implement fetchProducts (SWR hook)

- Files:
  - `web/src/features/product-list/services/products.ts`
- Logic:
  - SWRキー= params hash, fetcher maps to `/products` with offset/limit
- deps: T007

T012. Implement Zustand store logic

- Files:
  - `web/src/features/product-list/store/useProductListStore.ts`
- Logic:
  - actions: setQuery, setFilters, setSort, loadMore, reset
- deps: T008

T013. Implement ProductCard rendering

- Files:
  - `web/src/features/product-list/components/ProductCard.tsx`
- deps: T009

T014. Implement ProductListPage（wire store/services/components）

- Files:
  - `web/src/features/product-list/pages/ProductListPage.tsx`
  - `web/src/app/router.tsx`（route登録）
- deps: T010, T011, T012, T013

### E2E（user stories）

T015. 検索→一覧表示（Acceptance 1） [P]

- Files: `tests/e2e/product-list.search.spec.ts`
- deps: T014

T016. 在庫ありフィルタ（Acceptance 2） [P]

- Files: `tests/e2e/product-list.filter-instock.spec.ts`
- deps: T014

T017. 価格ソート（Acceptance 3） [P]

- Files: `tests/e2e/product-list.sort-price.spec.ts`
- deps: T014

T018. 価格帯境界（Acceptance 4） [P]

- Files: `tests/e2e/product-list.price-range.spec.ts`
- deps: T014

T019. 無限スクロール（Acceptance 5） [P]

- Files: `tests/e2e/product-list.infinite-scroll.spec.ts`
- deps: T014

T020. 取得失敗→再試行（Acceptance 6） [P]

- Files: `tests/e2e/product-list.retry.spec.ts`
- deps: T014

T021. 初期表示は人気順（Acceptance 7） [P]

- Files: `tests/e2e/product-list.initial-sort.spec.ts`
- deps: T014

T022. 在庫あり→販売中連動（Acceptance 8） [P]

- Files: `tests/e2e/product-list.filter-coupled.spec.ts`
- deps: T014

### Polish / UX / Docs

T023. Apply Tailwind/Radix/shadcn/ui styling to page components

- Files:
  - `web/src/features/product-list/components/*`
  - `web/src/features/product-list/pages/ProductListPage.tsx`
- deps: T014

T024. Accessibility pass（Radix A11y, labels, roles）

- Files: same as T023
- deps: T023

T025. Performance: SWR cache & prefetch tuning, list virtualization check

- Files:
  - `web/src/features/product-list/services/products.ts`
  - `web/src/features/product-list/pages/ProductListPage.tsx`
- deps: T014

T026. Docs: Update quickstart with MSW note & E2E run hints（if diverged）

- Files: `specs/001-ec/quickstart.md`
- deps: T014

### Infra（design-aligned; code add when解禁）

T027. CDK stack tasks（OAC前提）– 設計準拠のTODO（実装は保留）

- Files: `infra/cdk/lib/*`
- deps: —

---

## Parallelization Hints

- [P] タグのテストは別ファイルのため並行可能（例: T015〜T022）
- 初期[Setup] T001〜T004 は並行可能
- 実装は各テストに従い個別ファイルのため T011〜T013 は並行可能

## Common Commands

```bash
# Dev
npm run dev
# Unit/Integration (Vitest/RTL)
npm test
# E2E (別ターミナルで dev を先に)
npm run e2e
# TypeSpec → OpenAPI
npm run tsp:build
# Build
npm run vite build
# Deploy (when infra ready)
npm run cdk bootstrap && npm run cdk deploy --require-approval never
```

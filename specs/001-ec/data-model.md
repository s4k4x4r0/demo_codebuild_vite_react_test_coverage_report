# Data Model: EC 商品一覧

## Entities

### Product

- id: string
- name: string
- description: string
- priceJpy: number (>= 0)
- stock: number (integer, >= 0)
- imageUrl: string | null
- saleStatus: enum { 販売中, 販売停止 }
- popularity: number (integer, >= 1)
- reviewAverage: number (0.0..5.0, 小数 1 桁, round half up 表示)
- reviewCount: number (integer, >= 0)

### Review

- id: string
- productId: string
- rating: number ∈ {1,2,3,4,5}
- comment: string
- createdAt: string (ISO8601)

## Derived/Display Rules

- 人気順: popularity の降順（同順位は不定）
- 在庫あり: stock > 0 AND saleStatus == 販売中
- 低在庫: stock < 5 → 「残りわずか」
- 画像欠落: imageUrl が null/取得失敗 → 代替テキスト "No Image"
- レビュー平均: 全レビュー平均を四捨五入（round half up）で小数 1 桁表示

## Validation (to be enforced with Valibot)

- name: 非空、長さ上限（例: 120）
- priceJpy: 整数または小数（2 桁まで）、>= 0
- stock: 整数、>= 0
- popularity: 整数、>= 1
- rating: 整数、1..5

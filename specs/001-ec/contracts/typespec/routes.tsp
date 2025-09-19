import "@typespec/http";
import "./models.tsp";

using TypeSpec.Http;

namespace ProductListing.Routes;

@route("/products")
namespace Products {
  @get
  @summary("商品一覧の取得（検索/フィルター/ソート/ページング）")
  op list(
    @query
    @doc("商品名の部分一致（正規化なし）")
    q: string,

    @doc("在庫あり（stock>0 かつ 販売中）")
    @query
    inStockOnly?: boolean,

    @query
    @doc("販売状態フィルター")
    saleStatus?: ProductListing.Models.SaleStatus,

    @query
    @doc("価格帯フィルターの下限")
    @minValue(0)
    priceMin?: float64,

    @query
    @minValue(0)
    @doc("価格帯フィルターの上限")
    priceMax?: float64,

    @query
    @doc("ソート条件")
    sort?:
      | "popularity_desc"
      | "price_asc"
      | "price_desc"
      | "rating_desc" = "popularity_desc",

    @query
    @minValue(1)
    @doc("ページネーションの先頭からスキップするレコード数")
    offset?: int32 = 1,

    @query
    @minValue(1)
    @maxValue(50)
    @doc("ページネーションの単一ページで返すレコードの最大数")
    limit?: int32 = 10,
  ): {
    @statusCode statusCode: 200;
    @body body: {
      items: ProductListing.Models.Product[];

      @minValue(1)
      @doc("ページネーションの先頭からスキップするレコード数")
      offset: int64;

      @minValue(1)
      @maxValue(50)
      @doc("ページネーションの単一ページで返すレコードの最大数")
      limit: int64;

      @minValue(0)
      @doc("商品の合計数")
      totalItems: int64;
    };
  };
}

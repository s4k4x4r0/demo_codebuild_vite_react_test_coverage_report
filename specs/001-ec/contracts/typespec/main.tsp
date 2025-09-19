import "@typespec/http";

import "./routes.tsp";

using TypeSpec.Http;

@service(#{ title: "Product Listing API (Mock Contract)" })
@server("https://api.example.com")
@doc("商品一覧取得用の将来 API 契約。現フェーズでは MSW によるモックのみ。")
namespace ProductListing;

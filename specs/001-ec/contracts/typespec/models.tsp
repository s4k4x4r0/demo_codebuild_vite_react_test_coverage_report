namespace ProductListing.Models;

model Product {
  id: string;
  name: string;
  description?: string;
  @minValue(1) priceJpy: float64;
  @minValue(0) stock: int64;
  imageUrl?: string;
  saleStatus: SaleStatus;
  @minValue(1) popularity: int64;
  @minValue(0.1) @maxValue(5) reviewAverage: float64;
  @minValue(0) reviewCount: int64;
}

enum SaleStatus {
  onSale: "on_sale",
  stopped: "stopped",
}

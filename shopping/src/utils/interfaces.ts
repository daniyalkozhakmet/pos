export interface IProduct {
  product_id: string;
  shop: string;
  name: string;
  barcode: number;
  description: string;
  stock_level: number;
  unit_price: number;
}
export interface IProductSearch {
  barcode?: string;
  product_id?: string;
  id?: string;
  shop: string;
}
export interface Paginator {
  limit: number;
  page: number;
}
export interface IPurchase {
  payment_method: string;
  shop: string;
}
export interface IPurchaseCompletedPayload {
  product_id: string;
  qty: number;
}

export interface IProduct {
  name: string;
  barcode: number;
  description: string;
  stock_level: number;
  unit_price: number;
  category: string;
  supplier?: string;
  shop_id?: string;
}
export interface IShop {
  name: string;
  shop_id: string;
}
export interface ICategory {
  name: string;
  category_id: string;
  shop_id?: string;
}
export interface ProductInputs {
  name: string;
  barcode: number;
  description: string;
  stock_level: number;
  unit_price: number;
  category: string;
  supplier?: string;
  shop_id?: string;
}
export interface Paginator {
  limit: number;
  page: number;
}
export interface CategoryInputs {
  name: string;
  category_id: string;
  shop_id?: string;
}
export interface ISupllier {
  id?: string;
  product?: string;
  name: string;
  address: string;
  phone: string;
  shop_id: string;
}

/**
 * Domain types — Products module
 * 
 * SINGLE SOURCE OF TRUTH for all product-related types based on API doc.
 */

// ─── Product Entity ─────────────────────────────────────────────────────────────

export interface ProductImage {
  url: string;
}

export interface ProductMetadata {
  brand?: string;
  color?: string;
  material?: string;
  [key: string]: any;
}

export interface Product {
  id: string | number; // L'ID peut être un string ou number, on met string pour UUID généralement
  name: string;
  price: number;
  description?: string;
  costPrice?: number;
  stock: number;
  stockAlert: number;
  barcode?: string;
  sku?: string;
  active: boolean;
  metadata?: ProductMetadata;
  images?: ProductImage[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type ProductStatus = 'active' | 'inactive';
export type StockStatus = 'out-of-stock' | 'low-stock' | 'in-stock';

export function getStockStatus(product: Product): StockStatus {
  if (product.stock === 0) return 'out-of-stock';
  if (product.stock <= product.stockAlert) return 'low-stock';
  return 'in-stock';
}

// ─── Product Form ───────────────────────────────────────────────────────────────

export interface ProductFormData {
  name: string;
  price: number;
  description?: string;
  costPrice?: number;
  stock?: number;
  stockAlert?: number;
  barcode?: string;
  sku?: string;
  active?: boolean;
  metadata?: ProductMetadata;
  images?: ProductImage[];
}

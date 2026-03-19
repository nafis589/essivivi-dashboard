export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    lowStockThreshold: number;
    category: string;
    barcode: string;
    imageUrl: string;
    popular?: boolean;
    unit?: string; // "pièce" | "kg" | "litre"
}

export interface Customer {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    points?: number;
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
}

export type PaymentMethod = "cash" | "mobile" | "card";

export type StockStatus = "ok" | "low" | "out";

export function getStockStatus(product: Product): StockStatus {
    if (product.stock === 0) return "out";
    if (product.stock <= product.lowStockThreshold) return "low";
    return "ok";
}

export interface SaleRecord {
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    customerId?: number;
    paymentMethod: PaymentMethod;
    createdAt: Date;
    receiptNumber: string;
    isOffline?: boolean;
}

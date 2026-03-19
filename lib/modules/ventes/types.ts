export type SaleStatus = 'paid' | 'refunded' | 'pending' | 'partially_refunded';
export type PaymentMethod = 'cash' | 'mobile' | 'card';

export interface SaleCustomer {
    id: string;
    name: string;
    phone?: string;
    email?: string;
}

export interface SaleItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    refundedQuantity: number;
}

export interface Sale {
    id: string;
    invoiceNumber: string;
    date: string; // ISO string
    customer: SaleCustomer | null;
    items: SaleItem[];
    subtotal: number;
    taxes: number;
    total: number;
    paymentMethod: PaymentMethod;
    status: SaleStatus;
    refundReason?: string;
}

export interface SalesFilterOptions {
    dateRange: 'today' | 'this_week' | 'this_month' | 'custom';
    customDateRange?: { start: Date; end: Date };
    paymentMethod?: PaymentMethod | 'all';
    status?: SaleStatus | 'all';
    minAmount?: number;
    maxAmount?: number;
    searchQuery: string;
}

export interface SalesStats {
    totalSalesCount: number;
    totalRevenue: number;
    todaySalesCount: number;
    averageSaleAmount: number;
}

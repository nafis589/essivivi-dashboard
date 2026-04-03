export type SaleStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'MOBILE_MONEY';

export interface SaleCustomer {
    id: number;
    name: string;
    phone?: string;
    email?: string;
}

export interface SaleItem {
    id?: number;
    productId?: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
    refundedQuantity?: number;
}

export interface SalePayment {
    id?: number;
    method: PaymentMethod;
    amount: number;
}

export interface Sale {
    id: number;
    invoiceNumber: string;
    createdAt: string; // API uses createdAt instead of date
    updatedAt?: string;
    customer: SaleCustomer | null;
    items?: SaleItem[];      // Optional because missing in list endpoint
    payments?: SalePayment[];// Optional because missing in list endpoint
    subtotal: number;
    tax: number;
    total: number;
    status: SaleStatus;
    userId?: string;
    customerId?: number;
}

export interface SalesFilterOptions {
    dateRange: 'today' | 'this_week' | 'this_month' | 'custom';
    customDateRange?: { start: Date; end: Date };
    status?: SaleStatus | 'all';
    searchQuery: string;
    page: number;
    limit: number;
}

export interface SalesStats {
    totalSales: number;
    totalRevenue: number;
    todayRevenue: number;
    averageOrder: number;
}

export interface SalesListResponse {
    data: Sale[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

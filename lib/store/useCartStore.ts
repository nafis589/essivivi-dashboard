import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Customer, PaymentMethod, Product, SaleRecord } from "@/lib/types/pos";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/pos";

interface CartStore {
    // State
    items: CartItem[];
    customerId?: number;
    offlineSales: SaleRecord[];

    // Computed (via getters)
    readonly subtotal: number;
    readonly tax: number;
    readonly total: number;
    readonly itemCount: number;
    readonly customer: Customer | undefined;

    // Actions
    addItem: (product: Product, quantity?: number) => { success: boolean; message?: string };
    updateQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    setCustomer: (customerId?: number) => void;
    recordSale: (method: PaymentMethod) => SaleRecord;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            customerId: undefined,
            offlineSales: [],

            get subtotal() {
                return get().items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );
            },

            get tax() {
                return Math.round(get().subtotal * 0.1);
            },

            get total() {
                return get().subtotal + get().tax;
            },

            get itemCount() {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            get customer() {
                const id = get().customerId;
                return id ? MOCK_CUSTOMERS.find((c) => c.id === id) : undefined;
            },

            addItem: (product: Product, quantity = 1) => {
                const state = get();
                const existingItem = state.items.find((item) => item.product.id === product.id);
                const currentQty = existingItem?.quantity ?? 0;

                if (product.stock === 0) {
                    return { success: false, message: "Produit en rupture de stock" };
                }

                if (currentQty + quantity > product.stock) {
                    return {
                        success: false,
                        message: `Stock insuffisant. Disponible : ${product.stock - currentQty}`,
                    };
                }

                set((state) => {
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { id: product.id, product, quantity }],
                    };
                });

                return { success: true };
            },

            updateQuantity: (itemId: string, quantity: number) => {
                set((state) => {
                    if (quantity <= 0) {
                        return { items: state.items.filter((item) => item.id !== itemId) };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.id === itemId ? { ...item, quantity } : item
                        ),
                    };
                });
            },

            removeItem: (itemId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));
            },

            clearCart: () => {
                set({ items: [], customerId: undefined });
            },

            setCustomer: (customerId?: number) => {
                set({ customerId });
            },

            recordSale: (method: PaymentMethod) => {
                const state = get();
                const receiptNumber = `FC-${Date.now().toString(36).toUpperCase()}`;
                const sale: SaleRecord = {
                    id: crypto.randomUUID(),
                    items: [...state.items],
                    subtotal: state.subtotal,
                    tax: state.tax,
                    total: state.total,
                    customerId: state.customerId,
                    paymentMethod: method,
                    createdAt: new Date(),
                    receiptNumber,
                    isOffline: typeof window !== "undefined" && !navigator.onLine,
                };

                if (sale.isOffline) {
                    set((s) => ({ offlineSales: [...s.offlineSales, sale] }));
                }

                return sale;
            },
        }),
        {
            name: "pos-cart-storage",
            partialize: (state) => ({
                // Only persist offline sales
                offlineSales: state.offlineSales,
            }),
        }
    )
);

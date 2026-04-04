/**
 * useCartStore — Zustand store pour le POS
 *
 * Gère le panier local + le client sélectionné.
 * Ne fait plus appel aux mocks — la soumission de vente est
 * déléguée à createPOSSale() dans le PaymentModal.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, POSProduct, POSCustomer, PaymentMethod } from '@/lib/types/pos.types'

interface CartStore {
  items: CartItem[]
  selectedCustomer: POSCustomer | null
  subtotal: number
  tax: number
  total: number
  itemCount: number

  addItem: (product: POSProduct, quantity?: number) => { success: boolean; message?: string }
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  setCustomer: (customer: POSCustomer | null) => void
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = 0
  const total = subtotal + tax
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { subtotal, tax, total, itemCount }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedCustomer: null,
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,

      addItem(product: POSProduct, quantity = 1) {
        const state = get()
        const existingItem = state.items.find((item) => item.product.id === product.id)
        const currentQty = existingItem?.quantity ?? 0

        if (product.stock === 0) {
          return { success: false, message: 'Produit en rupture de stock' }
        }

        if (currentQty + quantity > product.stock) {
          return {
            success: false,
            message: `Stock insuffisant. Disponible : ${product.stock - currentQty}`,
          }
        }

        set((state) => {
          let newItems: CartItem[]
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            newItems = [
              ...state.items,
              {
                id: `${product.id}-${Date.now()}`,
                product,
                quantity,
              },
            ]
          }
          return {
            items: newItems,
            ...calculateTotals(newItems),
          }
        })

        return { success: true }
      },

      updateQuantity(itemId: string, quantity: number) {
        set((state) => {
          let newItems: CartItem[]
          if (quantity <= 0) {
            newItems = state.items.filter((item) => item.id !== itemId)
          } else {
            newItems = state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            )
          }
          return {
            items: newItems,
            ...calculateTotals(newItems),
          }
        })
      },

      removeItem(itemId: string) {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId)
          return {
            items: newItems,
            ...calculateTotals(newItems),
          }
        })
      },

      clearCart() {
        set({ items: [], selectedCustomer: null, subtotal: 0, tax: 0, total: 0, itemCount: 0 })
      },

      setCustomer(customer: POSCustomer | null) {
        set({ selectedCustomer: customer })
      },
    }),
    {
      name: 'pos-cart-storage',
      partialize: () => ({}), // Ne rien persister
    }
  )
)

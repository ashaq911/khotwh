import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size: string | null
  color: string | null
  productId: string
}

interface CartState {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, size: string | null, color: string | null) => void
  updateQuantity: (productId: string, size: string | null, color: string | null, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        set((state) => {
          const existing = state.cart.find(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color
          )
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === item.productId &&
                i.size === item.size &&
                i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { cart: [...state.cart, item] }
        })
      },
      removeFromCart: (productId, size, color) => {
        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        }))
      },
      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          cart: state.cart.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }))
      },
      clearCart: () => set({ cart: [] }),
      totalItems: () => get().cart.reduce((acc, i) => acc + i.quantity, 0),
      totalPrice: () => get().cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: "khotwh-cart" }
  )
)

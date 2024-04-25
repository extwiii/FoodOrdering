import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { randomUUID } from 'expo-crypto'
import { CartItem, Product } from '@/types'
import { useInsertOrder } from '@/api/orders'
import { useRouter } from 'expo-router'
import { Tables } from '@/database.types'
import { useInsertOrderItems } from '@/api/order-items'
import { initialisePaymentSheet, openPaymentSheet } from '@/lib/stripe'

type CartType = {
  items: CartItem[]
  addItem: (product: Product, size: CartItem['size']) => void
  updateQuantity: (itemId: string, amount: -1 | 1) => void
  total: number
  checkout: () => void
}

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
})

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([])

  const router = useRouter()

  const { mutate: insertOrder } = useInsertOrder()
  const { mutate: insertOrderItems } = useInsertOrderItems()

  const addItem = (product: Product, size: CartItem['size']) => {
    const existingItems = items.find(
      (item) => item.product === product && item.size === size
    )
    if (existingItems) {
      updateQuantity(existingItems.id, 1)
      return
    }
    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    }
    setItems([newCartItem, ...items])
  }

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((item) =>
        item.id !== itemId
          ? item
          : { ...item, quantity: item.quantity + amount }
      )
      .filter((item) => item.quantity > 0)
    setItems(updatedItems)
  }

  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  )

  const clearcart = () => {
    setItems([])
  }

  const checkout = async () => {
    await initialisePaymentSheet(Math.floor(total * 100))
    const payed = await openPaymentSheet()

    if (!payed) return

    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    )
  }

  const saveOrderItems = (order: Tables<'orders'>) => {
    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      size: i.size,
    }))
    insertOrderItems(orderItems, {
      onSuccess: () => {
        clearcart()
        router.replace(`/(user)/orders/${order.id}`)
      },
    })
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

export default CartProvider

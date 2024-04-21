import { FlatList } from 'react-native'
import orders from '@/assets/data/orders'
import OrderListItem from '@/components/OrderListItem'

export default function OrderScreen() {
  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <OrderListItem order={item} />}
    />
  )
}

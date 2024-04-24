import { ActivityIndicator, FlatList, Text } from 'react-native'
import OrderListItem from '@/components/OrderListItem'
import { useMyOrderList } from '@/api/orders'

export default function OrderScreen() {
  const { data: orders, isLoading, error } = useMyOrderList()

  if (isLoading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <Text>Failed to fetch products</Text>
  }
  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <OrderListItem order={item} />}
    />
  )
}

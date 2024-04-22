import { ActivityIndicator, FlatList, View, Text } from 'react-native'

// import products from '@/assets/data/products'
import ProductListItem from '@/components/ProductListItem'
import { useProductList } from '@/api/products'

export default function MenuScreen() {
  const { data: products, isLoading, error } = useProductList()

  if (isLoading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <Text>Failed to fetch products</Text>
  }

  return (
    <View>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        keyExtractor={(item) => item.name}
        numColumns={2}
      />
    </View>
  )
}

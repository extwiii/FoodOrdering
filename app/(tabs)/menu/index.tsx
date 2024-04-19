import { FlatList, View } from 'react-native'

import products from '@/assets/data/products'
import ProductListItem from '@/components/ProductListItem'

export default function MenuScreen() {
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

import { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import products from '@/assets/data/products'
import { fallbackURI } from '@/components/ProductListItem'
import Button from '@/components/Button'
import { useCart } from '@/providers/CartProvider'
import { PizzaSize } from '@/types'

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL']

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams()
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M')
  const { addItem } = useCart()
  const rouer = useRouter()

  const addToCart = () => {
    if (!product) return
    addItem(product, selectedSize)
    rouer.push('/cart')
  }

  const product = products.find((p) => p.id.toString() === id)

  if (!product) {
    return <Text>Product not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <Image
        source={{ uri: product.image || fallbackURI }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  subtitle: {
    marginVertical: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default ProductDetailsScreen

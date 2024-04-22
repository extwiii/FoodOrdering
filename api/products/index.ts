import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

export const useProductList = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

export const useInsertProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newProduct: any) => {
      const { error, data } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          image: newProduct.image,
          price: newProduct.price,
        })
        .single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: async (error) => {
      console.log(error)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...update }: Product) => {
      const { data, error } = await supabase
        .from('products')
        .update(update)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (_, { id }: Product) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      await queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
    onError: async (error) => {
      console.log(error)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) {
        throw error
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: async (error) => {
      console.log(error)
    },
  })
}

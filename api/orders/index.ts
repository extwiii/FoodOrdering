import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Tables, InsertTables, UpdateTables } from '@/types'
import { useAuth } from '@/providers/AuthProvider'

type Order = Tables<'orders'>

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ['DELIVERED'] : ['NEW', 'COOKING', 'DELIVERING']
  return useQuery<Order[]>({
    queryKey: ['orders', archived],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

export const useMyOrderList = () => {
  const { session } = useAuth()
  const id = session?.user.id

  return useQuery<Order[] | null>({
    queryKey: ['orders', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        // selecting multiple tables
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

export const useInsertOrder = () => {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  const user_id = session?.user.id

  return useMutation({
    mutationFn: async (newOrder: InsertTables<'orders'>) => {
      const { error, data } = await supabase
        .from('orders')
        .insert({ ...newOrder, user_id })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: async (error) => {
      console.log(error)
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number
      updatedFields: UpdateTables<'orders'>
    }) {
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return updatedOrder
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
      await queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
  })
}

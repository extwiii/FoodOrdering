import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Tables, InsertTables } from '@/types'
import { useAuth } from '@/providers/AuthProvider'

export const useInsertOrderItems = () => {
  return useMutation({
    mutationFn: async (items: InsertTables<'order_items'>[]) => {
      const { error, data } = await supabase
        .from('order_items')
        .insert(items)
        .select()

      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

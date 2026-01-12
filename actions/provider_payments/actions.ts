import { ProviderPayment } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetProviderPayment = (id: string | null) => {
  return useQuery({
    queryKey: ["provider-payment", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/provider_payments/${id}`)
      return data as ProviderPayment
    },
    enabled: !!id,
  })
}
export const useCreateProviderPayment = () => {
  const queryClient = useQueryClient()

  const createPayment = useMutation({
    mutationFn: async (data: Omit<ProviderPayment, "id">) => {
      const res = await axios.post("/api/provider_payments", data)
      return res.data as ProviderPayment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider_payments"] })
      queryClient.invalidateQueries({ queryKey: ["provider"] })
    },
  })

  return { createPayment }
}

export const useUpdateProviderPayment = () => {
  const queryClient = useQueryClient()

  const updatePayment = useMutation({
    mutationFn: async (
      data: Partial<ProviderPayment> & { id: string }
    ) => {
      const { id, ...payload } = data
      const res = await axios.put(`/api/provider_payments/${id}`, payload)
      return res.data as ProviderPayment
    },
    onSuccess: (updatedPayment) => {
      queryClient.invalidateQueries({ queryKey: ["provider_payments"] })
      queryClient.invalidateQueries({
        queryKey: ["provider", updatedPayment.providerId],
      })
    },
  })

  return { updatePayment }
}



  
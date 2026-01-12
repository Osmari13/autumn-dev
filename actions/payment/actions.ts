import { Payment } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
 
  const createMutation = useMutation({
    mutationFn: async (values: {
      reference_number: string,
      amount: number,
      payMethod: string,
      transactionId: string,
      registered_by: string | null,
      paidAt: Date
      image?: string | null
    }) => {
      const res= await axios.post(`/api/payments`, {
        ...values
      });
    
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pago Realizado!", {
        description: "¡El pago se registro correctamente!",
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.message || "Error al registrar el pago",
      });
    },
  });

  return {
    createPayment: createMutation
  };
};

export const useGetPaymentsByTransactions = (transactionId: string | null) => {
  const paymentsQuery = useQuery({
    queryKey: ["payments", transactionId],
    queryFn: async () => {
      const {data} = await axios.get(`/api/payments/${transactionId}`); // Adjust the endpoint as needed
      return data as Payment[];
    }
  });
  return {
    data: paymentsQuery.data,
    loading: paymentsQuery.isLoading,
    error: paymentsQuery.isError // Function to call the query
  };
};
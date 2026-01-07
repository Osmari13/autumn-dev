import { Payment, Transaction } from "@/types";
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


// export const useDeleteTransaction = () => {

//   const queryClient = useQueryClient();

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       await axios.delete(`/api/transactions/${id}`); // Include ID in the URL
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       toast.success("¡Eliminado!", {
//         description: "¡Las Transaccion ha sido eliminada correctamente!"
//       });
//     },
//     onError: () => {
//       toast.error("Oops!", {
//         description: "¡Hubo un error al eliminar la Transaccion!"
//       });
//     },
//   });

//   return {
//     deleteTransaction: deleteMutation,
//   };
// };

  

  // export const useUpdateTransaction = () => {

  //   const queryClient = useQueryClient();

  //   const updateMutation = useMutation({
  //     mutationFn: async (values: {
  //       id: string;             
  //       name: string,
  //       quantity: number,
  //       subtotal: number,
  //       total: number,
  //       payMethods: string,
  //       status: string,
  //       clientId: string,
  //       articleId: string,
  //       registered_by: string,
  //       transaction_date: Date ,
  //       updated_by?: string | null
  //     }) => {
  //       await await axios.patch(`/api/transactions/${values.id}`, {
  //           ...values

  //       });
  //     },
  //     onSuccess: () => {
  //       // Invalidate the 'transactions' query to refresh the data
  //       queryClient.invalidateQueries({ queryKey: ["transactions"] });
  //       toast.success("¡Actualizado!", {
  //         description: "¡La transaccion ha sido actualizada correctamente!",
  //       });
  //     },
  //     onError: (error: Error) => {
  //       toast.error("Oops!", {
  //         description: `¡Hubo un error al actualizar la transaccion!: ${error}`,
  //       });
  //     },
  //   });

  //   return {
  //     updateTransaction: updateMutation, // Function to call the mutation
  //   };
  // };


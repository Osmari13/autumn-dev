import { Transaction } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
      mutationFn: async (values: {
        name: string,
        quantity: number,
        subtotal: number,
        total: number,
        payMethods: string,
        status: string,
        clientId: string,
        articleId: string,
        registered_by: string,
        transaction_date: Date
      }) => {
          const res = await axios.post(`/api/transactions`, {
            ...values
          });
          return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("¡Creado!", {
        description: "¡La transacción ha sido creada correctamente!",
        dismissible: true,
      })
    },
    onError: (error: Error) => {
      toast.error("Oops!", {
        description: `¡Hubo un error al crear la transacción!: ${error}`,
      });
    },
  });

  return {
    createTransaction: createMutation
  };
};


export const useGetTransactions = () => {
  const transactionQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const {data} = await axios.get('/api/transactions'); // Adjust the endpoint as needed
      return data as Transaction[];
    }
  });
  return {
    data: transactionQuery.data,
    loading: transactionQuery.isLoading,
    error: transactionQuery.isError // Function to call the query
  };
};

export const useGetTransaction = (id: string | null) => {
  const transactionQuery = useQuery({
    queryKey: ["transaction"],
    queryFn: async () => {
      const {data} = await axios.get(`/api/transactions/${id}`); // Adjust the endpoint as needed
      return data as Transaction;
    },
    enabled: !!id
  });
  return {
    data: transactionQuery.data,
    loading: transactionQuery.isLoading,
    error: transactionQuery.isError // Function to call the query
  };
};

export const useDeleteTransaction = () => {

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/transactions/${id}`); // Include ID in the URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("¡Eliminado!", {
        description: "¡Las Transaccion ha sido eliminada correctamente!"
      });
    },
    onError: () => {
      toast.error("Oops!", {
        description: "¡Hubo un error al eliminar la Transaccion!"
      });
    },
  });

  return {
    deleteTransaction: deleteMutation,
  };
};



  export const useUpdateTransaction = () => {

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
      mutationFn: async (values: {
        id: string;             
        name: string,
        quantity: number,
        subtotal: number,
        total: number,
        payMethods: string,
        status: string,
        clientId: string,
        articleId: string,
        registered_by: string,
        transaction_date: Date
      }) => {
        await await axios.patch(`/api/transactions/${values.id}`, {
            ...values

        });
      },
      onSuccess: () => {
        // Invalidate the 'transactions' query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        toast.success("¡Actualizado!", {
          description: "¡La transaccion ha sido actualizada correctamente!",
        });
      },
      onError: (error: Error) => {
        toast.error("Oops!", {
          description: `¡Hubo un error al actualizar la transaccion!: ${error}`,
        });
      },
    });

    return {
      updateTransaction: updateMutation, // Function to call the mutation
    };
  };


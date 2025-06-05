import { Article } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useGetArticles = () => {
  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const {data} = await axios.get('/api/articles'); // Adjust the endpoint as needed
      return data as Article[];
    }
  });
  return {
    data: articlesQuery.data,
    loading: articlesQuery.isLoading,
    error: articlesQuery.isError // Function to call the query
  };
};


export const useGetArticle = (id: string | null) => {
  const articleQuery = useQuery({
    queryKey: ["article"],
    queryFn: async () => {
      const {data} = await axios.get(`/api/articles/${id}`); // Adjust the endpoint as needed
      return data as Article;
    },
    enabled: !!id
  });
  return {
    data: articleQuery.data,
    loading: articleQuery.isLoading,
    error: articleQuery.isError // Function to call the query
  };
};


export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (values: {           // ID of the branch to be updated
       name:string
        description :string | null
        serial :string 
        quantity: number
        priceUnit: number
        price :number
        image: string
        tag:  string | null
        providerId :string
        categoryId :string 
        registered_by :string 
    }) => {
      await axios.post(`/api/articles`, {
        name: values.name,
        description: values.description ?? null,
        serial: values.serial,
        quantity: values.quantity,
        priceUnit: values.priceUnit,
        price: values.price,
        image: values.image,
        tag: values.tag ?? null,
        providerId: values.providerId,
        categoryId: values.categoryId,
        registered_by: values.registered_by,
      });
    },
    onSuccess: () => {
      // Invalidate the 'articles' query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("¡Creado!", {
        description: "¡La sucursal ha sido creada correctamente!",
        dismissible: true,
      })
    },
    onError: (error: Error) => {
      toast.error("Oops!", {
        description: `¡Hubo un error al crear la sucursal!: ${error}`,
      });
    },
  });

  return {
    createArticle: createMutation, // Function to call the mutation
  };
};


export const useDeleteBranch = () => {

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/articles/${id}`); // Include ID in the URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("¡Eliminado!", {
        description: "¡La sucursal ha sido eliminada correctamente!"
      });
    },
    onError: () => {
      toast.error("Oops!", {
        description: "¡Hubo un error al eliminar la sucursal!"
      });
    },
  });

  return {
    deleteBranch: deleteMutation,
  };
};



  export const useUpdateBranch = () => {

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
      mutationFn: async (values: {
        id: string;               // ID of the branch to be updated
        location_name: string;    // New location name
        fiscal_address: string | null; // New fiscal address
      }) => {
        await await axios.patch(`/api/articles/${values.id}`, {
            id: values.id,
            location_name: values.location_name,
            fiscal_address: values.fiscal_address ?? null

        });
      },
      onSuccess: () => {
        // Invalidate the 'articles' query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast.success("¡Actualizado!", {
          description: "¡La sucursal ha sido actualizada correctamente!",
        });
      },
      onError: (error: Error) => {
        toast.error("Oops!", {
          description: `¡Hubo un error al actualizar la sucursal!: ${error}`,
        });
      },
    });

    return {
      updateBranch: updateMutation, // Function to call the mutation
    };
  };

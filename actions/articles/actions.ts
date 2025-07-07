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
        image: string | null
        tag:  string | null
        providerId :string
        categoryId :string 
        registered_by :string 
    }) => {
     const res= await axios.post(`/api/articles`, {
        ...values
     });
      return res
    },
    onSuccess: () => {
      // Invalidate the 'articles' query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("¡Creado!", {
        description: "¡El Articulo ha sido creada correctamente!",
        dismissible: true,
      })
    },
    onError: (error: Error) => {
      toast.error("Oops!", {
        description: `¡Hubo un error al crear el articulo!: ${error}`,
      });
    },
  });

  return {
    createArticle: createMutation, // Function to call the mutation
  };
};


export const useDeleteArticle = () => {

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/articles/${id}`); // Include ID in the URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("¡Eliminado!", {
        description: "¡El Articulo ha sido eliminada correctamente!"
      });
    },
    onError: () => {
      toast.error("Oops!", {
        description: "¡Hubo un error al eliminar El Articulo!"
      });
    },
  });

  return {
    deleteArticle: deleteMutation,
  };
};



  export const useUpdateArticle = () => {

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
      mutationFn: async (values: {
        id: string;               // ID of the branch to be updated
        name: string;               // ID of the branch to be updated
        description :string | null
        serial :string 
        quantity: number
        priceUnit: number
        price :number
        image: string | null
        tag:  string | null
        providerId :string
        categoryId :string 
        updated_by :string | null
      }) => {
        await await axios.patch(`/api/articles/${values.id}`, {
            ...values

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
      updateArticle: updateMutation, // Function to call the mutation
    };
  };

import { Category } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetCategory = (id: string | null) => {
    const categoryQuery = useQuery({
      queryKey: ["category"],
      queryFn: async () => {
        const {data} = await axios.get(`/api/categories/${id}`); // Adjust the endpoint as needed
        return data as Category;
      },
      enabled: !!id
    });
    return {
      data: categoryQuery.data,
      loading: categoryQuery.isLoading,
      error: categoryQuery.isError // Function to call the query
    };
  };



  export const useGetCategories= () => {
    const categoriesQuery = useQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const {data} = await axios.get('/api/categories'); // Adjust the endpoint as needed
        return data as Category[];
      }
    });
    return {
      data: categoriesQuery.data,
      loading: categoriesQuery.isLoading,
      error: categoriesQuery.isError // Function to call the query
    };
  };

  export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const createMutation = useMutation({
      mutationFn: async (values: {           // ID of the branch to be updated
        name: string;    // New location name
        description: string | null;
     // New location name
      }) => {
        const res = await axios.post(`/api/categories`, {
          ...values
        });

        return res
      },
      onSuccess: () => {
        // Invalidate the 'branches' query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("¡Creado!", {
          description: "¡la categoria ha sido creada correctamente!",
          dismissible: true,
        })
      },
      onError: (error: any) => {
        toast.error("Oops!", {
          description: `¡Hubo un error al crear la categoria! ${error.response.data.message}`,
        });
      },
    });

    return {
      createCategory: createMutation, // Function to call the mutation
    };
  };

  export const useDeleteCategory = () => {

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        await axios.delete(`/api/categories/${id}`); // Include ID in the URL
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("¡Eliminado!", {
          description: "¡La categoria ha sido eliminado correctamente!"
        });
      },
      onError: () => {
        toast.error("Oops!", {
          description: "¡Hubo un error al eliminar La categoria!"
        });
      },
    });

    return {
      deleteCategory: deleteMutation,
    };
  };


  export const useUpdateCategory = () => {

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
      mutationFn: async (values: {
        id: string,
        name :  string
        description: string | null
      }) => {
        await await axios.patch(`/api/categories/${values.id}`, {
            name: values.name,
            description: values.description ?? null,
        });
      },
      onSuccess: () => {
        // Invalidate the 'branches' query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("¡Actualizado!", {
          description: "¡La categoria ha sido actualizada correctamente!",
        });
      },
      onError: (error: Error) => {
        toast.error("Oops!", {
          description: `¡Hubo un error al actualizar La categoria!: ${error}`,
        });
      },
    });

    return {
      updateCategory: updateMutation, // Function to call the mutation
    };
  };

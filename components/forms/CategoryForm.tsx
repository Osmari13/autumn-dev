'use client';
import { useGetClients } from "@/actions/clients/actions";
import { useCreateCategory, useGetCategory,  useUpdateCategory } from "@/actions/categories/actions";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { Category} from "@/types";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string(),
  // dni_type: z.enum(["V", "J", "E", "PARTIDA_NACIMIENTO"]),
  description: z.string().optional(),
});

interface FormProps {
  onClose: () => void;
  isEditing?: boolean;
  id?: string,
}

const CategoryForm = ({ id, onClose, isEditing = false }: FormProps) => {

  const [initialValues, setInitialValues] = useState<Category | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name,
      description: initialValues?.description ?? ""
    },
  });
  const [openClient, setOpenClient] = useState(false)
  const { data: clients, loading: clientsLoading, error: clientsError } = useGetClients();
  const { data: category } = useGetCategory(id ?? null);
  const { createCategory } = useCreateCategory()
  const { updateCategory } = useUpdateCategory()

  useEffect(() => {
    if (category) {
      setInitialValues(category);
      form.setValue("name", category.name);
      form.setValue("description", category.description ?? "");
 
    }
  }, [category, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && initialValues) {
        await updateCategory.mutateAsync({
          id: initialValues.id,
          ...values,
          description: values.description ?? null,
        });
      } else {
        await createCategory.mutateAsync({
          ...values,
          description: values.description ?? null,
        });
      }
      form.reset(); // Reset form after successful submission
      onClose();
    } catch (error) {
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col max-w-7xl mx-auto mt-4 space-y-6">
          {/* FORMULARIO */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 gap-6 place-items-center w-full mx-auto mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Nombre de la categoria</FormLabel>
                    <FormControl>
                      <Input className="w-[200px] shadow-none border-b-1 border-r-0 border-t-0 border-l-0" placeholder="Aretes" {...field} />
                    </FormControl>
                    <FormDescription>
                      El nombre identificador de la categoria
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Descripcion</FormLabel>
                    <FormControl>
                      <Textarea className="w-[300px] shadow-none resize-none" placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button disabled={createCategory.isPending || updateCategory.isPending} type="submit">
            {isEditing ? "Actualizar Categoria" : "Registrar Categoria"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CategoryForm;

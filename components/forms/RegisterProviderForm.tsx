'use client';

import { useCreateProvider, useGetProvider, useUpdateProvider } from "@/actions/providers/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Provider } from "@/types";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const formSchema = z.object({
  name: z.string(),
  first_name:  z.string().optional(),
  last_name:   z.string().optional(),
  phone_number:  z.string().optional(),
});

interface FormProps {
  onClose: () => void;
  isEditing?: boolean;
  id?: string,
}

const RegisterProviderForm = ({ id, onClose, isEditing = false }: FormProps) => {
  const [initialValues, setInitialValues] = useState<Provider | null>(null);
  const { updateProvider } = useUpdateProvider();
  const { createProvider } = useCreateProvider();
  const { data } = useGetProvider(id ?? null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { // Set default values for editing
      name: "",
      first_name:  "",
      last_name:   "",
      phone_number:  "",// Ensure this is an empty string instead of null
    },
  });

  useEffect(() => {
    if (data && isEditing) {
      setInitialValues(data)
      form.setValue("name", data.name)
      form.setValue("first_name", data.first_name ?? "")
      form.setValue("last_name", data.last_name ?? "")
      form.setValue("phone_number", data.phone_number ?? "")
    }
  }, [data, form, isEditing])



  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && initialValues) {
        await updateProvider.mutateAsync({
          id: initialValues.id,
          name: initialValues.name.toUpperCase(),
          first_name: initialValues.first_name ?? null,
          last_name: initialValues.last_name ?? null,
          phone_number: initialValues.phone_number ?? "",
        });
      } else {
        await createProvider.mutateAsync({
          name: values.name.toUpperCase(),
          first_name: values.first_name ?? null,
          last_name: values.last_name ?? null,
          phone_number: values.phone_number ?? "",
        });
      }
      form.reset(); // Reset form after successful submission
      // setInitialValues(null)
      // onClose();
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error("Error al guardar la proveedor", {
        description: "Ocurrió un error, por favor intenta nuevamente.",
      });
    } finally {
      onClose()
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto grid gap-6">
        <div className="grid gap-4">
          <div className="flex gap-2 w-full justify-center">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Nro. de de Telefono</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0424****" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center items-center">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-auto">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-auto">
                  <FormLabel>Primer Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Primer Nombre del proveedor (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="w-auto">
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Apellido del proveedor (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
         

          </div>
          <Button disabled={createProvider.isPending || updateProvider.isPending} type="submit" className="w-full">
            {createProvider.isPending || updateProvider.isPending ? <Loader2 className='size-4 animate-spin' /> : <p>{isEditing ? "Actualizar" : "Registrar"}</p>}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RegisterProviderForm;

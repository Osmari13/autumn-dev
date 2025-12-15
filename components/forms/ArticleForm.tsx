'use client';

import { useGetProviders } from "@/actions/providers/actions";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn, convertAmountToMiliunits } from "@/lib/utils";
import Image from "next/image";
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Check, ChevronsUpDown, Loader2, RotateCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';
import { CreateClientDialog } from "../dialogs/CreateClientDialog";
import { RegisterProviderDialog } from "../dialogs/RegisterProviderDialog";
import { Button } from '../ui/button';

import { Input } from '../ui/input';


import { AmountInput } from "../misc/AmountInput";

import { Textarea } from "../ui/textarea";
import { Article } from "@/types";
import { useCreateArticle, useGetArticle, useUpdateArticle } from "@/actions/articles/actions";
import { useGetCategories } from "@/actions/categories/actions";
import { RegisterCategoryDialog } from "../dialogs/RegisterCategoryDialog";

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  serial: z.string(),
  quantity: z.string(),
  priceUnit: z.string(),
  price: z.string(),
  image: z.string().optional(),
  tag: z.string().optional(),
  categoryId: z.string(),
  providerId: z.string(),

});

interface FormProps {
  onClose: () => void;
  isEditing?: boolean;
  id?: string,
}


const ArticleForm = ({ id, onClose, isEditing = false }: FormProps) => {
  const [initialValues, setInitialValues] = useState<Article | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name,
      description: initialValues?.description ?? "",
      image: initialValues?.image ?? ""
    },
  });
 
  const { data: session } = useSession()
  const [openProvider, setOpenProvider] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)

  const { data: providers, loading: providersLoading, error: providersError } = useGetProviders()
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useGetCategories()
  const { data } = useGetArticle(id ?? null);
  const { createArticle } = useCreateArticle();
  const { updateArticle } = useUpdateArticle();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { watch, setValue } = form;
  const quantity = watch('quantity');
  const price = watch('price');
  const priceUnit = watch('priceUnit');
 
  /** Precio articulo */
  useEffect(() => {
    const price = (parseFloat(quantity || "0") * parseFloat(priceUnit || "0")).toFixed(2);
    setValue('price', price);

  }, [price, priceUnit, setValue]);

  useEffect(() => {
    if (data) {
      setInitialValues(data)
      form.reset({
        name: data.name,
        description: data.description ?? "",
        serial: data.serial,
        quantity: data.quantity.toString(),
        priceUnit: data.priceUnit.toString(),
        price: data.price.toString(),
        image: data.image ?? "",
        tag: data.tag ?? "",
        providerId: data.provider?.id ?? "",
        categoryId: data.category?.id ?? "",
      });
      setPreviewImage(data.image ?? null);
    }
  }, [data, form]);

  const handleImageUpload = async (file: File) => {
   
    setSelectedFile(file);
    // Crear una URL de objeto para previsualizar la imagen inmediatamente
    setPreviewImage(URL.createObjectURL(file));

  };
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  
    const quantityInMiliunits = convertAmountToMiliunits(parseFloat(values.quantity));
    const priceUnitInMiliunits = convertAmountToMiliunits(parseFloat(values.priceUnit));
    const priceInMiliunits = convertAmountToMiliunits(parseFloat(values.price)); 
    let imageUrl: string | null = values.image || null; 

    // Si hay un archivo nuevo seleccionado, súbelo primero
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        // Envía el archivo a tu API de subida de imágenes
        const uploadResponse = await fetch("/api/upload-image", { // Crea esta API Route
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl; // Asume que tu API devuelve la URL de la imagen
        form.setValue("image", imageUrl ?? ""); // Actualiza el valor del formulario con la URL
      } catch (uploadError) {
        console.error("Error al subir la imagen:", uploadError);
        toast.error("Error al subir la imagen.", {
          description: "No se pudo subir la imagen del artículo.",
        });
        return; // Detener el envío del formulario si falla la subida de la imagen
      }
    }

    function generateTag(name: string): string {
      return name
        .toUpperCase() // convierte a mayúsculas
        .trim() // elimina espacios al inicio y final
        .replace(/\s+/g, "_") // reemplaza espacios por guiones bajos (puedes usar "-" si prefieres)
        .replace(/[^\w_]/g, ""); // elimina caracteres no alfanuméricos ni guion bajo
    }
   
    try {    
      if (isEditing && initialValues) {
        await updateArticle.mutateAsync({
          id: initialValues.id,
          name: values.name.toUpperCase(),
          serial: values.serial,
          image: imageUrl || "",
          tag: generateTag(values.name) || "",
          description: values.description || "",

          categoryId: values.categoryId,
          providerId: values.providerId,
          updated_by: session?.user.username || "",

          quantity: quantityInMiliunits,
          priceUnit: priceUnitInMiliunits,
          price: priceInMiliunits,
        });
      } else {        
        await createArticle.mutateAsync({
          name: values.name.toUpperCase(),
          serial: values.serial,
          image: imageUrl || "",
          tag: generateTag(values.name) || "",
          description: values.description || "",

          categoryId: values.categoryId,
          providerId: values.providerId,
          registered_by: session!.user.username,

          quantity: quantityInMiliunits,
          priceUnit: priceUnitInMiliunits,
          price: priceInMiliunits,

        });
      }
    
      form.reset();
      onClose();
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error("Error al guardar el Articulo", {
        description: "Ocurrió un error, por favor intenta nuevamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(
        onSubmit,
        (errors) => {
          console.log("Errores de validación:", errors);
        }
      )}>
        <div className='flex flex-col gap-6'>            
          <div id="client-provider" className="flex flex-col md:flex-row gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Categoria</FormLabel>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[230px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {
                            categoriesLoading && <Loader2 className="size-4 animate-spin mr-2" />
                          }
                          {field.value
                            ? <p>{categories?.find(
                              (category) => category.id === field.value
                            )?.name}</p>
                            : "Seleccione categoria..."
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>

                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Busque una categoria..." />
                        <RegisterCategoryDialog />
                        <CommandList>
                          <CommandEmpty>No se ha encontrado una categoria.</CommandEmpty>
                          <CommandGroup>
                            {categories?.map((category) => (
                              <CommandItem
                                value={`${category.name}`}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categoryId", category.id)
                                  setOpenCategory(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    category.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {
                                  <p>{category.name}</p>
                                }
                              </CommandItem>
                            ))}
                            {
                              categoriesError && <p className="text-sm text-muted-foreground">Ha ocurrido un error al cargar los datos...</p>
                            }
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Seleccione la categoria
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Proveedor</FormLabel>
                  <Popover open={openProvider} onOpenChange={setOpenProvider}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                   
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {
                            providersLoading && <Loader2 className="size-4 animate-spin mr-2" />
                          }
                          {field.value
                            ? <p>{providers?.find(
                              (provider) => provider.id === field.value
                            )?.name} </p>
                            : "Elige un proveedor..."
                          }

                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>

                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Busque su proveedor..." />
                        <RegisterProviderDialog />
                        <CommandList>
                          <CommandEmpty>No se ha encontrado un proveedor.</CommandEmpty>
                          <CommandGroup>
                            {providers?.map((provider) => (
                              <CommandItem
                                value={`${provider.name}`}
                                key={provider.id}
                                onSelect={() => {
                                  form.setValue("providerId", provider.id)
                                  setOpenProvider(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    provider.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {
                                  <p>{provider.name}</p>
                                }
                              </CommandItem>
                            ))}
                            {
                              providersError && <p className="text-muted-foreground text-sm">Ha ocurrido un error al cargar los datos...</p>
                            }
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Seleccione al proveedor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </div>

          <div className="flex flex-col md:flex-row gap-6">     

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nombre</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-[200px] shadow-none border-b border-r-0 border-t-0 border-l-0" placeholder="Topo" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nombre del articulo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
            <FormField
              control={form.control}
              name="serial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Serial</FormLabel>
                  <FormControl>
                    <Input className="w-[200px] shadow-none border-b-1 border-r-0 border-t-0 border-l-0" placeholder="AS1235" {...field} />
                  </FormControl>
                  <FormDescription>
                    Serial del articulo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                   
          
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">    
     
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number"  {...field} placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Precio Unitario</FormLabel>
                    <FormControl>
                      <AmountInput {...field} placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Precio total</FormLabel>
                    <FormControl>
                      <AmountInput {...field} placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />          

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Imagen del Artículo</FormLabel>
                  <FormControl>
                    {/* Usamos un input de tipo file, y gestionamos el valor manualmente */}
                    <Input
                      type="file"
                      accept="image/*" // Solo acepta archivos de imagen
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file); // Función para manejar la subida
                        }
                      }}
                  
                    />
                  </FormControl>
                  {/* Previsualización de la imagen */}
                  {previewImage && (
                    <div className="mt-2">
                      <Image
                        src={previewImage}
                        alt="Previsualización de la imagen"
                        width={150}
                        height={150}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <FormDescription>
                    Sube una imagen para el artículo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="font-bold">Observaciones</FormLabel>
                  <FormControl>
                    <Textarea className="w-full min-w-[80px] shadow-none" placeholder="..." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

          </div>         
          
          <Button disabled={createArticle.isPending ||updateArticle.isPending} type="submit" className="w-full">
                {createArticle.isPending ||updateArticle.isPending ? <Loader2 className='size-4 animate-spin' /> : <p>{isEditing ? "Actualizar" : "Registrar"}</p>}
          </Button>
          
        </div>
      </form>
    </Form >
  );
}

export default ArticleForm;

'use client';

import { useGetProviders } from "@/actions/providers/actions";

import { Calendar } from "@/components/ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, convertAmountToMiliunits } from "@/lib/utils";

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { CalendarIcon, Check, ChevronsUpDown, Loader2, RotateCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';
import { CreateClientDialog } from "../dialogs/CreateClientDialog";
import { RegisterProviderDialog } from "../dialogs/RegisterProviderDialog";
import { RegisterRouteDialog } from "../dialogs/RegisterRouteDialog";
import { Button } from '../ui/button';
import { Checkbox } from "../ui/checkbox";
import { Input } from '../ui/input';


import { CreateBranchDialog } from "../dialogs/CreateBranchDialog";
import { AmountInput } from "../misc/AmountInput";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Article } from "@/types";
import { useCreateArticle, useGetArticle } from "@/actions/articles/actions";
import { useGetCategories } from "@/actions/categories/actions";

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
  registered_by: z.string()

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
      description: initialValues?.description ?? ""
    },
  });

  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [openProvider, setOpenProvider] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)

  const { data: providers, loading: providersLoading, error: providersError } = useGetProviders()
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useGetCategories()
  const { data } = useGetArticle(id ?? null);
  const { createArticle } = useCreateArticle();


  const { watch, setValue } = form
  const quantity = watch('quantity')
  const price = watch('price')
  const priceUnit = watch('price')

  const onResetArticleForm = () => {
    form.reset()
  }
 
  /** Transaccion */
  useEffect(() => {
    const price = (parseFloat(quantity || "0") * parseFloat(priceUnit || "0")).toFixed(2);
    setValue('price', price);

  }, [price, priceUnit, setValue]);

  useEffect(() => {
    if (data && isEditing) {
      setInitialValues(data)
      form.setValue("name", data.name)
      form.setValue("description", data.description ?? "")
      form.setValue("serial", data.serial )
      form.setValue("quantity", data.quantity.toString());
      form.setValue("priceUnit", data.priceUnit.toString());
      form.setValue("price", data.price.toString());
      form.setValue("image", data.image )
      form.setValue("tag", data.tag ?? "")
      form.setValue("providerId", data.provider?.id )
      form.setValue("categoryId", data.category?.id )
    }
  }, [data, form, isEditing])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const quantityInMiliunits = convertAmountToMiliunits(parseFloat(values.quantity))
    const priceUnitInMiliunits = convertAmountToMiliunits(parseFloat(values.priceUnit))
    const priceInMiliunits = convertAmountToMiliunits(parseFloat(values.price))

    
    try {    
        
      await createArticle.mutateAsync({
        name: values.name.toUpperCase(),
        serial: values.serial,
        image: values.image || "",
        tag: values.tag || "",
        description: values.description || "",

        categoryId:  values.categoryId ,
        providerId: values.providerId,
        registered_by: session?.user.username || "",

        quantity: quantityInMiliunits,
        priceUnit: priceUnitInMiliunits,
        price: priceInMiliunits,

      })
      
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error("Error al guardar el Articulo", {
        description: "Ocurrió un error, por favor intenta nuevamente.",
      });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col max-w-7xl mx-auto mt-4 space-y-6'>

            {/* CLIENTE / PROVEEDOR */}
            <div id="client-provider" className="flex flex-col lg:flex-row gap-8">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Cliente</FormLabel>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
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
                            categoriesLoading && <Loader2 className="size-4 animate-spin mr-2" />
                          }
                          {field.value
                            ? <p>{categories?.find(
                              (category) => category.id === field.value
                            )?.name} - {categories?.find(
                              (category) => category.id === field.value
                            )?.description}</p>
                            : "Seleccione la categoria..."
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>

                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Busque un cliente..." />
                        <CreateClientDialog />
                        <CommandList>
                          <CommandEmpty>No se ha encontrado un cliente.</CommandEmpty>
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
         
           {/* FORMULARIO DEL PASAJERO */}
           <div className='flex flex-col'>
            <h1 className='text-3xl font-bold italic flex items-center gap-2'>Info. del Pasajero <RotateCw onClick={() => onResetArticleForm()} className="size-4 cursor-pointer hover:animate-spin" /></h1>
            <Separator className='w-56' />
            <div id="passanger-info-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-content-center w-full mx-auto mt-4">
              <div id="dni-number">
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
              </div>
              
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
          </div>

     
          {/* FORMULARIO DE  TRANSACTION*/}

          <div className="flex flex-col ">
            <h1 className='text-3xl font-bold italic flex items-center gap-3'>Info. del Transaccion <RotateCw onClick={() => onResetArticleForm()} className="size-4 cursor-pointer hover:animate-spin" /></h1>
            <Separator className='w-57' />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-content-center w-full mx-auto mt-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Cantidad</FormLabel>
                    <FormControl>
                      <AmountInput  {...field} placeholder="0.00" />
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
            
          </div>
          <div className="flex flex-col items-center">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Observaciones</FormLabel>
                  <FormControl>
                    <Textarea className="w-[850px] shadow-none" placeholder="..." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          
          <Button disabled={createArticle.isPending} type="submit">Crear ticket</Button>
        </div>
      </form>
    </Form >
  );
}

export default ArticleForm;

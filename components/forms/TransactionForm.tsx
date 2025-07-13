'use client';

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
import { cn, convertAmountFromMiliunits, convertAmountToMiliunits } from "@/lib/utils";

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

import { Button } from '../ui/button';
import { AmountInput } from "../misc/AmountInput";
import { Article, Transaction } from "@/types";
import {useGetArticle } from "@/actions/articles/actions";
import { useGetClients } from "@/actions/clients/actions";
import { useCreateTransaction, useGetTransaction } from "@/actions/transactions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "../ui/calendar";
import { Input } from '../ui/input';

const formSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  subtotal: z.string(),
  total: z.string(),
  payMethods: z.string(),
  status: z.string(),
  clientId: z.string(),
  articleId: z.string(),
  transaction_date: z.date(),
  registered_by: z.string(),
  priceArticle: z.string(),
});

interface FormProps {
  onClose: () => void;
  isEditing?: boolean;
  id?: string,
}

const TransactionForm = ({ id, onClose, isEditing = false }: FormProps) => {
  const [initialValues, setInitialValues] = useState<Transaction | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name,
    },
  });

  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [openClient, setOpenClient] = useState(false)
  const [openTransactionDate, setOpenTransactionDate] = useState(false)

  const { data: clients, loading: clientsLoading, error: clientsError } = useGetClients()
  const { data: articles } = useGetArticle(id ?? null);
  // const { data } = useGetTransaction(id ?? null);
  const { createTransaction } = useCreateTransaction();

  const { setError, clearErrors, watch, getValues, setValue } = form;
  const quantity = watch('quantity');
  const priceArticle = articles?.priceUnit.toString() ?? "0";
  const nameArticle = articles?.name ?? "";
  const total = watch('total');

  const onResetTransactionForm = () => {
    form.reset()
  }
 
  /** Transaccion */
  useEffect(() => {
    const total = (parseFloat(quantity || "0") * parseFloat(priceArticle || "0")).toFixed(2);

    setValue('subtotal', convertAmountFromMiliunits(parseFloat(priceArticle)).toString());
    setValue('total', convertAmountFromMiliunits(parseFloat(total)).toString());
  }, [quantity, priceArticle, setValue]);

  // Mostrar error quantity mientras escribe
  useEffect(() => {
    if (!articles) return;

    const articleQuantity = convertAmountFromMiliunits(articles.quantity ?? 0); // número
    const numericQuantity = Number(quantity); // número

    if (numericQuantity > articleQuantity) {
      console.log(articleQuantity, numericQuantity);
      setError("quantity", {
        type: "manual",
        message: `Supera la cantidad de artículos en stock (${articleQuantity})`,
      });
    } else {
      clearErrors("quantity");
    }
  }, [quantity, articles]);

  // useEffect(() => {
  //   if (data && isEditing) {
  //     setInitialValues(data)
  //     form.setValue("name", data.name)
  //     form.setValue("description", data.description ?? "")
  //     form.setValue("serial", data.serial )
  //     form.setValue("quantity", data.quantity.toString());
  //     form.setValue("priceUnit", data.priceUnit.toString());
  //     form.setValue("price", data.price.toString());
  //     form.setValue("image", data.image )
  //     form.setValue("tag", data.tag ?? "")
  //     form.setValue("providerId", data.provider?.id )
  //     form.setValue("categoryId", data.category?.id )
  //   }
  // }, [data, form, isEditing])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const quantityInMiliunits = convertAmountToMiliunits(parseFloat(values.quantity));
    const subtotalInMiliunits = convertAmountToMiliunits(parseFloat(values.subtotal));
    const totalInMiliunits = convertAmountToMiliunits(parseFloat(values.total));

    
    try {  
      if (articles && values.quantity > articles?.quantity.toString()) {
        setError("quantity", {
          type: "manual",
          message: `Supera la cantidad de artículos en stock (${quantityInMiliunits})`,
        });
        return;
      }
        
      await createTransaction.mutateAsync({
        name: values.name.toUpperCase(),
        quantity: quantityInMiliunits,
        subtotal:subtotalInMiliunits,
        total: totalInMiliunits,
        payMethods: values.payMethods,
        transaction_date: values.transaction_date,
        status:values.status,
        clientId:  values.clientId ,
        articleId: articles?.id ?? "",
        registered_by: session?.user.username || "",
      })
      
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error("Error al guardar la transaccion", {
        description: "Ocurrió un error, por favor intenta nuevamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col max-w-7xl mx-auto mt-4 space-y-6'>

            <h1>{nameArticle}</h1>
            <div id="client-provider" className="flex flex-col lg:flex-row gap-8">
            
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Cliente</FormLabel>
                  <Popover open={openClient} onOpenChange={setOpenClient}>
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
                            clientsLoading && <Loader2 className="size-4 animate-spin mr-2" />
                          }
                          {field.value
                            ? <p>{clients?.find(
                              (client) => client.id === field.value
                            )?.first_name} {clients?.find(
                              (client) => client.id === field.value
                            )?.last_name} </p>
                            : "Elige un cliente..."
                          }

                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>

                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Busque su cliente..." />
                        <CreateClientDialog />
                        <CommandList>
                          <CommandEmpty>No se ha encontrado un cliente.</CommandEmpty>
                          <CommandGroup>
                            {clients?.map((client) => (
                              <CommandItem
                                value={`${client.first_name}`}
                                key={client.id}
                                onSelect={() => {
                                  form.setValue("clientId", client.id)
                                  setOpenClient(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    client.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {
                                  <p>{client.first_name}</p>
                                }
                              </CommandItem>
                            ))}
                            {
                              clientsError && <p className="text-muted-foreground text-sm">Ha ocurrido un error al cargar los datos...</p>
                            }
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Seleccione al cliente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </div>
         
          {/* FORMULARIO DE  TRANSACTION*/}

          <div className="flex flex-col ">
            <RotateCw onClick={() => onResetTransactionForm()} className="size-4 cursor-pointer hover:animate-spin" />
             <FormField
              control={form.control}
              name="transaction_date"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel className="font-bold">Fecha de transaccion</FormLabel>
                  <Popover open={openTransactionDate} onOpenChange={setOpenTransactionDate}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-auto pl-3 text-left font-normal shadow-none border-b-1 border-r-0 border-t-0 border-l-0 bg-transparent",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {
                              locale: es
                            })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(e) => {
                          field.onChange(e)
                          setOpenTransactionDate(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Fecha de compra del boleto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
     
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 place-content-center w-full mx-auto mt-4">
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
                name="subtotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Subtotal (precio)</FormLabel>
                    <FormControl>
                      <AmountInput {...field} placeholder="0.00" disabled/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Total</FormLabel>
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
                name="payMethods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Metodo de Pago</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={cn("w-[200px] shadow-none border-b-1 border-r-0 border-t-0 border-l-0", field.value ? "font-bold" : "")}>
                          <SelectValue placeholder="Seleccione el metodo de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PAGO_MOVIL">PAGO MOVIL</SelectItem>
                        <SelectItem value="EFECTIVO">EFECTIVO</SelectItem>
                        <SelectItem value="TRANSFERENCIA">TRANSFERENCIA</SelectItem>
                        
                      </SelectContent>
                    </Select>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

          </div>
          
          <Button disabled={createTransaction.isPending} type="submit">Crear ticket</Button>
        </div>
      </form>
    </Form >
  );
}

export default TransactionForm;

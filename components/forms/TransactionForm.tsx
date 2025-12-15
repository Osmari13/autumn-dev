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
import { Article, Transaction, TransactionItem, TransactionItemForm } from "@/types";
import {useGetArticle, useGetArticles } from "@/actions/articles/actions";
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
import { RegisterArticleDialog } from "../dialogs/RegisterArticleDialog";

const formSchema = z.object({
  reference: z.string().optional(),
  subtotal: z.string(),
  total: z.string(),
  payMethods: z.string(),
  status: z.string(),
  clientId: z.string(),
  transaction_date: z.date(),
  registered_by: z.string(),
  // NUEVO: array de artículos
  items: z.array(z.object({
    articleId: z.string(),
    quantity: z.string().min(1, "Cantidad requerida"),
    priceUnit: z.string(),
    subtotal: z.string(),
  })).min(1, "Debe agregar al menos un artículo")
})



interface FormProps {
  onClose: () => void;
  isEditing?: boolean;
  id?: string,
}

const TransactionForm = ({ id, onClose, isEditing = false }: FormProps) => {
  const [initialValues, setInitialValues] = useState<Transaction | null>(null);
  const [items, setItems] = useState<TransactionItemForm[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [quantityInput, setQuantityInput] = useState<number>(1);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference: "",
      subtotal: "0",
      total: "0",
      payMethods: "PAGO_MOVIL",
      status: "PENDIENTE",
      clientId: "",
      transaction_date: new Date(),
      registered_by: "",
      items: []
    }
  });

  const { data: session } = useSession()
  const [openClient, setOpenClient] = useState(false)
  const [openArticle, setOpenArticle] = useState(false)
  const [openTransactionDate, setOpenTransactionDate] = useState(false)

  const { data: clients, loading: clientsLoading, error: clientsError } = useGetClients();
  const { data } = useGetTransaction(id ?? null);
  const { data: articles, loading: articlesLoading, error: articlesError } = useGetArticles();
  

  const { createTransaction } = useCreateTransaction();
  // const articleId = form.watch('articleId');
  // const { data: articleData } = useGetArticle(articleId ?? null);
  const { setError, clearErrors, watch, getValues, setValue } = form;

  const onResetTransactionForm = () => {
    form.reset()
  }
 
  const addArticleToTransaction = (articleId: string, quantity: number) => {
    const existing = items.find(item => item.articleId === articleId);
    if (existing) {
      // Actualizar cantidad si ya existe
      setItems(items.map(item => 
        item.articleId === articleId 
          ? { ...item, quantity }
          : item
      ));
    } else {
      // Agregar nuevo artículo
      const article = articles?.find(a => a.id === articleId);
      if (article) {
        setItems([...items, {
          articleId,
          quantity,
          priceUnit: article.priceUnit,
          subtotal: article.priceUnit * quantity
        }]);
      }
    }
  };
  
  useEffect(() => {
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    form.setValue("subtotal", subtotal.toFixed(2));
    form.setValue("total", subtotal.toFixed(2));
  }, [items, form]);
  useEffect(() => {
    form.setValue(
      "items",
      items.map(item => ({
        articleId: item.articleId,
        quantity: item.quantity.toString(),
        priceUnit: item.priceUnit.toFixed(2),
        subtotal: item.subtotal.toFixed(2),
      }))
    );
  }, [items, form]);

const removeArticle = (articleId: string) => {
  setItems(items.filter(item => item.articleId !== articleId));
  updateTotals();
};

const updateTotals = () => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  form.setValue('subtotal', subtotal.toFixed(2));
  form.setValue('total', subtotal.toFixed(2)); // + impuestos si aplica
};

  // /** Transaccion */
  // useEffect(() => {
  //   const total = (parseFloat(quantity || "0") * parseFloat(priceArticle || "0")).toFixed(2);

  //   setValue('subtotal', convertAmountFromMiliunits(parseFloat(priceArticle)).toString());
  //   setValue('total', convertAmountFromMiliunits(parseFloat(total)).toString());
  // }, [quantity, priceArticle, setValue]);

  // // Mostrar error quantity mientras escribe
  // useEffect(() => {
  //   if (!articleData) return;

  //   const articleQuantity = convertAmountFromMiliunits(articleData.quantity ?? 0); // número
  //   const numericQuantity = Number(quantity); // número

  //   if (numericQuantity > articleQuantity) {
  //     console.log(articleQuantity, numericQuantity);
  //     setError("quantity", {
  //       type: "manual",
  //       message: `Supera la cantidad de artículos en stock (${articleQuantity})`,
  //     });
  //   } else {
  //     clearErrors("quantity");
  //   }
  // }, [quantity, articleData]);

  // useEffect(() => {
  //   if (data) {
  //     setInitialValues(data)
  //     form.reset({
  //       name: data.name,
  //       quantity: data.quantity.toString(),
  //       total: data.total.toString(),
  //       clientId: data.client?.id ?? "",
  //       articleId: data.article?.id ?? "",
  //     });
     
  //   }
  // }, [data, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
     
      await createTransaction.mutateAsync({
        reference: values.reference?.toUpperCase() || "",
        subtotal: parseFloat(values.subtotal),
        total: parseFloat(values.total),
        payMethods: values.payMethods,
        status: values.status,
        clientId: values.clientId,
        registered_by: session?.user.username || "",
        transaction_date: values.transaction_date,
        items: items.map(item => ({
          articleId: item.articleId,
          quantity: item.quantity,
          priceUnit: item.priceUnit,
          subtotal: item.subtotal
        }))
      });
      onClose();
    } catch (error) {
      toast.error("Error al guardar la transacción");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <div className="flex flex-col h-full max-w-7xl mx-auto p-6 space-y-6">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
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
                          className={cn("w-full max-w-md justify-between", !field.value && "text-muted-foreground")}
                        >
                          {clientsLoading && <Loader2 className="size-4 animate-spin mr-2" />}
                          {field.value ? (
                            <p>
                              {clients?.find((client) => client.id === field.value)?.first_name}{" "}
                              {clients?.find((client) => client.id === field.value)?.last_name}{" "}
                            </p>
                          ) : (
                            "Elige un cliente..."
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
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
                                    client.id === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {<p>{client.first_name}</p>}
                              </CommandItem>
                            ))}
                            {clientsError && (
                              <p className="text-muted-foreground text-sm">
                                Ha ocurrido un error al cargar los datos...
                              </p>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Seleccione al cliente</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Artículos</h2>

              <div className="flex flex-col gap-3 mb-4">
                <FormItem className="flex-1">
                  <FormLabel>Seleccionar Artículo</FormLabel>
                  <Popover open={openArticle} onOpenChange={setOpenArticle}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-transparent">
                        {selectedArticleId
                          ? articles?.find((a) => a.id === selectedArticleId)?.name
                          : "Seleccionar artículo"}
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar artículo..." />
                        <CommandList>
                          <CommandEmpty>No hay artículos</CommandEmpty>
                          <CommandGroup>
                            {articles?.map((article) => (
                              <CommandItem
                                key={article.id}
                                value={article.name}
                                onSelect={() => {
                                  setSelectedArticleId(article.id)
                                  setOpenArticle(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedArticleId === article.id ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {article.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <FormLabel>Cantidad</FormLabel>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Cantidad"
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(Number(e.target.value))}
                    />
                  </div>
                  <Button
                    type="button"
                    className="self-end"
                    onClick={() => {
                      if (selectedArticleId && quantityInput > 0) {
                        addArticleToTransaction(selectedArticleId, quantityInput)
                        setQuantityInput(1)
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-[300px] max-h-[400px] overflow-auto border rounded-lg p-4 space-y-2 bg-muted/20">
                {items.map((item) => (
                  <div
                    key={item.articleId}
                    className="flex items-center gap-3 p-3 bg-background border rounded-lg shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{articles?.find((a) => a.id === item.articleId)?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity} × ${item.priceUnit.toFixed(2)} = ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeArticle(item.articleId)}>
                      Quitar
                    </Button>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-center">No hay artículos agregados</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Detalles de Transacción</h2>
                <RotateCw
                  onClick={() => onResetTransactionForm()}
                  className="size-5 cursor-pointer hover:rotate-180 transition-transform duration-300"
                />
              </div>

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Referencia</FormLabel>
                    <FormControl>
                      <Input className="w-[200px] shadow-none border-b-1 border-r-0 border-t-0 border-l-0" placeholder="AS1235" {...field} />
                    </FormControl>
                    <FormDescription>
                      Referecion de la transacción (Ejemplo: AS1235)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 flex-1">
                <FormField
                  control={form.control}
                  name="transaction_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-bold">Fecha de Transacción</FormLabel>
                      <Popover open={openTransactionDate} onOpenChange={setOpenTransactionDate}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
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
                      <FormDescription>Fecha de compra del boleto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subtotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Subtotal</FormLabel>
                        <FormControl>
                          <AmountInput {...field} placeholder="0.00" disabled />
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

                <FormField
                  control={form.control}
                  name="payMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Método de Pago</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione el método de pago" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PAGO_MOVIL">PAGO MÓVIL</SelectItem>
                          <SelectItem value="EFECTIVO">EFECTIVO</SelectItem>
                          <SelectItem value="TRANSFERENCIA">TRANSFERENCIA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <Button disabled={createTransaction.isPending} type="submit" className="w-full h-12 text-lg font-semibold">
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando ticket...
                </>
              ) : (
                "Crear Ticket"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default TransactionForm;

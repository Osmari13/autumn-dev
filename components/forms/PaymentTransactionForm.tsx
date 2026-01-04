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
import { useEffect, useMemo, useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';
import { CreateClientDialog } from "../dialogs/CreateClientDialog";
import { RegisterProviderDialog } from "../dialogs/RegisterProviderDialog";

import { Button } from '../ui/button';
import { AmountInput } from "../misc/AmountInput";
import { Article, Payment, Transaction, TransactionItem, TransactionItemForm } from "@/types";
import {useGetArticle, useGetArticles } from "@/actions/articles/actions";
import { useGetClients, useUpdateClient } from "@/actions/clients/actions";
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
import { hasExternalOtelApiPackage } from "next/dist/build/webpack-config";
import { useCreatePayment, useUpdateStatusTransaction, useUpdateTransaction } from "@/actions/payment/actions";

const formSchema = z.object({

  //Payment details (optional)
  payMethod: z.string().optional(),
  amount: z.string().optional(),
  reference_number: z.string(),
  paidAt: z.date().optional(),
  
})

interface FormProps {
  onClose: () => void;
  id?: string,
  transaction?: Transaction
}

const PaymentTransactionForm = ({ id , transaction, onClose}: FormProps) => {
  const { data: session } = useSession()
  const [openPaidAt, setOpenPaidAt] = useState(false)
  const { updateClient } = useUpdateClient();
  const { updateStatusTransaction } = useUpdateStatusTransaction();
  const { createPayment } = useCreatePayment();
  // const [payments, setPayments] = useState<Payment[]>([]); // pagos nuevos del formulario
  
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {   
      amount: "0.0",
      reference_number: "",
      payMethod: "PAGO_MOVIL",
      paidAt: new Date()
    }
  });


//PROBAR EL AGREGAR EL PAGO Y LA ACTUALIZACION DEL CLIENTE Y TRANSACCION
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!transaction) {
      toast.error("La transacción no está cargada aún");
      return;
    }
    try {
      const registered_by = session?.user.username || "";

      const amount = parseFloat(values.amount || "0");

      const status = amount >= transaction.total ? "PAGADO" : "PENDIENTE";

      const res = await createPayment.mutateAsync({
        transactionId: transaction.id,
        reference_number: values.reference_number,
        amount,
        payMethod: values.payMethod || "PAGO_MOVIL",
        registered_by,
        paidAt: values.paidAt || new Date()
      });
     
      if (res){
        await updateClient.mutateAsync({
          id: transaction.client?.id,
          debt: parseFloat(transaction.total.toString()) - parseFloat(values.amount || "0.0"),
          updated_by: registered_by
        });

        await updateStatusTransaction.mutateAsync({
          id: transaction.id,
          status: status,
          updated_by: registered_by
        });

        toast.success("Pago registrado correctamente");
        onClose(); //
      }
    } catch (error) {
      toast.error("Error al guardar la transacción");
    }
    
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <div className="flex flex-col h-full max-w-7xl mx-auto p-6 space-y-6">
    
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          
            <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Detalles de Venta</h2>
           
              </div>           

              <div className="space-y-4 flex-1">
                
                <h2 className="text-lg font-semibold">Detalles de Pago</h2>
                <FormField
                  control={form.control}
                  name="reference_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Referencia</FormLabel>
                      <FormControl>
                        <Input  autoFocus={false} className="w-[200px] shadow-none border-b-1 border-r-0 border-t-0 border-l-0" placeholder="5678" {...field} />
                      </FormControl>
                      <FormDescription>
                        Numero de referencia para registrar pago del cliente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="paidAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-bold my-2">Fecha de Pago</FormLabel>
                      <Popover open={openPaidAt} onOpenChange={setOpenPaidAt}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
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
                              setOpenPaidAt(false)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Fecha que pago el producto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Monto Pagado</FormLabel>
                    <FormControl>
                      <AmountInput
                        placeholder="0.00"
                        value={field.value ?? ""}                         // siempre string
                        onChange={(val) => {
                          
                          if (val == null) {
                            field.onChange("")                           // vacío si borran todo
                          } else if (field.value === "" || field.value === "0.00") {
                            field.onChange(val)
                          } else {
                            field.onChange(val)
                          }
                        }}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payMethod"
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
            <Button disabled={createPayment.isPending} type="submit" className="w-full h-12 text-lg font-semibold">
              {createPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando Pago...
                </>
              ) : (
                "Crear Pago"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
  
}

export default PaymentTransactionForm;

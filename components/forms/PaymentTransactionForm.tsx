'use client';


import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, convertAmountFromMiliunits, convertAmountToMiliunits } from "@/lib/utils";

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown, Loader2, RotateCw, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';

import { Button } from '../ui/button';
import { Article, Payment, Transaction, TransactionItem, TransactionItemForm } from "@/types";
import { useGetClients, useUpdateClient } from "@/actions/clients/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "../ui/calendar";
import { Input } from '../ui/input';
import { useCreatePayment } from "@/actions/payment/actions";
import Image from "next/image";
import { useUpdateStatusTransaction } from "@/actions/transactions/actions";

const formSchema = z.object({

  //Payment details (optional)
  payMethod: z.string().optional(),
  amount: z.string().optional(),
  reference_number: z.string(),
  paidAt: z.date().optional(),
  image: z.string().nullable().optional(),
  
})

interface FormProps {
  onClose: () => void;
  payments?: Payment[],
  transaction?: Transaction
}

const PaymentTransactionForm = ({ payments , transaction, onClose}: FormProps) => {
  const { data: session } = useSession()
  const [openPaidAt, setOpenPaidAt] = useState(false)
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleImageUpload = async (file: File) => {
   
    setSelectedFile(file);
    // Crear una URL de objeto para previsualizar la imagen inmediatamente
    setPreviewImage(URL.createObjectURL(file));

  };
  const removeImage = () => {
    form.setValue("image", null)
    setPreviewImage(null)
  }

//PROBAR EL AGREGAR EL PAGO Y LA ACTUALIZACION DEL CLIENTE Y TRANSACCION
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let imageUrl: string | null = values.image || null; 

    if (!transaction) {
      toast.error("La transacción no está cargada aún");
      return;
    }
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
    try {
      const paidSoFar = (payments?.reduce((sum, payment) => sum + payment.amount, 0) ) || 0;
      const totalPaid = paidSoFar + parseFloat(values.amount || "0");
      if (totalPaid > transaction.total) {
        toast.error("El monto pagado excede el total de la transacción.");
        return;
      }
      const status = totalPaid == transaction.total ? "PAGADO" : "PENDIENTE";
      const registered_by = session?.user.username || "";

      const amount = parseFloat(values.amount || "0");


      const res = await createPayment.mutateAsync({
        transactionId: transaction.id,
        reference_number: values.reference_number,
        amount,
        payMethod: values.payMethod || "PAGO_MOVIL",
        registered_by,
        paidAt: values.paidAt || new Date()
      });
     
      if (res){

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Referencia */}
        <FormField
          control={form.control}
          name="reference_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">Referencia</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="5678"
                  className="h-9 shadow-none border-b border-r-0 border-t-0 border-l-0"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">Número de referencia del pago</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Pago */}
        <FormField
          control={form.control}
          name="paidAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-semibold text-sm">Fecha de Pago</FormLabel>
              <Popover open={openPaidAt} onOpenChange={setOpenPaidAt}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-9 justify-start text-left font-normal text-sm",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
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
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-xs">Fecha en que se realizó el pago</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monto Pagado */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">Monto Pagado</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Método de Pago */}
        <FormField
          control={form.control}
          name="payMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">Método de Pago</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccione el método de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PAGO_MOVIL">Pago Móvil</SelectItem>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">Imagen de Referencia</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                      <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground text-center">Arrastra o haz clic para subir</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 handleImageUpload(file); // Función para manejar la subida
                               }
                             }}
                      className="hidden"
                    />
                  </label>

                  {previewImage && (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden bg-muted/30 border border-muted-foreground/25">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-destructive hover:bg-destructive/90 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="text-xs">Foto o captura de pantalla del comprobante de pago</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de Envío */}
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
      </form>
    </Form>
  );
  
}

export default PaymentTransactionForm;

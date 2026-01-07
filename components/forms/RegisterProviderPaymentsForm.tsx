'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  useCreateProviderPayment,
  useGetProviderPayment,
  useUpdateProviderPayment,
} from "@/actions/provider_payments/actions"

import { useGetProviders } from "@/actions/providers/actions"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  providerId: z.string(),
  amount: z.string(),
  payMethod: z.string(),
  reference: z.string().optional(),
  paidAt: z.date(),
  image: z.string().nullable().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface FormProps {
  onClose: () => void
  isEditing?: boolean
  paymentId?: string
  providerId?: string
}
// VERIFICAR EL FORMULARIO DE PAGO A LOS PROVEEDORES
const ProviderPaymentForm = ({
  onClose,
  isEditing = false,
  paymentId,
  providerId,
}: FormProps) => {
  const { data: session } = useSession()
  const { data: providers } = useGetProviders()
  const { data: payment } = useGetProviderPayment(paymentId ?? null)

  const { createPayment } = useCreateProviderPayment()
  const { updatePayment } = useUpdateProviderPayment()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerId: providerId ?? "",
      amount: "",
      payMethod: "EFECTIVO",
      reference: "",
      paidAt: new Date(),
    },
  })

  /** Cargar datos al editar */
  useEffect(() => {
    if (payment && isEditing) {
      form.reset({
        providerId: payment.providerId,
        amount: payment.amount.toString(),
        payMethod: payment.payMethod,
        reference: payment.reference ?? "",
        paidAt: new Date(payment.paidAt),
        image: payment.image ?? null,
      })
    }
  }, [payment, isEditing, form])

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        providerId: values.providerId,
        amount: Number(values.amount),
        payMethod: values.payMethod,
        reference: values.reference ?? null,
        paidAt: values.paidAt,
        registered_by: session?.user.username ?? "",
      }

      if (isEditing && paymentId) {
        await updatePayment.mutateAsync({
          id: paymentId,
          ...payload,
        })
      } else {
        await createPayment.mutateAsync(payload)
      }

      toast.success("Pago registrado correctamente")
      onClose()
    } catch (e) {
      toast.error("Error al registrar el pago")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Proveedor */}
        {!providerId && (
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {providers?.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EFECTIVO">EFECTIVO</SelectItem>
                  <SelectItem value="PAGO_MOVIL">PAGO MÓVIL</SelectItem>
                  <SelectItem value="TRANSFERENCIA">TRANSFERENCIA</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referencia</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={createPayment.isPending || updatePayment.isPending}>
          {(createPayment.isPending || updatePayment.isPending) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isEditing ? "Actualizar Pago" : "Registrar Pago"}
        </Button>
      </form>
    </Form>
  )
}

export default ProviderPaymentForm

"use client"

import TransactionDropdownActions from "@/components/dropdowns/TransactionDropdownActions"
import { DataTableColumnHeader } from "@/components/tables/DataTableHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { convertAmountFromMiliunits } from "@/lib/utils"
import {Transaction } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { CalendarDays, Package } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader filter column={column} title="Descripcion" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.reference}</div>
    ),
  },
  {
    // muestra resumen de artículos
    id: "articles",
    header: ({ column }) => (
      <DataTableColumnHeader filter column={column} title="Artículos" />
    ),
    cell: ({ row }) => {
      const items = row.original.items || []
      if (!items.length) {
        return <div className="italic text-muted-foreground">Sin artículos</div>
      }
      if (items.length === 1) {
        return (
          <div className="italic text-muted-foreground">
            {items[0].article.name}
            <span className="text-xs ml-1 text-muted-foreground/60">/ {items[0].article.serial}</span>
          </div>
        )
      }
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 italic text-muted-foreground hover:text-foreground transition-colors">
              <span>{items[0].article.name}</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold bg-muted px-1.5 py-0.5 rounded-full">
                <Package className="size-3" />
                +{items.length - 1}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Artículos</p>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="font-medium">{item.article.name}</p>
                    <p className="text-xs text-muted-foreground">{item.article.serial}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">x{item.quantity}</p>
                    <p className="text-xs text-muted-foreground">${item.priceUnit} c/u</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )
    },
  },
  {
    // cantidad total de artículos en la transacción
    id: "quantityTotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    cell: ({ row }) => {
      const totalQty = (row.original.items || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      return (
        <div className="font-medium">
          {totalQty}
        </div>
      )
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio Total" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground italic font-medium">
        ${row.original.total}
      </div>
    ),
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const client = row.original.client
      const debt = row.original.status === "PENDIENTE" ? row.original.total - row.original.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
      return (
        <div className="font-medium">
          <div className="italic">{client.first_name} {client.last_name}</div>
          <div className={`font-bold ${debt === 0
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
          }`}>
            Deuda: ${debt}
            
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "transaction_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Venta" />
    ),
    cell: ({ row }) => {
      const date = row.original.transaction_date
      return (
        <div className="font-medium text-muted-foreground">
          {date ? new Date(date).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
        </div>
      )
    },
  },
  {
    id: "payment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Pago" />
    ),
    cell: ({ row }) => {
      const payments = row.original.payments || []
      if (!payments.length) {
        return <div className="text-muted-foreground">—</div>
      }

      const sorted = [...payments].sort(
        (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
      )
      const fmt = (d: Date) =>
        new Date(d).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" })

      if (payments.length === 1) {
        return <div className="font-medium text-muted-foreground">{fmt(sorted[0].paidAt)}</div>
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors group">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>{fmt(sorted[0].paidAt)}</span>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 group-hover:bg-accent">
                +{payments.length - 1}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Fechas de pago
            </p>
            <ul className="space-y-1.5">
              {sorted.map((payment, i) => (
                <li key={payment.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{fmt(payment.paidAt)}</span>
                  <span className="font-medium">${payment.amount}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <p className="font-medium">{row.original.status}</p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      return <TransactionDropdownActions id={id.toString()} />
    },
  },
]


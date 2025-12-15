"use client"

import TransactionDropdownActions from "@/components/dropdowns/TransactionDropdownActions"
import { DataTableColumnHeader } from "@/components/tables/DataTableHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { convertAmountFromMiliunits } from "@/lib/utils"
import {Transaction } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="w-full flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-full flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader filter column={column} title="Nombre" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-bold">{row.original.name}</div>
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
        return (
          <div className="text-center italic text-muted-foreground">
            Sin artículos
          </div>
        )
      }

      const label =
        items.length === 1
          ? `${items[0].article.name} / ${items[0].article.serial}`
          : `${items[0].article.name} (+${items.length - 1} más)`

      return (
        <div className="text-center italic text-muted-foreground">
          {label}
        </div>
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
        <div className="text-center font-bold">
          {convertAmountFromMiliunits(totalQty)}
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
      <div className="text-center text-muted-foreground italic font-medium">
        {convertAmountFromMiliunits(row.original.total)}
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
      return (
        <div className="text-center text-muted-foreground italic font-medium">
          {client.first_name} {client.last_name}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <p className="text-center font-bold">{row.original.status}</p>
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


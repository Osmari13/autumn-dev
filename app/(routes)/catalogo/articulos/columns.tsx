"use client"

import ArticleDropdownActions from "@/components/dropdowns/ArticleDropdownActions"
import { DataTableColumnHeader } from "@/components/tables/DataTableHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { convertAmountFromMiliunits } from "@/lib/utils"
import { Article } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Article>[] = [
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
      <DataTableColumnHeader filter column={column} title='Nombre' />
    ),
    cell: ({ row }) => {
      return <div className="text-center font-bold">{row.original.name}</div>
    },
  },
  {
    accessorKey: "serial",
    header: ({ column }) => (
      <DataTableColumnHeader filter column={column} title='Serial' />
    ),
    cell: ({ row }) => {
      return <div className="text-center italic text-muted-foreground">{row.original.serial}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cantidad' />
    ),
    cell: ({ row }) => {
      return <div className="text-center font-bold">{convertAmountFromMiliunits(row.original.quantity)}</div>
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Categoria' />
    ),
    cell: ({ row }) => {
      return <div className="text-center text-muted-foreground italic font-medium">{row.original.category.name}</div>
    },
  },
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Proveedor' />
    ),
    cell: ({ row }) => {
      return <p className="text-center font-bold">{row.original.provider.name} </p>
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <ArticleDropdownActions id={id.toString()} />
      )
    },
  }
]

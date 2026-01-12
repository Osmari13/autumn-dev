"use client"

import ProviderDropdownActions from "@/components/dropdowns/ProviderDropdownActions"
import { DataTableColumnHeader } from "@/components/tables/DataTableHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { Provider } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Provider>[] = [
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
    accessorKey: "phone_number",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Numero de Tlf' />
    ),
    cell: ({ row }) => {
        return <div className="text-center font-bold">{row.original.phone_number}</div>
      },
  },
  {
    accessorKey:"name",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Nombre' />
    ),
    cell: ({ row }) => {
        return <div className="text-center font-bold">{row.original.name}</div>
      },
  },{
    accessorKey:"providerPayment",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Pagos' />
    ),
    cell: ({ row }) => {
        return <div className="text-center font-bold">${row.original.providerPayment?.reduce((acc, payment) => acc + payment.amount, 0) || 0}</div>
      },
  },    
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <ProviderDropdownActions id={id.toString()} />
      )
    },
  }
]


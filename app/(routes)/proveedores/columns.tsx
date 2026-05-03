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
    accessorKey: "phone_number",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Numero de Tlf' />
    ),
    cell: ({ row }) => {
        return <div className="font-medium">{row.original.phone_number}</div>
      },
  },
  {
    accessorKey:"name",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Nombre' />
    ),
    cell: ({ row }) => {
        return <div className="font-medium">{row.original.name}</div>
      },
  },{
    accessorKey:"providerPayment",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Pagos' />
    ),
    cell: ({ row }) => {
        return <div className="font-medium">${row.original.providerPayment?.reduce((acc, payment) => acc + payment.amount, 0) || 0}</div>
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


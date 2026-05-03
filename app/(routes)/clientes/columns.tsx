"use client"

import ClientDropdownActions from "@/components/dropdowns/ClientDropdownActions"
import { DataTableColumnHeader } from "@/components/tables/DataTableHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { Client } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "first_name",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Nombre' />
    ),
    cell: ({ row }) => {
        return <div className="font-medium">{row.original.first_name}</div>
      },
  },
  {
    accessorKey:"last_name",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Apellido' />
    ),
    cell: ({ row }) => {
        return <div className="font-medium">{row.original.last_name}</div>
      },
  },
  {
    accessorKey: "phone_number",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Numero de Tlf'/>
    ),
    cell: ({ row }) => {   
        return <div className="font-medium text-muted-foreground">{row.original.phone_number ?? 'No disponible'}</div>
      },
  },
    {
    accessorKey: "debt",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Deuda'/>
    ),
    cell: ({ row }) => {   
     const debt =
      row.original.transaction
        ?.filter((transaction) => transaction.status === "PENDIENTE")
        .reduce((clientDebt, transaction) => {
          const paymentsSum =
            transaction.payments?.reduce(
              (sum, payment) => sum + payment.amount,
              0
            ) ?? 0;

          const transactionDebt = transaction.total - paymentsSum;

          return clientDebt + transactionDebt;
        }, 0) ?? 0;
     
        return (
          <div className={`font-semibold ${debt === 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
            }`}>
              ${debt}
          </div>
          )
      },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <ClientDropdownActions id={id.toString()} />
      )
    },
  }
]


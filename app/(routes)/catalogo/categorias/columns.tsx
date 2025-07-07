"use client"

import CategoryDropdownActions from "@/components/dropdowns/CategoryDropdownActions"
import ProviderDropdownActions from "@/components/dropdowns/CategoryDropdownActions"
import { DataTableColumnHeader } from "@/components/tables/DataTableHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { Category} from "@/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Category>[] = [
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
    accessorKey:"name",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Nombre' />
    ),
    cell: ({ row }) => {
        return <div className="text-center font-bold">{row.original.name}</div>
      },
  },
  {
    accessorKey: "description",
    header: ({column}) => (
        <DataTableColumnHeader filter column={column} title='Descripcion'/>
    ),
    cell: ({ row }) => {   
        return <div className="text-center font-bold">{row.original.description}</div>
      },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <CategoryDropdownActions id={id.toString()} />
      )
    },
  }
]


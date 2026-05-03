"use client"

import ArticleDropdownActions from "@/components/dropdowns/ArticleDropdownActions"
import { DataTableColumnHeader } from "@/components/tables/DataTableHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { convertAmountFromMiliunits } from "@/lib/utils"
import { Article } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Article>[] = [
  {
    accessorKey: "image",
    header: () => <span className="sr-only">Imagen</span>,
    cell: ({ row }) => {
      const image = row.original.image;
      return image ? (
        <div className="flex justify-center">
          <Image
            src={image}
            alt={row.original.name}
            width={48}
            height={48}
            className="rounded-md object-cover size-12"
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="size-12 rounded-md bg-muted flex items-center justify-center">
            <ImageIcon className="size-5 text-muted-foreground" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader filter column={column} title='Nombre' />
    ),
    cell: ({ row }) => {
      const image = row.original.image;
      const name = row.original.name;
      if (!image) {
        return <div className="font-medium">{name}</div>;
      }
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <span className="font-medium cursor-pointer underline-offset-2 hover:underline">{name}</span>
                </DialogTrigger>
                <DialogContent className="max-w-lg p-2">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent side="right" className="p-1 bg-background border shadow-xl rounded-lg">
              <Image
                src={image}
                alt={name}
                width={160}
                height={160}
                className="rounded-md object-cover size-40"
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "serial",
    header: ({ column }) => (
      <DataTableColumnHeader filter column={column} title='Serial' />
    ),
    cell: ({ row }) => {
      return <div className="italic text-muted-foreground">{row.original.serial}</div>
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Categoria' />
    ),
    cell: ({ row }) => {
      return <div className="text-muted-foreground italic font-medium">{row.original.category.name}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cantidad' />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.quantity}</div>
    },
  },
  {
    accessorKey: "priceUnit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Precio Unitario' />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">${row.original.priceUnit} C/U</div>
    },
  },
  
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Proveedor' />
    ),
    cell: ({ row }) => {
      return <p className="font-medium">{row.original.provider.name}</p>
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

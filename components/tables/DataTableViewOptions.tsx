"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { SlidersHorizontal } from "lucide-react"
import { Table } from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-auto flex items-center gap-1.5 h-8 px-3 rounded text-[11px] font-medium tracking-wide text-[#A0856E] dark:text-[#6A5A50] hover:text-[#8B4513] dark:hover:text-[#C9A87C] hover:bg-[#F0E4D4] dark:hover:bg-white/[0.06] transition-colors duration-150 border border-[#E0D4C8] dark:border-white/[0.1]">
          <SlidersHorizontal className="h-3 w-3" />
          Columnas
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-[#FDFAF7] dark:bg-[#1E1A15] border-[#E0D4C8] dark:border-white/10">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.1em] text-[#A0856E] dark:text-[#6A5A50] py-2">
          Mostrar / Ocultar
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#E0D4C8] dark:bg-white/10" />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-xs text-[#6B4D37] dark:text-[#C9B99A] focus:bg-[#F5E8D8] dark:focus:bg-white/[0.08] cursor-pointer"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

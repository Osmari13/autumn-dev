"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import { RegisterProviderDialog } from "@/components/dialogs/RegisterProviderDialog"
import { DataTablePagination } from "@/components/tables/DataTablePagination"
import { DataTableViewOptions } from "@/components/tables/DataTableViewOptions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ListRestart } from "lucide-react"
import { useState } from "react"
import { RegisterCategoryDialog } from "@/components/dialogs/RegisterCategoryDialog"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    }
  })

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div>
      <div className="flex items-center pb-4 border-b border-[#EDE4D8] dark:border-white/[0.06] mb-1">
        <div className="flex gap-x-2 items-center">
            <RegisterCategoryDialog />
          {isFiltered && (
            <button
              onClick={() => table.resetColumnFilters()}
              className="flex items-center gap-1.5 h-8 px-3 rounded text-[11px] text-[#A0856E] dark:text-[#6A5A50] hover:text-[#8B4513] dark:hover:text-[#C9A87C] hover:bg-[#F0E4D4] dark:hover:bg-white/[0.06] transition-colors border border-[#E0D4C8] dark:border-white/[0.1]"
            >
              <ListRestart className="h-3 w-3" />
              Reiniciar
            </button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="mb-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No se ha encontrado ningún resultado...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

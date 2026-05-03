import { Table } from "@tanstack/react-table"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

const PageButton = ({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={cn(
      "h-7 w-7 flex items-center justify-center rounded transition-colors duration-150",
      "text-[#A0856E] dark:text-[#6A5A50]",
      "hover:bg-[#F0E4D4] dark:hover:bg-white/[0.06] hover:text-[#8B4513] dark:hover:text-[#C9A87C]",
      "disabled:opacity-30 disabled:pointer-events-none"
    )}
  >
    {children}
  </button>
)

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-[#EDE4D8] dark:border-white/[0.06]">
      <p className="text-[11px] text-[#A0856E] dark:text-[#5A4E46] tracking-wide">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} fila(s) seleccionada
      </p>
      <div className="flex items-center gap-5 mt-3 md:mt-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#A0856E] dark:text-[#5A4E46] tracking-wide whitespace-nowrap">
            Por página
          </span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-7 w-[56px] text-xs border-[#E0D4C8] dark:border-white/[0.1] bg-transparent text-[#6B4D37] dark:text-[#C9B99A] focus:ring-[#C4621D]/30 rounded">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="bg-[#FDFAF7] dark:bg-[#1E1A15] border-[#E0D4C8] dark:border-white/10 min-w-[70px]">
              {[5, 10, 20, 30, 40].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="text-xs text-[#6B4D37] dark:text-[#C9B99A] focus:bg-[#F5E8D8] dark:focus:bg-white/[0.08]"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-[11px] text-[#A0856E] dark:text-[#5A4E46] tracking-wide tabular-nums">
          {table.getState().pagination.pageIndex + 1}{" "}
          <span className="opacity-50">/</span>{" "}
          {table.getPageCount()}
        </span>

        <div className="flex items-center gap-0.5">
          <PageButton
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            label="Primera página"
          >
            <ChevronFirst className="h-3.5 w-3.5" />
          </PageButton>
          <PageButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            label="Página anterior"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </PageButton>
          <PageButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            label="Siguiente página"
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </PageButton>
          <PageButton
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            label="Última página"
          >
            <ChevronLast className="h-3.5 w-3.5" />
          </PageButton>
        </div>
      </div>
    </div>
  )
}

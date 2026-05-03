import { Column } from "@tanstack/react-table"
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronsUpDown,
    EyeOff,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  filter?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  filter,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-[10px] uppercase tracking-[0.1em] text-[#A0856E] dark:text-[#6A5A50]", className)}>{title}</div>
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 group",
              "text-[10px] uppercase tracking-[0.1em]",
              "text-[#A0856E] dark:text-[#6A5A50]",
              "hover:text-[#8B4513] dark:hover:text-[#C9A87C]",
              "transition-colors duration-150 outline-none"
            )}
          >
            {title}
            <span className="opacity-50 group-hover:opacity-100 transition-opacity">
              {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="h-3 w-3 text-[#C4621D]" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="h-3 w-3 text-[#C4621D]" />
              ) : (
                <ChevronsUpDown className="h-3 w-3" />
              )}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-[#FDFAF7] dark:bg-[#1E1A15] border-[#E0D4C8] dark:border-white/10 min-w-[120px]">
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="text-xs text-[#6B4D37] dark:text-[#C9B99A] hover:text-[#3D2010] dark:hover:text-white focus:bg-[#F5E8D8] dark:focus:bg-white/[0.08] cursor-pointer"
          >
            <ArrowUpIcon className="mr-2 h-3 w-3 opacity-60" />
            Ascendente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="text-xs text-[#6B4D37] dark:text-[#C9B99A] hover:text-[#3D2010] dark:hover:text-white focus:bg-[#F5E8D8] dark:focus:bg-white/[0.08] cursor-pointer"
          >
            <ArrowDownIcon className="mr-2 h-3 w-3 opacity-60" />
            Descendente
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#E0D4C8] dark:bg-white/10" />
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(false)}
            className="text-xs text-[#6B4D37] dark:text-[#C9B99A] hover:text-[#3D2010] dark:hover:text-white focus:bg-[#F5E8D8] dark:focus:bg-white/[0.08] cursor-pointer"
          >
            <EyeOff className="mr-2 h-3 w-3 opacity-60" />
            Ocultar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {filter && (
        <Input
          placeholder={`${title.toLowerCase()}...`}
          value={(column?.getFilterValue() as string) ?? ""}
          onChange={(event) => column?.setFilterValue(event.target.value)}
          className="h-6 mt-1.5 text-xs border-0 border-b border-[#E0D4C8] dark:border-white/[0.1] rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-[#C4621D] dark:focus-visible:border-[#C4621D] placeholder:text-[#C0A898] dark:placeholder:text-[#5A4E46] text-foreground w-[160px] transition-colors"
        />
      )}
    </div>
  )
}
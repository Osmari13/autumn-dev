"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Submenu = {
  href: string
  label: string
  active: boolean
}

interface CollapseMenuButtonProps {
  icon: LucideIcon
  label: string
  active: boolean
  submenus: Submenu[]
  isOpen: boolean | undefined
}

export function CollapseMenuButton({ icon: Icon, label, active, submenus, isOpen }: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive)

  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full overflow-hidden">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center h-10 px-3 mb-0.5 rounded-lg transition-all duration-200",
                  "text-[#6B4D37] dark:text-[#9A8878] hover:text-[#3D2010] dark:hover:text-[#E8DDD0] hover:bg-[#E8D9C8] dark:hover:bg-white/[0.05]",
                  "border-l-2 border-transparent",
                  (active || isSubmenuActive) && "border-[#C4621D] bg-[#F5E4D0] dark:bg-[#C4621D]/[0.1] text-[#8B4513] dark:text-[#E8DDD0]"
                )}
              >
                <span className={cn(isOpen === false ? "" : "mr-3")}>
                  <Icon size={16} />
                </span>
                <p
                  className={cn(
                    "text-sm max-w-[150px] truncate",
                    isOpen === false ? "-translate-x-96 opacity-0 w-0 overflow-hidden" : "translate-x-0 opacity-100",
                  )}
                >
                  {label}
                </p>
                <div className={cn("whitespace-nowrap", isOpen === false ? "hidden" : "ml-auto")}>
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-200 text-[#A0856E] dark:text-[#5A4E46]", isCollapsed ? "rotate-180" : "rotate-0")}
                  />
                </div>
              </button>
            </CollapsibleTrigger>
          </TooltipTrigger>
          {isOpen === false && (
            <TooltipContent side="right" align="start" alignOffset={2} className="bg-[#F5EDE0] dark:bg-[#1E1A15] text-[#8B4513] dark:text-[#C9B99A] border-[#DDD0BC] dark:border-white/10">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active }, index) => (
          <Link
            key={index}
            href={href}
            className={cn(
              "w-full flex items-center h-9 px-3 pl-9 mb-0.5 rounded-lg transition-all duration-200",
              "text-[#7A6060] dark:text-[#7A6A60] hover:text-[#3D2010] dark:hover:text-[#E8DDD0] hover:bg-[#E8D9C8] dark:hover:bg-white/[0.05]",
              active && "text-[#C4621D]"
            )}
          >
            <span
              className={cn(
                "text-sm max-w-[170px] truncate",
                isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100",
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

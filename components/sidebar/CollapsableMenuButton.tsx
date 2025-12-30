"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Dot, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
              <Button
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10",
                  active && "bg-orange-100 dark:bg-orange-950 hover:bg-orange-200 dark:hover:bg-orange-900",
                )}
              >
                <span className={cn(isOpen === false ? "" : "mr-4")}>
                  <Icon size={18} />
                </span>
                <p
                  className={cn(
                    "max-w-[150px] truncate",
                    isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100",
                  )}
                >
                  {label}
                </p>
                <div className={cn("whitespace-nowrap", isOpen === false ? "hidden" : "ml-auto")}>
                  <ChevronDown
                    size={18}
                    className={cn("transition-transform duration-200", isCollapsed ? "rotate-180" : "rotate-0")}
                  />
                </div>
              </Button>
            </CollapsibleTrigger>
          </TooltipTrigger>
          {isOpen === false && (
            <TooltipContent side="right" align="start" alignOffset={2}>
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-10 mb-1",
              active && "bg-orange-100 dark:bg-orange-950 hover:bg-orange-200 dark:hover:bg-orange-900",
            )}
            asChild
          >
            <Link href={href}>
              <span className={cn(isOpen === false ? "" : "mr-4 ml-2")}>
                <Dot size={18} />
              </span>
              <p
                className={cn(
                  "max-w-[170px] truncate",
                  isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100",
                )}
              >
                {label}
              </p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

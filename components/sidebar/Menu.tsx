"use client";

import Link from "next/link";
import { Ellipsis, Loader2, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import { CollapseMenuButton } from "./CollapsableMenuButton";
import { getMenuList } from "@/lib/menu-list";
import { signOut, useSession } from "next-auth/react";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="h-screen justify-center items-center">
        <Loader2 className="size-6 animate-spin mt-52 text-[#C4621D]" />
      </div>
    );
  }

  const role = session?.user?.user_role || "SELLER";
  const menuList = getMenuList(pathname, role);

  return (
    <ScrollArea className="[&>div>div[style]]:!block sidebar-scroll flex-1">
      <nav className="mt-4 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-0.5 px-3">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-[10px] font-medium text-[#A0856E] dark:text-[#5A4E46] uppercase tracking-[0.12em] px-3 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center py-1">
                        <Ellipsis className="h-4 w-4 text-[#A0856E] dark:text-[#5A4E46]" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-[#F5EDE0] dark:bg-[#1E1A15] text-[#8B4513] dark:text-[#C9B99A] border-[#DDD0BC] dark:border-white/10">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-1"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Link
                              href={href}
                              className={cn(
                                "w-full flex items-center h-10 px-3 mb-0.5 rounded-lg transition-all duration-200",
                                "text-[#6B4D37] dark:text-[#9A8878] hover:text-[#3D2010] dark:hover:text-[#E8DDD0] hover:bg-[#E8D9C8] dark:hover:bg-white/[0.05]",
                                "border-l-2 border-transparent",
                                active && "border-[#C4621D] bg-[#F5E4D0] dark:bg-[#C4621D]/[0.1] text-[#8B4513] dark:text-[#E8DDD0]"
                              )}
                            >
                              <span className={cn(isOpen === false ? "" : "mr-3")}>
                                <Icon size={16} />
                              </span>
                              <p
                                className={cn(
                                  "text-sm max-w-[200px] truncate",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0 w-0 overflow-hidden"
                                    : "translate-x-0 opacity-100"
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right" className="bg-[#F5EDE0] dark:bg-[#1E1A15] text-[#8B4513] dark:text-[#C9B99A] border-[#DDD0BC] dark:border-white/10">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end pb-4">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => signOut()}
                    className={cn(
                      "w-full flex items-center h-10 px-3 rounded-lg transition-all duration-200",
                      "text-[#A0856E] dark:text-[#5A4E46] hover:text-[#6B4D37] dark:hover:text-[#9A8878] hover:bg-[#E8D9C8] dark:hover:bg-white/[0.04]",
                      "border border-[#DDD0BC] dark:border-white/[0.07]",
                      isOpen === false ? "justify-center" : "justify-start"
                    )}
                  >
                    <span className={cn(isOpen === false ? "" : "mr-3")}>
                      <LogOut size={15} />
                    </span>
                    <p
                      className={cn(
                        "text-sm whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Cerrar sesión
                    </p>
                  </button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right" className="bg-[#F5EDE0] dark:bg-[#1E1A15] text-[#8B4513] dark:text-[#C9B99A] border-[#DDD0BC] dark:border-white/10">
                    Cerrar sesión
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}


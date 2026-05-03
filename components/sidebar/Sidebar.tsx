'use client'

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { useStore } from "@/hooks/useStore";
import { Menu } from "./Menu";
import { SidebarToggle } from "./SidebarToggle";
import { useSession } from "next-auth/react";
import { Leaf } from "lucide-react";

export function Sidebar() {
  const { data: session } = useSession();
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        "bg-[#F5EDE0] dark:bg-[#13100D]",
        "border-r border-[#DDD0BC] dark:border-white/[0.05]",
        sidebar?.isOpen === false ? "w-[72px]" : "w-64"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col overflow-hidden">
        {/* Logo */}
        <Link
          href={session?.user.user_role === 'ADMIN' ? "/dashboard" : "/not-authorized"}
          className={cn(
            "flex items-center gap-3 px-5 pt-8 pb-6 transition-all duration-300",
            sidebar?.isOpen === false ? "justify-center px-0 pt-8 pb-6" : ""
          )}
        >
          <Leaf
            size={18}
            className="text-[#C4621D] shrink-0 transition-all duration-300"
          />
          <span
            className={cn(
              "font-cormorant font-semibold italic text-[1.6rem] leading-none text-[#8B4513] dark:text-[#D4813A] tracking-wide whitespace-nowrap transition-all ease-in-out duration-300",
              sidebar?.isOpen === false
                ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                : "opacity-100"
            )}
          >
            Autumn
          </span>
        </Link>

        {/* Divider */}
        <div className="mx-5 border-t border-[#DDD0BC] dark:border-white/[0.06]" />

        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}

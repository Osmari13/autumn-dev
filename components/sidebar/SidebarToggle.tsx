import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-[58px] -right-[13px] z-20">
      <button
        onClick={() => setIsOpen?.()}
        className="h-6 w-6 rounded-full bg-[#C4621D] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(196,98,29,0.4)] hover:bg-[#B85118] transition-colors duration-200"
      >
        <ChevronLeft
          className={cn(
            "h-3 w-3 transition-transform ease-in-out duration-500",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
    </div>
  );
}

import { ModeToggle } from "../misc/ModeToggle";
import { SheetMenu } from "./SheetMenu";
import { UserNav } from "./UserNav";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-[#FDFAF7]/95 dark:bg-[#1A1511]/95 border-b border-[#EAE0D5] dark:border-white/[0.06] backdrop-blur supports-[backdrop-filter]:bg-[#FDFAF7]/80 dark:supports-[backdrop-filter]:bg-[#1A1511]/80">
      <div className="mx-4 sm:mx-8 flex h-13 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="text-xs font-medium text-[#9A8878] dark:text-[#7A6A60] tracking-[0.1em] uppercase">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-1">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

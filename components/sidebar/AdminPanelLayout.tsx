"use client";

import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";


export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-[#FDFAF7] dark:bg-[#1A1511] transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        {children}
      </main>
      {/* <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Footer />
      </footer> */}
    </>
  );
}

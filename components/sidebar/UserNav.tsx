"use client";

import Link from "next/link";
import { ChartNoAxesCombined, LayoutGrid, Loader2, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

export function UserNav() {

  const { data: session } = useSession()
  const username = session?.user?.username?.trim() ?? "";
  const initials = username.slice(0, 2).toUpperCase();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      const result = await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      router.refresh();
      window.location.href = result?.url || "/login";
    } catch {
      toast.error("No se pudo cerrar sesión. Inténtelo nuevamente.");
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {initials || <Loader2 className='size-2 animate-spin' />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Perfil</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user.username}</p>
            <p className="text-sm font-medium leading-none">{session?.user.user_role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {
            session?.user.user_role === 'ADMIN' && (
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href="/dashboard" className="flex items-center">
                  <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )
          }
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleSignOut} disabled={isSigningOut}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

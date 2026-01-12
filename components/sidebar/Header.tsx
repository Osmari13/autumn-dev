"use client"

import Link from "next/link"
import { Leaf, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/(shop)/cartContext"

export default function Header() {
  const { items } = useCart()

  const count = items.reduce((acc, item) => acc + item.quantity, 0)
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-wider text-foreground">AUTUMN</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Productos
          </Link>
          <Link href="/#nosotros" className="text-foreground hover:text-primary transition-colors">
            Nosotros
          </Link>
          <Link href="/#contacto" className="text-foreground hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="relative hidden md:flex">
            <Link href="/shopping" className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Carrito

              {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1 animate-in zoom-in duration-150">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

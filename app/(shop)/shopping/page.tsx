"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Article } from "@/types"
import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "../cartContext"

export default function CartPage() {
  const { items, addToCart, removeFromCart, total } = useCart()
  const grandTotal = total

  /** disminuir cantidad */
  const decreaseQuantity = (item: Article & { quantity: number }) => {
    if (item.quantity === 1) {
      removeFromCart(item.id)
      return
    }
    removeFromCart(item.id)
    for (let i = 0; i < item.quantity - 1; i++) {
      addToCart(item)
    }
  }

  // ✅ WhatsApp número y funciones
  const whatsappNumber = "584249128662" // +58 414-8738350
  
  // Generar mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    if (items.length === 0) return ""
    
    let message = `¡Hola! Mi pedido del carrito:\n\n`
    message += items.map(item => 
      `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${item.price.toFixed(2)}\n  Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`
    ).join('')
    message += `💰 *TOTAL: $${grandTotal.toFixed(2)}*`
    message += `\n\n¡Gracias! 😊`
    
    return encodeURIComponent(message)
  }

  // Abrir WhatsApp
  const openWhatsApp = () => {
    if (items.length === 0) return
    
    const message = generateWhatsAppMessage()
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappURL, '_blank')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Mi Carrito ({items.length})</h1>
          </div>
          
          {/* ✅ Botón WhatsApp en header */}
          <Button 
            onClick={openWhatsApp} 
            disabled={items.length === 0}
            className="relative hidden md:flex"
          >
            <ShoppingBag className="h-5 w-5" />

            Realizar Pedido
          </Button>
        </div>
      </header>

      {/* Empty */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-16">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Explora nuestros productos y encuentra lo que necesitas.
          </p>
          <Button asChild>
            <Link href="/products">Continuar comprando</Link>
          </Button>
        </div>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 grid md:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/loguito_blanco-removebg.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-primary font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => decreaseQuantity(item)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary - MODIFICADO */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} artículos)</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>

                {/* ✅ BOTONES DE WHATSAPP PRINCIPALES */}
                <div className="grid gap-3 pt-4">
                  {/* WhatsApp principal */}
                  <Button 
                    onClick={openWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 gap-2 text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Pedir por WhatsApp</span>
                  </Button>

                  {/* WhatsApp con llamada */}
                  {/* <Button 
                    onClick={openWhatsApp}
                    variant="outline"
                    className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Llamar + Pedir</span>
                  </Button> */}
                </div>

                {/* Botón tradicional (opcional)
                <Button className="w-full mt-2" variant="secondary">
                  Proceder al pago (Próximamente)
                </Button> */}
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </div>
  )
}

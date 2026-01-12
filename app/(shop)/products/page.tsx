"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Leaf, ShoppingBag, ChevronRight, Loader2, AlertCircle, MapPin, Mail, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetArticles } from "@/actions/articles/actions"
import { useCart } from "../cartContext"
import Header from "@/components/sidebar/Header"

export default function ProductsPage() {
  const { data: articles, loading, error } = useGetArticles()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { addToCart } = useCart()


  const categories = useMemo(() => {
    const cats = new Set<string>()
    articles?.forEach((article) => {
      cats.add(article.category.name)
    })
    return Array.from(cats).sort()
  }, [articles])

  const filteredArticles = useMemo(() => {
    if (!articles) return []

    if (!selectedCategory) return articles

    return articles.filter(
      (article) => article.category.name === selectedCategory
    )
  }, [selectedCategory, articles])

  return (
     <div className="flex min-h-screen flex-col">
      {/* Header */}
        <Header/>
      

      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b">
        <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto py-4 flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Productos</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Nuestros Productos</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explora nuestra colección completa de accesorios otoñales. Cada producto está diseñado con cuidado para
            capturar la esencia cálida y acogedora de la temporada.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1 autumn-pattern">
        <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Filtrar por categoría</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        selectedCategory === null
                          ? "bg-primary text-primary-foreground font-medium"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      Todos los productos
                      <span className="ml-2 text-sm">({articles?.length || 0})</span>
                    </button>

                    {categories?.map((category) => {
                      const count = articles?.filter((a) => a.category.name === category).length || 0
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                            selectedCategory === category
                              ? "bg-primary text-primary-foreground font-medium"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          }`}
                        >
                          {category}
                          <span className="ml-2 text-sm">({count})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-chart-4/10 border border-chart-4/20">
                  <h4 className="font-medium text-foreground mb-2">¿Necesitas ayuda?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Nuestro equipo está aquí para ayudarte a encontrar el accesorio perfecto.
                  </p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Contactar soporte
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Cargando productos...</p>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 flex items-center gap-4 mb-8">
                  <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Error al cargar productos</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">
                        {selectedCategory ? selectedCategory : "Todos los productos"}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Mostrando {filteredArticles?.length} producto{filteredArticles?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {filteredArticles?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArticles?.map((article) => (
                        <Card
                          key={article.id}
                          className="overflow-hidden border-border/50 hover:border-primary/50 transition-all group h-full flex flex-col"
                        >
                          <div className="relative h-[250px] overflow-hidden">
                            {article.tag && (
                              <Badge className="absolute top-2 right-2 z-10 bg-chart-1 text-white">{article.tag}</Badge>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                            <Image
                              src={article.image || "/loguito_blanco-removebg.png"}
                              alt={article.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-4 flex flex-col flex-1">
                            <div className="flex-1">
                              <div className="inline-block mb-2">
                                <Badge variant="outline" className="text-xs border-primary/30">
                                  {article.category.name}
                                </Badge>
                              </div>
                              <h3 className="font-medium text-foreground">{article.name}</h3>
                              <p className="text-muted-foreground text-sm mt-1">
                                {article.description || "Accesorio de otoño de calidad"}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                              <span className="text-lg font-semibold text-primary">${article.price.toFixed(2)}</span>
                               <Button size="sm" className="bg-chart-5 hover:bg-chart-5/90 text-white" onClick={() => addToCart(article)}>
                                <ShoppingBag className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">No hay productos en esta categoría</p>
                      <Button onClick={() => setSelectedCategory(null)}>Ver todos los productos</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-12 autumn-gradient-1 text-primary-foreground">
        <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">¿No encontraste lo que buscas?</h2>
          <p className="max-w-2xl mx-auto opacity-90">
            Contáctanos y conoce nuestras opciones de personalización y productos bajo pedido.
          </p>
          <Button className="bg-white text-chart-1 hover:bg-white/90">Ponte en contacto</Button>
        </div>
      </section>

      {/* Footer */}
       <footer className="py-12 autumn-gradient-1">
        <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-primary-foreground">
            {/* Logo y descripción */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-8 w-8" />
                <span className="text-2xl font-bold tracking-wider text-primary-foreground">AUTUMN</span>
              </div>
              <p className="text-primary-foreground/90 leading-relaxed">
                Accesorios inspirados en los cálidos colores y la atmósfera acogedora del otoño.
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-primary-foreground">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-primary-foreground/90 hover:text-primary hover:underline transition-all block py-1">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#productos" className="text-primary-foreground/90 hover:text-primary hover:underline transition-all block py-1">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="#nosotros" className="text-primary-foreground/90 hover:text-primary hover:underline transition-all block py-1">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#contacto" className="text-primary-foreground/90 hover:text-primary hover:underline transition-all block py-1">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-primary-foreground">Contacto</h4>
              <ul className="space-y-2 text-primary-foreground/90">
                <li className="flex items-center gap-2 py-1">
                  <MapPin className="h-4 w-4" />
                  Ciudad Guayana
                </li>
                <li className="py-1">
                  <Mail className="h-4 w-4 inline-block mr-2" />
                  <a href="https://linktr.ee/autumn.pzo" target="_blank" rel="noopener noreferrer" 
                    className="text-primary-foreground/90 hover:text-primary hover:underline transition-all">
                    autumn.pzo
                  </a>
                </li>
                <li className="flex items-center gap-2 py-1">
                  <Phone className="h-4 w-4" />
                  +58 0414-8738350
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright centrado */}
          <div className="border-t border-primary-foreground/30 mt-12 pt-8 text-center">
            <p className="text-primary-foreground/80 text-sm">
              &copy; {new Date().getFullYear()} AUTUMN. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

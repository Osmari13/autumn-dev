"use client"
import { useGetArticles } from "@/actions/articles/actions";
import Header from "@/components/sidebar/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Coffee, Leaf, Mail, MapPin, Phone, ShoppingBag, Sun, Wind } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useCart } from "./cartContext";

export default function Home() {
  const { data: articles, loading, error } = useGetArticles()
  const { addToCart } = useCart()
  return (
    <div className="flex min-h-screen flex-col">

      <Header/>
      <section className="relative py-20 md:py-32 overflow-hidden leaf-pattern px-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted to-background/50 opacity-90"></div>
        <div className="container grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-8">
            <i className="bg-chart-1/20 text-chart-1 hover:bg-chart-1/30 px-3 py-1">
              Nueva Colección Otoño {new Date().getFullYear()}
            </i>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Accesorios que capturan la esencia del <span className="text-primary">otoño</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubre nuestra colección de accesorios inspirados en los cálidos colores y la atmósfera acogedora del
              otoño.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => window.location.href = "#productos"}>Ver colección</Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Conocer más
              </Button>
            </div>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"></div>
            <Image
              src="/loguito_blanco-removebg.png"
              fill
              alt="Accesorios de otoño"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-12 autumn-gradient-1 px-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-primary-foreground">
            <div className="flex items-center gap-4 p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Materiales Naturales</h3>
                <p className="opacity-80">Inspirados en la naturaleza otoñal</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Coffee className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Colores Cálidos</h3>
                <p className="opacity-80">Tonos que evocan confort y calidez</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Wind className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Diseño Estacional</h3>
                <p className="opacity-80">Perfectos para la temporada otoñal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="py-16 autumn-pattern px-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Nuestros Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada accesorio está diseñado con atención al detalle y con los colores cálidos que caracterizan la
              temporada de otoño.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              articles?.filter(product => product.quantity > 0).slice(0, 5).map((product, index) => (
              <Card
                key={index}
                className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors group"
              >
                <div className="relative h-[250px]">
                  {product.tag && (
                    <Badge className="absolute top-2 right-2 z-10 bg-chart-1 text-white">{product.tag}</Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <Image
                    src={product.image || "/loguito_blanco-removebg.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-foreground">{product.name}</h3>
                      <p className="text-muted-foreground">${product.price}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Añadir
                    </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={() => window.location.href = '/products'}>Ver todos los productos</Button>
          </div>
        </div>
      </section>

      <section id="nosotros" className="py-16 bg-background relative overflow-hidden px-32">
        <div className="absolute top-0 right-0 w-64 h-64 bg-chart-4/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-1/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent z-10"></div>
              <Image src="/collar-Autumn.png" alt="Sobre AUTUMN" fill className="object-cover" />
            </div>
            <div className="space-y-6">
              <i className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 px-3 py-1">Nuestra Historia</i>
              <h2 className="text-3xl font-bold text-foreground">Sobre AUTUMN</h2>
              <p className="text-muted-foreground">
                AUTUMN nació de nuestra pasión por los colores y la atmósfera única que trae consigo la temporada de
                otoño. Cada accesorio que creamos está inspirado en las hojas que caen, los tonos cálidos y la sensación
                acogedora que caracteriza esta época del año.
              </p>
              <p className="text-muted-foreground">
                Nuestro compromiso es ofrecer accesorios de calidad que no solo complementen tu estilo, sino que también
                te conecten con la belleza natural del otoño, sin importar la temporada.
              </p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Conoce más sobre nosotros
              </Button>
            </div>
          </div>
        </div>
      </section>


      <section id="contacto" className="py-12 autumn-gradient-1 text-primary-foreground">
        <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto text-center space-y-4">
          
            <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-6">
              <Sun className="h-8 w-8" />
            </div>
            <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Contáctanos</h2>
            <p className="text-foreground mt-2">Estamos aquí para ayudarte con cualquier pregunta o inquietud.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-3xl mx-auto">
            <Card className="border-border/50 hover:border-primary/50 transition-colors md:col-span-2">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-chart-5/10 flex items-center justify-center">
                  <div className="flex gap-2">
                    <FaInstagram className="h-5 w-5 text-chart-5" />
                  </div>
                </div>
                <h3 className="font-medium text-foreground">Síguenos</h3>
                <p className="text-muted-foreground"><a href="https://www.instagram.com/autumn.pzo/#" target="_blank" rel="noopener noreferrer" 
                    className="hover:text-primary hover:underline transition-all">
                    @autumn.pzo
                  </a></p>
              </CardContent>
            </Card>
          </div>
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
  );
}

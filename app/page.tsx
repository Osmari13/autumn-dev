"use client"
import { useGetArticles } from "@/actions/articles/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  Badge, BadgeAlert, Coffee, Leaf, Mail, MapPin, ShoppingBag, Sun, Wind } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Home() {
  const { data: articles, loading, error } = useGetArticles()
  return (
    <div className="flex min-h-screen flex-col">
      {/* grid h-dvh w-dvw place-content-center bg-orange-200 */}
      {/* <div className="flex flex-col items-center space-y-3">
        <Image src={'/loguito_blanco-removebg.png'} width={250} height={250} alt="Logo Principal" className="rounded-[100px]"/>
        <h1 className="text-center text-4xl font-extrabold text-primary/85">AUTUMN.PZO</h1>
        <Button variant={"ghost"} className="hover:bg-red-500 hover:text-white text-black">
          <Link href={"/login"}>Iniciar Sesión</Link>
        </Button>
      </div> */}

      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm px-8">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-wider text-foreground">AUTUMN</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="#productos" className="text-foreground hover:text-primary transition-colors">
              Productos
            </Link>
            <Link href="#nosotros" className="text-foreground hover:text-primary transition-colors">
              Nosotros
            </Link>
            <Link href="#contacto" className="text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-muted">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Carrito</span>
            </Button>
            <Button className="hidden md:flex">Comprar ahora</Button>
            <Button className="hidden md:flex">
              <Link href={"/login"}>Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <section className="relative py-20 md:py-32 overflow-hidden leaf-pattern px-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted to-background/50 opacity-90"></div>
        <div className="container grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-8">
            <i className="bg-chart-1/20 text-chart-1 hover:bg-chart-1/30 px-3 py-1">
              Nueva Colección Otoño 2025
            </i>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Accesorios que capturan la esencia del <span className="text-primary">otoño</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubre nuestra colección de accesorios inspirados en los cálidos colores y la atmósfera acogedora del
              otoño.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button>Ver colección</Button>
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
              articles?.map((product, index) => (
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
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-foreground">{product.name}</h3>
                      <p className="text-muted-foreground">{product.price}</p>
                    </div>
                    <Button size="sm" className="bg-chart-5 hover:bg-chart-5/90 text-white">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Añadir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button>Ver todos los productos</Button>
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

      <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            <path d="M0,0 L100,100 M100,0 L0,100" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
          </svg>
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-6">
              <Sun className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold">Únete a nuestra comunidad</h2>
            <p>
              Suscríbete para recibir noticias sobre nuevos productos, ofertas especiales y consejos de estilo para la
              temporada.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-4 py-2 rounded-md flex-1 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <Button className="bg-chart-5 hover:bg-chart-5/90 text-white">Suscribirse</Button>
            </form>
            <p className="text-sm opacity-80">
              Al suscribirte, aceptas recibir correos electrónicos de marketing de AUTUMN.
            </p>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-16 bg-background px-32">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Contáctanos</h2>
            <p className="text-muted-foreground mt-2">Estamos aquí para ayudarte con cualquier pregunta o inquietud.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-chart-1/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-chart-1" />
                </div>
                <h3 className="font-medium text-foreground">Visítanos</h3>
                <p className="text-muted-foreground">Calle Otoño 123, Ciudad</p>
              </CardContent>
            </Card> */}

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-chart-4/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-chart-4" />
                </div>
                <h3 className="font-medium text-foreground">Escríbenos</h3>
                <p className="text-muted-foreground">info@autumn-accesorios.com</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-chart-5/10 flex items-center justify-center">
                  <div className="flex gap-2">
                    <FaInstagram className="h-5 w-5 text-chart-5" />
                    <FaFacebook className="h-5 w-5 text-chart-5" />
                  </div>
                </div>
                <h3 className="font-medium text-foreground">Síguenos</h3>
                <p className="text-muted-foreground">@autumn.pzo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 autumn-gradient-1 text-primary-foreground px-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6" />
                <span className="text-xl font-bold tracking-wider">AUTUMN</span>
              </div>
              <p className="text-sm opacity-80">
                Accesorios inspirados en los cálidos colores y la atmósfera acogedora del otoño.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2 opacity-80">
                <li>
                  <Link href="#" className="hover:opacity-100 transition-opacity">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#productos" className="hover:opacity-100 transition-opacity">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="#nosotros" className="hover:opacity-100 transition-opacity">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#contacto" className="hover:opacity-100 transition-opacity">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Ayuda</h4>
              <ul className="space-y-2 opacity-80">
                <li>
                  <Link href="#" className="hover:opacity-100 transition-opacity">
                    Envíos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100 transition-opacity">
                    Devoluciones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100 transition-opacity">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Contacto</h4>
              <ul className="space-y-2 opacity-80">
                <li>Ciudad Guayana</li>
                <li>info@autumn-accesorios.com</li>
                <li>+58 0414-8738350</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-80 text-sm">
            <p>&copy; {new Date().getFullYear()} AUTUMN. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

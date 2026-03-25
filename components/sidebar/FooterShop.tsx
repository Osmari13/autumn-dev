import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link"

export function FooterShop() {
  return (
     
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
      
  );
}

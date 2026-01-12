import {
  BookOpen,
  DollarSign,
  FileUser,
  Handshake,
  LayoutGrid,
  LucideIcon,
  User
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, role: string): Group[] {
  // Menu definition
  const menuList: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Administración",
      menus: [
        {
          href: "/proveedores",
          label: "Proveedores",
          active: pathname.includes("/proveedores"),
          icon: Handshake,
          submenus: []
        },
        {
          href: "/clientes",
          label: "Clientes",
          active: pathname.includes("/clientes"),
          icon: FileUser,
          submenus: []
        },
       
        {
          href: "/catalogo",
          label: "Catalogo",
          active: pathname.includes("/catalogo"),
          icon: BookOpen,
          submenus: [
            {
              href: "/catalogo/categorias",
              label: "Categorias",
              active: pathname === "/catalogo/categorias"
            },
            {
              href: "/catalogo/articulos",
              label: "Articulos",
              active: pathname === "/catalogo/articulos"
            },
          ]
        },
        {
            href: "/transaccion",
            label: "Transacciones",
            active: pathname.includes("/transaccion"),
            icon: DollarSign,
            submenus: []
        },
        
      ]
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          href: "/configuracion/usuarios",
          label: "Usuarios",
          active: pathname.includes("/configuracion/usuarios"),
          icon: User,
          submenus: []
        },
     
      ]
    }
  ];

  // Filter logic based on user role
  return menuList.map(group => ({
    ...group,
    menus: group.menus
      .filter(menu => {
        // General filtering for SELLER role
        if (role === "USER") {
          // Exclude specific menus for SELLER
          if ( menu.label === "Usuarios" || menu.label === "Registro Articulos") {
            return false;
          }
        }
        return true;
      })
      // .map(menu => {
      //   // Filter "Pagados" and "Pendientes" from "Boletos" for SELLER role
      //   if (role === "SELLER" && menu.label === "Boletos") {
      //     return {
      //       ...menu,
      //       submenus: menu.submenus.filter(
      //         submenu => submenu.label !== "Pagados" && submenu.label !== "Pendientes"
      //       )
      //     };
      //   }
      //   return menu;
      // })
  }));
}

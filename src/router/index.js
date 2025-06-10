import { createRouter, createWebHistory } from "vue-router";
import CarritoDeCompras from "@/cart/CarritoDeCompras.vue";
import ProductoCliente from "@/cart/ProductoCliente.vue";
import ProductosAdmin from "@/admin/ProductosAdmin.vue";
import HomeScreen from "@/cart/HomeScreen.vue";
import InicioSesion from "@/auth/InicioSesion.vue";
import RegistroUsuario from "@/auth/RegistroUsuario.vue";
import ProveedorInfo from "@/admin/ProveedorInfo.vue";
import MetodoPago from "@/cart/RelizarPagos.vue";
import PerfilUsuario from "@/user/PerfilUsuario.vue";
import RealizarPagos from "@/cart/RelizarPagos.vue";
import PerfilAdmin from "@/admin/PerfilAdmin.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "HomeScreen",
      component: HomeScreen, 
    },
    {
      path: "/inicio-sesion",
      name: "InicioSesion",
      component: InicioSesion, 
    },
    {
      path: "/registro-usuario",
      name: "RegistroUsuario",
      component: RegistroUsuario, 
    },
    {
      path: "/carrito-compras",
      name: "CarritoDeCompras",
      component: CarritoDeCompras, 
    },
    {
      path: "/producto-cliente",
      name: "ProductoCliente",
      component: ProductoCliente, 
    },
    {
      path: "/productos-admin",
      name: "ProductosAdmin",
      component: ProductosAdmin, 
    },
    {
      path: "/proveedor-info",
      name: "ProveedorInfo",
      component: ProveedorInfo, 
    },
    {
      path: "/metodo-pago",
      name: "MetodoPago",
      component: MetodoPago, 
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/", // Redirecciona cualquier ruta no válida
    },
    {
      path: "/perfil-usuario",
      name: "PerfilUsuario",
      component: PerfilUsuario, 
    },   
    {
      path: "/realizar-pago",
      name: "RealizarPago",
      component: RealizarPagos, 
    },
    {
      path: "/perfil-admin",
      name: "PerfilAdminitrador",
      component: PerfilAdmin, 
    }
  ],
});

export default router;

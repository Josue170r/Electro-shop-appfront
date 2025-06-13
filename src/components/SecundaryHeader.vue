<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo con imagen -->
      <div class="logo-section">
        <img src="@/assets/logoElectroShop.png" alt="ElectroShop" class="logo-image" />
        <h1 class="logo">ElectroShop</h1>
      </div>

      <!-- Botón hamburguesa para móvil -->
      <button 
        class="mobile-menu-toggle d-lg-none"
        @click="toggleMobileMenu"
        :class="{ 'active': showMobileMenu }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navegación -->
      <nav class="nav-desktop d-none d-lg-block">
        <ul class="nav-menu">
          <li>
            <router-link 
              to="/home-screen" 
              class="nav-link"
            >
              Inicio
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Navegación móvil -->
      <nav class="nav-mobile d-lg-none" :class="{ 'show': showMobileMenu }">
        <ul class="nav-menu-mobile">
          <li>
            <router-link 
              to="/home-screen" 
              class="nav-link-mobile"
              @click="closeMobileMenu"
            >
              <i class="bi bi-house-door me-2"></i>
              Inicio
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="actions-group">
        <div class="user-actions">
          <RouterLink :to="isLogged ? '/perfil-usuario' : '/inicio-sesion'" class="button-link">
            <button class="icon-button user-button">
              <UserIcon />
              <span class="user-text d-none d-md-inline">{{ isLogged ? 'Mi Perfil' : 'Iniciar Sesión' }}</span>
            </button>
          </RouterLink>

          <!-- Carrito -->
          <RouterLink to="/carrito-compras" class="button-link">
            <button class="icon-button cart-button">
              <ShoppingCartIcon />
              <span class="cart-count" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
              <span class="cart-text d-none d-md-inline">Mi carrito</span>
            </button>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Overlay para móvil -->
    <div 
      v-if="showMobileMenu" 
      class="mobile-overlay d-lg-none"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ShoppingCartIcon, UserIcon } from "lucide-vue-next";
import axios from "axios";

let cartItemsCount = ref(1);
const showMobileMenu = ref(false);

const user = JSON.parse(localStorage.getItem("userInfo"));
const isLogged = JSON.parse(localStorage.getItem("isLogged"));

const fetchCartItemsCount = async () => {
  try {
    const response = await axios.get("/api/v1/cart/count-items/", {
      params: { idCarrito: user.carrito.idCarrito }
    });
    cartItemsCount.value = response.data;
  } catch (error) {
    console.error("Error al contar los items del carrito:", error);
    cartItemsCount.value = 0;
  }
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

onMounted(() => {
  fetchCartItemsCount();
});
</script>

<style scoped>
/* Estilos para el header */
.header {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
}

/* Logo con imagen */
.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.logo-image {
  width: 6rem;
  height: 6rem;
  object-fit: contain;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  white-space: nowrap;
  margin: 0;
}

/* Botón hamburguesa */
.mobile-menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.mobile-menu-toggle span {
  width: 2rem;
  height: 0.25rem;
  background: #4b5563;
  border-radius: 10px;
  transition: all 0.3s ease;
  transform-origin: 1px;
}

.mobile-menu-toggle.active span:first-child {
  transform: rotate(45deg);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg);
}

/* Menú de navegación escritorio */
.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
}

.nav-link.router-link-active {
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
}

/* Menú móvil */
.nav-mobile {
  position: fixed;
  top: 0;
  left: -100%;
  width: 280px;
  height: 100vh;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 1000;
  padding-top: 2rem;
}

.nav-mobile.show {
  left: 0;
}

.nav-menu-mobile {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
}

.nav-link-mobile {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link-mobile:hover {
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
}

/* Overlay móvil */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Grupo de acciones */
.actions-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Botones de usuario y carrito */
.user-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Quitar línea azul de enlaces */
.button-link {
  text-decoration: none !important;
}

.button-link:hover,
.button-link:focus,
.button-link:active {
  text-decoration: none !important;
}

/* Iconos y botones mejorados */
.icon-button {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.icon-button:hover {
  color: #2563eb;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.cart-button {
  position: relative;
}

.user-button {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.cart-text {
  font-size: 0.875rem;
  color: inherit;
  font-weight: 500;
}

.user-text {
  font-size: 0.875rem;
  color: inherit;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 991.98px) {
  .header-container {
    padding: 1rem;
  }
  
  .logo-image {
    width: 5rem;
    height: 5rem;
  }
  
  .logo {
    font-size: 1.25rem;
  }
  
  .actions-group {
    gap: 0.75rem;
  }
  
  .icon-button {
    padding: 0.625rem 0.75rem;
  }
}

@media (max-width: 575.98px) {
  .header-container {
    padding: 0.75rem;
    gap: 1rem;
  }
  
  .logo-image {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .logo {
    font-size: 1.125rem;
  }
  
  .user-actions {
    gap: 0.5rem;
  }
  
  .icon-button {
    padding: 0.5rem;
    min-width: 44px;
    justify-content: center;
  }
}
</style>
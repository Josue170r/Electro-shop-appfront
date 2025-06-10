<template>
  <header class="header">
    <div class="header-container">
      <h1 class="logo">ElectroShop</h1>

      <nav>
        <ul class="nav-menu">
          <li>
            <router-link 
              to="/home-screen" 
              class="text-dark text-decoration-none p-2 d-inline-block link-hover"
            >
              <h6>Inicio</h6>
            </router-link>
          </li>
          <router-link 
              to="/productos-admin" 
              class="text-dark text-decoration-none p-2 d-inline-block link-hover"
            >
              <h6>Nuevo producto</h6>
            </router-link>
        </ul>
      </nav>

      <div class="actions-group">
        <div class="user-actions">
          <RouterLink :to="isLoggedIn ? '/perfil-usuario' : '/inicio-sesion'" class="user-link">
            <button class="icon-button user-button">
              <!-- Mostrar imagen del usuario si existe, sino UserIcon -->
              <div class="user-avatar-container">
                <img 
                  v-if="userImageUrl" 
                  :src="userImageUrl" 
                  alt="Foto de perfil"
                  class="user-avatar-image"
                />
                <UserIcon v-else class="user-avatar-icon" />
              </div>
              <span class="user-text">{{ isLoggedIn ? 'Mi Perfil' : 'Iniciar Sesión' }}</span>
            </button>
          </RouterLink>

          <!-- Carrito -->
          <RouterLink to="/carrito-compras" class="cart-link">
            <button class="icon-button cart-button">
              <ShoppingCartIcon />
              <span class="cart-count">{{ cartItemsCount }}</span>
              <span class="cart-text">Mi carrito</span>
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>

  <!-- Modal de Contacto -->
  <div 
    v-if="showContactModal" 
    class="contact-dropdown mt-3 shadow-lg border-0 p-4 w-50"
  >
    <div class="modal-header bg-primary text-white border-0 rounded-top position-relative p-2">
      <h5 class="modal-title d-flex align-items-center fw-bold mb-0">
        <i class="bi bi-people-fill me-2"></i>
        Información de Contacto
      </h5>
      <button 
        type="button" 
        class="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
        @click="toggleContactModal"
        aria-label="Close"
      ></button>
    </div>

    <div class="modal-body p-4">
      <p class="text-muted mb-4">
        A continuación, encontrarás los datos de las personas encargadas del proyecto. Si necesitas más información, no dudes en contactarnos.
      </p>
      <div class="row g-3">
        <div 
          class="col-md-6" 
          v-for="(contact, index) in contacts" 
          :key="index"
        >
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="card-title fw-bold mb-2">
                <i class="bi bi-person-fill text-primary me-2"></i>{{ contact.name }}
              </h6>
              <p class="card-text mb-1">
                <i class="bi bi-envelope-fill text-secondary me-2"></i>{{ contact.email }}
              </p>
              <a 
                :href="'mailto:' + contact.email" 
                class="btn btn-sm btn-outline-primary mt-2"
              >
                <i class="bi bi-send"></i> Enviar Correo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer bg-light"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from 'vuex';
import { SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-vue-next";
import axios from "axios";

const store = useStore();

let searchQuery = ref("");
let isSearchBarEnabled = ref(true);
let cartItemsCount = ref(0);

// Obtener datos del usuario desde Vuex
const user = computed(() => store.state.users.user);
const tokenAccess = computed(() => store.state.users.tokenAccess);

// Verificar si está logueado basado en tokenAccess
const isLoggedIn = computed(() => {
  return tokenAccess.value && tokenAccess.value.length > 0;
});

// URL de la imagen del usuario
const userImageUrl = computed(() => {
  if (user.value && user.value.foto) {
    return `data:image/jpeg;base64,${user.value.foto}`;
  }
  return null;
});

const fetchCartItemsCount = async () => {
  try {
      const response = await axios.post("/cuenta_carrito", {
        id_usuario: user.value.id_usuario,
        token: tokenAccess.value,
      });
      cartItemsCount.value = response.data
  } catch (error) {
    console.error("Error al contar los items del carrito:", error);
    cartItemsCount.value = 0;
  }
};

onMounted(() => {
  if (isLoggedIn) {
    fetchCartItemsCount();
  }
});

const contacts = ref([
  { name: "Adriana Vanessa Trejo Reyes", email: "atrejor1601@alumno.ipn.mx" },
  { name: "Carlos Moreno Hernandez", email: "cmorenoh2000@alumno.ipn.mx" },
  { name: "Josué Montalbán Rojas", email: "jmontalbanr2000@alumno.ipn.mx" },
  { name: "Gerardo Uriel Ortiz Ramírez", email: "gortizr2001@alumno.ipn.mx" },
]);

const showContactModal = ref(false);
const toggleContactModal = () => {
  showContactModal.value = !showContactModal.value;
};
</script>

<style scoped>
/* Estilos para el header, búsqueda y botones */
.header {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  white-space: nowrap;
}

/* Menú de navegación */
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
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #2563eb;
}

/* Grupo de acciones */
.actions-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Barra de búsqueda */
.search-bar {
  position: relative;
  width: 300px;
  flex-shrink: 0;
}

.search-bar input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #2563eb;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

/* Botones de usuario y carrito */
.user-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Quitar TODAS las decoraciones de links */
.user-link,
.cart-link {
  text-decoration: none !important;
  color: inherit !important;
}

.user-link:hover,
.cart-link:hover,
.user-link:focus,
.cart-link:focus,
.user-link:active,
.cart-link:active {
  text-decoration: none !important;
  color: inherit !important;
  outline: none;
}

/* Iconos y botones */
.icon-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #4b5563;
  transition: color 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
}

.icon-button:hover {
  color: #2563eb;
}

.cart-button {
  position: relative;
}

.user-button {
  position: relative;
}

/* Estilos para el avatar del usuario */
.user-avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.5rem;
}

.user-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-avatar-icon {
  width: 24px;
  height: 24px;
  color: #4b5563;
}

.cart-count {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-text {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.user-text {
  font-size: 0.875rem;
  color: #4b5563;
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-info a {
  color: #2563eb;
  text-decoration: none;
}

.user-info a:hover {
  text-decoration: underline;
}

/* Estilos del modal de contacto */
.contact-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
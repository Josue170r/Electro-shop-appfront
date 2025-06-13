<template>
  <div class="min-vh-100 bg-light">
    <!-- Secondary Header -->
    <SecundaryHeader />
    
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="sidebar-content">
          <!-- Header del sidebar -->
          <div class="sidebar-header">
            <div class="user-info">
              <div class="user-avatar">
                <img src="@/assets/usuario.png" alt="Usuario" />
              </div>
              <div class="user-details">
                <h6 class="mb-0 fw-bold">{{ userName }}</h6>
                <small class="text-muted">Panel de Usuario</small>
              </div>
            </div>
          </div>

          <!-- Navegación del sidebar -->
          <nav class="sidebar-nav">
            <ul class="nav-options">
              <li 
                v-for="option in options" 
                :key="option.view"
                class="nav-item"
              >
                <button
                  class="nav-option"
                  :class="{ 'active': activeView === option.view }"
                  @click="setView(option.view)"
                >
                  <div class="nav-icon">
                    <component :is="option.icon" size="20" />
                  </div>
                  <span class="nav-label">{{ option.label }}</span>
                  <i class="bi bi-chevron-right nav-arrow"></i>
                </button>
              </li>
            </ul>
          </nav>

          <!-- Footer del sidebar -->
          <div class="sidebar-footer">
            <button class="logout-btn" @click="logout">
              <i class="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <!-- Botón toggle sidebar móvil -->
      <button 
        class="sidebar-toggle d-lg-none"
        @click="toggleSidebar"
      >
        <i class="bi bi-list"></i>
      </button>

      <!-- Overlay del sidebar móvil -->
      <div 
        v-if="sidebarOpen" 
        class="sidebar-overlay d-lg-none"
        @click="closeSidebar"
      ></div>

      <!-- Contenido principal -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/home-screen" class="text-decoration-none">
                  <i class="bi bi-house me-1"></i>Inicio
                </router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/perfil-usuario" class="text-decoration-none">
                  Mi Cuenta
                </router-link>
              </li>
              <li class="breadcrumb-item active">{{ getCurrentSectionName() }}</li>
            </ol>
          </nav>

          <!-- Componente dinámico -->
          <div class="content-section">
            <component :is="currentComponent" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import SecundaryHeader from "@/components/SecundaryHeader.vue";
import DireccionesEnvio from "@/user/DireccionesEnvio.vue";
import Pedidos from "@/user/Pedidos.vue";
import DatosUsuario from "@/user/DatosUsuario.vue";
import CambiarContraseña from "@/auth/CambiarContraseña.vue";
import {
  LockKeyholeIcon,
  HomeIcon,
  BaggageClaimIcon,
  UserCircle2,
} from "lucide-vue-next";

export default {
  name: "SidebarLayout",
  components: {
    SecundaryHeader,
    DireccionesEnvio,
    Pedidos,
    DatosUsuario,
    CambiarContraseña,
    LockKeyholeIcon,
    HomeIcon,
    BaggageClaimIcon,
    UserCircle2,
  },
  data() {
    return {
      activeView: "DatosUsuario",
      sidebarOpen: false,
      user: {},
      options: [
        {
          label: "Mi Perfil",
          view: "DatosUsuario",
          icon: UserCircle2,
        },
        {
          label: "Mis Pedidos",
          view: "Pedidos",
          icon: BaggageClaimIcon,
        },
        {
          label: "Direcciones de Envío",
          view: "DireccionesEnvio",
          icon: HomeIcon,
        },
        {
          label: "Cambiar Contraseña",
          view: "CambiarContraseña",
          icon: LockKeyholeIcon,
        },
      ],
    };
  },
  computed: {
    currentComponent() {
      return this.activeView;
    },
    userName() {
      return this.user.nombre ? `${this.user.nombre} ${this.user.apellidos}` : 'Usuario';
    },
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userInfo")) || {};
  },
  methods: {
    getCurrentSectionName() {
      const currentOption = this.options.find(opt => opt.view === this.activeView);
      return currentOption ? currentOption.label : 'Mi Cuenta';
    },
    setView(view) {
      this.activeView = view;
      this.closeSidebar();
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    },
    logout() {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('isLogged');
      this.$router.push({ name: 'InicioSesion' });
    },
  },
};
</script>

<style scoped>
/* Main layout */
.main-layout {
  display: flex;
  min-height: calc(100vh - 80px);
  position: relative;
}

/* Sidebar styles */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e5e7eb;
  position: fixed;
  top: 80px;
  left: -280px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  transition: left 0.3s ease;
  z-index: 999;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.sidebar-open {
  left: 0;
}

@media (min-width: 992px) {
  .sidebar {
    position: fixed;
    left: 0;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
}

.sidebar-content {
  padding: 2rem 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Sidebar header */
.sidebar-header {
  padding: 0 2rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details h6 {
  color: #1f2937;
}

/* Sidebar navigation */
.sidebar-nav {
  flex: 1;
  padding: 0 1rem;
}

.nav-options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-option {
  width: 100%;
  background: none;
  border: none;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  color: #4b5563;
}

.nav-option:hover {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #2563eb;
  transform: translateX(4px);
}

.nav-option.active {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #2563eb;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-label {
  flex: 1;
  font-size: 0.95rem;
}

.nav-arrow {
  opacity: 0;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.nav-option:hover .nav-arrow,
.nav-option.active .nav-arrow {
  opacity: 1;
}

/* Sidebar footer */
.sidebar-footer {
  padding: 2rem 2rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  width: 100%;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

/* Sidebar toggle button */
.sidebar-toggle {
  position: fixed;
  top: 100px;
  left: 1rem;
  z-index: 1000;
  background: #2563eb;
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
}

/* Sidebar overlay */
.sidebar-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Main content */
.main-content {
  flex: 1;
  width: 100%;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

@media (min-width: 992px) {
  .main-content {
    margin-left: 280px;
    width: calc(100% - 280px);
  }
}

.content-wrapper {
  padding: 2rem;
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
}

.content-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: slideInUp 0.6s ease-out;
}

/* Breadcrumb */
.breadcrumb {
  background: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
  color: #6c757d;
  font-weight: bold;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 991.98px) {
  .content-wrapper {
    padding: 1rem;
  }
}

@media (max-width: 575.98px) {
  .content-wrapper {
    padding: 0.5rem;
  }
  
  .sidebar {
    width: 100%;
    left: -100%;
  }
  
  .sidebar.sidebar-open {
    left: 0;
  }
  
  .sidebar-toggle {
    top: 90px;
  }
}
</style>
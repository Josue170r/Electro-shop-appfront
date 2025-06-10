<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo -->
      <h1 class="logo">ElectroShop</h1>

      <!-- Menú de navegación -->
      <nav>
        <ul class="nav-menu">
          <li>
            <a
              href="#"
              class="w-100 nav-link"
              @click.prevent="setView('productos')"
            >
              Productos
            </a>
          </li>

          <li>
            <a
              href="#"
              class="nav-link w-100"
              @click.prevent="setView('pedidos')"
            >
              Pedidos
            </a>
          </li>
        </ul>
      </nav>

      <!-- Grupo de acciones -->
      <div class="actions-group">
        <div class="user-actions">
          <router-link to="/inicio-sesion" class="icon-button">
            <UserIcon />
          </router-link>
        </div>
      </div>
    </div>
  </header>

  <div class="d-flex">
    <!-- Sidebar -->
    <div class="bg-light p-3" style="width: 250px; height: 100vh">
      <div
        class="d-flex justify-content-center align-items-center mb-4"
        style="height: 120px"
      >
        <img
          src="../assets/logo.jpg"
          alt="Logo"
          class="img-fluid"
          style="max-height: 150px"
        />
      </div>
      <h5 class="mb-4">Opciones</h5>
      <ul class="nav flex-column">
        <!-- Opciones del Sidebar -->
        <li class="nav-item" v-for="option in options" :key="option.id">
          <a
            href="#"
            class="nav-link d-flex align-items-center"
            :class="{
              'text-primary': activeView === option.id,
              'selected-option': activeView === option.id,
            }"
            @click="setView(option.id)"
          >
            <span class="me-2" v-if="option.icon">
              <component :is="option.icon" />
            </span>
            <span class="text-dark">{{ option.label }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="p-4 flex-grow-1">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script>
import PedidosAdmin from "./PedidosAdmin.vue";
import ProductosAdmin from "./ProductosAdmin.vue";
import { UserIcon } from "lucide-vue-next";
import { PackageSearch, ClipboardList } from "lucide-vue-next";

export default {
  name: "SidebarLayout",
  components: {
    PedidosAdmin,
    ProductosAdmin,
    UserIcon,
  },
  data() {
    return {
      activeView: "pedidos",
      options: [
        { id: "pedidos", label: "Historial de pedidos", icon: ClipboardList },
        { id: "productos", label: "Gestión de productos", icon: PackageSearch },
      ],
    };
  },
  computed: {
    currentComponent() {
      if (this.activeView === "pedidos") {
        return "PedidosAdmin";
      } else if (this.activeView === "productos") {
        return "ProductosAdmin";
      }
    },
  },
  methods: {
    setView(id) {
      this.activeView = id;
    },
  },
};
</script>

<style scoped>
.bg-light {
  border-right: 1px solid #ddd;
}

.nav-link {
  cursor: pointer;
  color: black;
}

.nav-link.selected-option {
  background-color: #cbdef1; 
  color: white;
  font-weight: bold;
}

.nav-link:hover {
  background-color: #f8f9fa;
}

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

.nav-link:hover, 
.nav-link:focus {
  color: #1f2937;
}

.nav-link:hover {
  color: #2563eb;
}

.actions-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.icon-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #4b5563;
  transition: color 0.3s ease;
  position: relative;
}

.icon-button:hover {
  color: #2563eb;
}

.cart-button {
  position: relative;
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

.contact-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  width: 50%;
  background-color: white;
  border-radius: 5px;
  z-index: 1000;
}

@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: space-around;
  }

  .actions-group {
    flex-grow: 1;
    justify-content: flex-end;
  }
}
</style>

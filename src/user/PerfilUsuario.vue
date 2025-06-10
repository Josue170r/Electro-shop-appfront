<template>
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
        <li class="nav-item" v-for="option in options" :key="option.view">
          <a
            href="#"
            class="nav-link d-flex align-items-center"
            :class="{
              'text-primary': activeView === option.view,
              'selected-option': activeView === option.view,
            }"
            @click="setView(option.view)"
          >
            <span class="me-2" v-if="option.icon">
              <component :is="option.icon" />
            </span>
            <span class="text-dark">{{ option.label }}</span>
            <!-- Texto en negro -->
          </a>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="p-4 flex-grow-1">
      <MainHeader />
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MainHeader from '@/components/MainHeader.vue';
import DatosUsuario from "@/user/DatosUsuario.vue";
import {
  UserCircle2,
} from "lucide-vue-next";

export default {
  name: "SidebarLayout",
  components: {
    DatosUsuario,
    UserCircle2,
    MainHeader,
  },
  data() {
    return {
      activeView: "DatosUsuario",
      options: [
        { label: "General", view: "DatosUsuario", icon: UserCircle2 },
      ],
    };
  },
  computed: {
    currentComponent() {
      return this.activeView;
    },
    ...mapState('users', {
      user: 'user'
    }),
  },
  methods: {
    setView(view) {
      this.activeView = view;
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
  color: black; /* Color de texto por defecto */
}
.nav-link.selected-option {
  background-color: #cbdef1; /* Fondo resaltado para opción seleccionada */
  color: white; /* Cambiar color de texto cuando se selecciona */
  font-weight: bold; /* Resaltar el texto */
}
.nav-link:hover {
  background-color: #f8f9fa; /* Color al pasar el mouse */
}
</style>

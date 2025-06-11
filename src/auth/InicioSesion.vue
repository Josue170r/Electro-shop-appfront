<template>
  <div class="login-wrapper">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Imagen a la izquierda -->
        <div class="col-lg-6 login-image-section">
          <div class="image-content">
            <div class="logo-container">
              <img
                src="@/assets/logoElectroShop.png"
                alt="ElectroShop Logo"
                class="logo-image"
              />
            </div>
            <div class="welcome-content">
              <h2 class="welcome-title">¡Bienvenido de vuelta!</h2>
              <p class="welcome-subtitle">
                Accede a tu cuenta y descubre las mejores ofertas en tecnología
              </p>
            </div>
          </div>
        </div>

        <!-- Formulario de inicio de sesión -->
        <div class="col-lg-6 login-form-section">
          <div class="form-wrapper">
            <div class="form-header text-center mb-4">
              <h2 class="form-title">Iniciar Sesión</h2>
              <p class="form-subtitle">Ingresa tus credenciales para continuar</p>
            </div>

            <form @submit.prevent="handleSubmit" class="login-form">
              <!-- Campo de nombre de usuario -->
              <div class="form-group mb-3">
                <label for="username" class="form-label">
                  <i class="fas fa-user me-2"></i>Nombre de usuario
                </label>
                <div class="input-group">
                  <span class="input-group-text input-icon">
                    <i class="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="username"
                    v-model="username"
                    class="form-control custom-input"
                    :class="{ 'is-invalid': usernameError }"
                    placeholder="Ingresa tu nombre de usuario"
                    required
                  />
                </div>
                <div v-if="usernameError" class="invalid-feedback">{{ usernameError }}</div>
              </div>

              <!-- Campo de contraseña -->
              <div class="form-group mb-4">
                <label for="password" class="form-label">
                  <i class="fas fa-lock me-2"></i>Contraseña
                </label>
                <div class="input-group">
                  <span class="input-group-text input-icon">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    v-model="password"
                    class="form-control custom-input"
                    :class="{ 'is-invalid': passwordError }"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                <div v-if="passwordError" class="invalid-feedback">
                  {{ passwordError }}
                </div>
              </div>

              <!-- Botón de inicio de sesión -->
              <button type="submit" class="btn btn-primary btn-login w-100 mb-3">
                <i class="fas fa-sign-in-alt me-2"></i>
                Iniciar Sesión
              </button>

              <!-- Botón para regresar al inicio -->
              <router-link
                to="/home-screen"
                class="btn btn-outline-primary btn-secondary-action w-100 mb-3"
              >
                <i class="fas fa-arrow-left me-2"></i>
                Regresar a Inicio
              </router-link>

              <!-- Enlace para registrarse -->
              <div class="register-section text-center">
                <p class="register-text">
                  ¿No tienes cuenta?
                  <router-link to="/registro-usuario" class="register-link">
                    Regístrate aquí
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';
import router from "@/router";

// Estado de los campos
const username = ref("");
const password = ref("");

// Errores
const usernameError = ref("");
const passwordError = ref("");

// Función para manejar el envío del formulario
const handleSubmit = async () => {
  try {
    // Reiniciar errores
    usernameError.value = "";
    passwordError.value = "";

    // Validaciones básicas
    if (!username.value.trim()) {
      usernameError.value = "El nombre de usuario es requerido";
      return;
    }

    if (!password.value.trim()) {
      passwordError.value = "La contraseña es requerida";
      return;
    }

    // Llamada al endpoint de login
    const response = await axios.post("/api/v1/login", {
      username: username.value,
      password: password.value,
    });
    
    if (response) {
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      localStorage.setItem("isLogged", "true");
      let role = response.data.role.nombreRole;
      
      if (response.data.isVerified) {
        toast("¡Inicio de sesión exitoso!", {
          hideProgressBar: true,
          autoClose: 1000,
          type: "success",
          theme: "colored",
          onClose: () => {
            if (role === "CLIENT") {
              router.push({ name: 'HomeScreen'});
            } else {
              router.push({ name: 'PerfilAdminitrador'});
            }
          }
        });
      } else {
        sendToken(response.data.email);
      }
    }   
  } catch (error) {
    if (error.response) {
      let messageError = error.response.data.message || "Error al iniciar sesión";
      toast(messageError, {
        hideProgressBar: true,
        autoClose: 3000,
        type: "error",
        theme: "colored",
      });
    } else {
      toast("Error de conexión. Verifica tu internet.", {
        hideProgressBar: true,
        autoClose: 3000,
        type: "error",
        theme: "colored",
      });
    }
  }
};

const sendToken = async (email) => {
  try {
    const response = await axios.get('/api/v1/send-token', {
      params: { email },
    });
    
    if (response) {
      toast("Debes verificar tu cuenta primero", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "warning",
        theme: "colored",
        onClose: () => {
          router.push({
            name: 'Autenticacion',
            query: { email }
          });
        },
      });
    }
  } catch (error) {
    if (error.response) {
      let messageError = error.response.data.message || "Error al enviar código de verificación";
      toast(messageError, {
        hideProgressBar: true,
        autoClose: 3000,
        type: "error",
        theme: "colored",
      });
    }
  }
};
</script>

<style scoped>
/* Importar Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Variables CSS */
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
  
  --card-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  --input-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --transition: all 0.15s ease-in-out;
}

/* Wrapper principal */
.login-wrapper {
  min-height: 100vh;
  background: var(--bs-light);
}

.h-100 {
  height: 100vh !important;
}

/* Sección de imagen */
.login-image-section {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0b5ed7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-image-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.1)" points="0,0 1000,200 1000,1000 0,800"/></svg>');
  z-index: 1;
}

.image-content {
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 400px;
  padding: 2rem;
}

.logo-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-image {
  max-width: 100%;
  height: auto;
  max-height: 150px;
}

.welcome-content {
  color: white;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
}

.welcome-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.95;
  text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
}

/* Sección del formulario */
.login-form-section {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper {
  max-width: 450px;
  width: 100%;
  padding: 2rem;
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  color: var(--bs-dark);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--bs-primary);
}

.form-subtitle {
  color: var(--bs-secondary);
  font-size: 1.1rem;
  margin: 0;
}

/* Formulario */
.login-form {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
}

/* Labels */
.form-label {
  color: var(--bs-dark);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-label i {
  color: var(--bs-primary);
}

/* Input groups */
.input-group {
  box-shadow: var(--input-shadow);
  border-radius: 0.5rem;
  overflow: hidden;
}

.input-icon {
  background: var(--bs-primary);
  color: white;
  border: none;
  font-weight: 600;
}

.custom-input {
  border: 2px solid #dee2e6;
  border-left: none;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  transition: var(--transition);
}

.custom-input:focus {
  border-color: var(--bs-primary);
  box-shadow: none;
  background: rgba(var(--bs-primary-rgb), 0.02);
}

.input-group:focus-within {
  transform: translateY(-1px);
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.15);
}

/* Botones */
.btn-login {
  background: var(--bs-primary) !important;
  border: none !important;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.025rem;
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.2);
  color: white !important;
}

.btn-login:hover {
  background: #0b5ed7 !important;
  transform: translateY(-2px);
  box-shadow: 0 0.375rem 0.75rem rgba(var(--bs-primary-rgb), 0.3);
}

.btn-secondary-action {
  border: 2px solid var(--bs-primary) !important;
  border-radius: 0.75rem;
  font-weight: 600;
  color: var(--bs-primary) !important;
  transition: var(--transition);
  background: transparent !important;
  padding: 0.875rem 2rem;
}

.btn-secondary-action:hover {
  background: var(--bs-primary) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: var(--input-shadow);
}

/* Sección de registro */
.register-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.register-text {
  color: var(--bs-secondary);
  margin: 0;
  font-size: 0.95rem;
}

.register-link {
  color: var(--bs-primary) !important;
  text-decoration: none !important;
  font-weight: 600;
  transition: var(--transition);
}

.register-link:hover {
  color: #0b5ed7 !important;
  text-decoration: underline !important;
}

/* Mensajes de error */
.invalid-feedback {
  color: var(--bs-danger);
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: var(--bs-danger) !important;
}

/* Responsividad */
@media (max-width: 991.98px) {
  .login-image-section {
    min-height: 40vh;
  }
  
  .form-title {
    font-size: 2rem;
  }
  
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .form-wrapper {
    padding: 1.5rem;
  }
  
  .login-form {
    padding: 1.5rem;
  }
}

@media (max-width: 767.98px) {
  .h-100 {
    height: auto !important;
    min-height: 100vh;
  }
  
  .login-image-section {
    min-height: 35vh;
  }
  
  .form-wrapper {
    padding: 1rem;
  }
  
  .login-form {
    padding: 1rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
  
  .logo-image {
    max-height: 120px;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form {
  animation: fadeInUp 0.6s ease-out;
}

.image-content {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Estados hover mejorados */
.logo-container:hover {
  transform: scale(1.02);
  transition: var(--transition);
}

/* Accesibilidad */
.custom-input:focus-visible,
.btn-login:focus-visible,
.btn-secondary-action:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}
</style>
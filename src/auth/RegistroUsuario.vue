<template>
  <div class="register-wrapper">
    <div class="container-fluid">
      <div class="row min-vh-100">
        <!-- Imagen a la izquierda -->
        <div class="col-lg-5 d-flex align-items-center justify-content-center register-image-section">
          <div class="image-container text-center">
            <div class="logo-wrapper">
              <img
                src="@/assets/logoElectroShop.png"
                alt="ElectroShop Logo"
                class="logo-image"
              />
            </div>
            <h3 class="welcome-title">¡Bienvenido a ElectroShop!</h3>
            <p class="welcome-subtitle">Únete a nuestra comunidad y descubre las mejores ofertas en tecnología</p>
          </div>
        </div>

        <!-- Formulario de registro -->
        <div class="col-lg-7 d-flex align-items-center justify-content-center register-form-section">
          <div class="form-container">
            <div class="form-header text-center mb-4">
              <h2 class="form-title">Crear Cuenta</h2>
              <p class="form-subtitle">Complete sus datos para registrarse</p>
            </div>

            <form @submit.prevent="handleRegister" class="registration-form">
              <!-- Campo de correo y nombre de usuario -->
              <div class="row g-3 mb-3">
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="email"
                      id="email"
                      v-model="email"
                      class="form-control custom-input"
                      :class="{ 'is-invalid': emailError }"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                    <label for="email">
                      <i class="fas fa-envelope me-2"></i>Correo Electrónico
                    </label>
                    <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="text"
                      id="userName"
                      v-model="userName"
                      class="form-control custom-input"
                      placeholder="usuario123"
                      required
                    />
                    <label for="userName">
                      <i class="fas fa-user me-2"></i>Nombre de Usuario
                    </label>
                  </div>
                </div>
              </div>

              <!-- Campo de contraseña y confirmar contraseña -->
              <div class="row g-3 mb-3">
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="password"
                      id="password"
                      v-model="password"
                      class="form-control custom-input"
                      :class="{ 'is-invalid': passwordError }"
                      placeholder="Contraseña"
                      required
                    />
                    <label for="password">
                      <i class="fas fa-lock me-2"></i>Contraseña
                    </label>
                    <div v-if="passwordError" class="invalid-feedback">{{ passwordError }}</div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="password"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      class="form-control custom-input"
                      :class="{ 'is-invalid': confirmPasswordError }"
                      placeholder="Confirmar contraseña"
                      required
                    />
                    <label for="confirmPassword">
                      <i class="fas fa-lock me-2"></i>Confirmar Contraseña
                    </label>
                    <div v-if="confirmPasswordError" class="invalid-feedback">{{ confirmPasswordError }}</div>
                  </div>
                </div>
              </div>

              <!-- Campo de nombre y apellidos -->
              <div class="row g-3 mb-3">
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="text"
                      id="nombre"
                      v-model="nombre"
                      class="form-control custom-input"
                      :class="{ 'is-invalid': nombreError }"
                      placeholder="Juan"
                      required
                    />
                    <label for="nombre">
                      <i class="fas fa-user-circle me-2"></i>Nombre
                    </label>
                    <div v-if="nombreError" class="invalid-feedback">{{ nombreError }}</div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="text"
                      id="apellidos"
                      v-model="apellidos"
                      class="form-control custom-input"
                      placeholder="Pérez García"
                      required
                    />
                    <label for="apellidos">
                      <i class="fas fa-user-circle me-2"></i>Apellidos
                    </label>
                  </div>
                </div>
              </div>

              <!-- Campo de teléfono y fecha de nacimiento -->
              <div class="row g-3 mb-3">
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="tel"
                      id="telefono"
                      v-model="telefono"
                      class="form-control custom-input"
                      placeholder="+52 123 456 7890"
                      required
                    />
                    <label for="telefono">
                      <i class="fas fa-phone me-2"></i>Teléfono
                    </label>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input
                      type="date"
                      id="fechaNacimiento"
                      v-model="fechaNacimiento"
                      class="form-control custom-input"
                      required
                    />
                    <label for="fechaNacimiento">
                      <i class="fas fa-calendar me-2"></i>Fecha de Nacimiento
                    </label>
                  </div>
                </div>
              </div>

              <!-- Información de dirección -->
              <div class="address-section">
                <h5 class="section-title">
                  <i class="fas fa-map-marker-alt me-2"></i>Información de Dirección
                </h5>
                
                <!-- Campo de calle y colonia -->
                <div class="row g-3 mb-3">
                  <div class="col-12 col-md-6">
                    <div class="form-floating">
                      <input
                        type="text"
                        id="calle"
                        v-model="calle"
                        class="form-control custom-input"
                        placeholder="Av. Principal"
                        required
                      />
                      <label for="calle">
                        <i class="fas fa-road me-2"></i>Calle
                      </label>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="form-floating">
                      <input
                        type="text"
                        id="colonia"
                        v-model="colonia"
                        class="form-control custom-input"
                        placeholder="Centro"
                        required
                      />
                      <label for="colonia">
                        <i class="fas fa-building me-2"></i>Colonia
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Campo de número y código postal -->
                <div class="row g-3 mb-4">
                  <div class="col-12 col-md-6">
                    <div class="form-floating">
                      <input
                        type="text"
                        id="numero"
                        v-model="numero"
                        class="form-control custom-input"
                        placeholder="123"
                        required
                      />
                      <label for="numero">
                        <i class="fas fa-hashtag me-2"></i>Número Interior
                      </label>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="form-floating">
                      <input
                        type="text"
                        id="codigoPostal"
                        v-model="codigoPostal"
                        class="form-control custom-input"
                        placeholder="12345"
                        required
                      />
                      <label for="codigoPostal">
                        <i class="fas fa-mail-bulk me-2"></i>Código Postal
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="action-buttons">
                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3 custom-btn-primary">
                  <i class="fas fa-user-plus me-2"></i>Crear Cuenta
                </button>
                
                <router-link
                  to="/home-screen"
                  class="btn btn-outline-primary btn-lg w-100 custom-btn-outline"
                >
                  <i class="fas fa-arrow-left me-2"></i>Regresar a Inicio
                </router-link>
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
import { useRouter } from 'vue-router';
import axios from "axios";
import { toast } from 'vue3-toastify'

// Campos del formulario
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const nombre = ref("");
const apellidos = ref("");
const telefono = ref("");
const fechaNacimiento = ref("");
const calle = ref("");
const colonia = ref("");
const numero = ref("");
const codigoPostal = ref("");
const userName = ref("");

// Errores de validación
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const nombreError = ref("");

const router = useRouter()

// Función para validar email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar teléfono
const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Función para validar código postal
const validatePostalCode = (code) => {
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(code);
};

// Función para validar edad mínima
const validateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1;
  }
  return age;
};

// Función para manejar el registro
const handleRegister = async () => {
  // Limpiar errores previos
  emailError.value = "";
  passwordError.value = "";
  confirmPasswordError.value = "";
  nombreError.value = "";

  let hasErrors = false;

  // Validación de email
  if (!email.value.trim()) {
    emailError.value = "El correo electrónico es obligatorio.";
    hasErrors = true;
  } else if (!validateEmail(email.value)) {
    emailError.value = "Por favor ingresa un correo electrónico válido.";
    hasErrors = true;
  }

  // Validación de contraseña
  if (!password.value) {
    passwordError.value = "La contraseña es obligatoria.";
    hasErrors = true;
  } else if (password.value.length < 6) {
    passwordError.value = "La contraseña debe tener al menos 6 caracteres.";
    hasErrors = true;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
    passwordError.value = "La contraseña debe contener al menos una mayúscula, una minúscula y un número.";
    hasErrors = true;
  }

  // Validación de confirmación de contraseña
  if (!confirmPassword.value) {
    confirmPasswordError.value = "Debe confirmar su contraseña.";
    hasErrors = true;
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Las contraseñas no coinciden.";
    hasErrors = true;
  }

  // Validación de nombre
  if (!nombre.value.trim()) {
    nombreError.value = "El nombre es obligatorio.";
    hasErrors = true;
  } else if (nombre.value.trim().length < 2) {
    nombreError.value = "El nombre debe tener al menos 2 caracteres.";
    hasErrors = true;
  }

  // Validaciones adicionales
  if (!userName.value.trim()) {
    toast("El nombre de usuario es obligatorio.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  } else if (userName.value.length < 3) {
    toast("El nombre de usuario debe tener al menos 3 caracteres.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  if (!apellidos.value.trim()) {
    toast("Los apellidos son obligatorios.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  if (!telefono.value.trim()) {
    toast("El teléfono es obligatorio.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  } else if (!validatePhone(telefono.value)) {
    toast("Por favor ingresa un número de teléfono válido.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  if (!fechaNacimiento.value) {
    toast("La fecha de nacimiento es obligatoria.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  } else if (validateAge(fechaNacimiento.value) < 18) {
    toast("Debes ser mayor de 18 años para registrarte.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  if (!calle.value.trim()) {
    toast("La calle es obligatoria.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  if (!colonia.value.trim()) {
    toast("La colonia es obligatoria.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  if (!numero.value.trim()) {
    toast("El número interior es obligatorio.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  if (!codigoPostal.value.trim()) {
    toast("El código postal es obligatorio.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  } else if (!validatePostalCode(codigoPostal.value)) {
    toast("El código postal debe tener 5 dígitos.", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      theme: "colored",
    });
    hasErrors = true;
  }

  // Si hay errores, detener el proceso
  if (hasErrors) {
    return;
  }

  // Si no hay errores, procesar el registro
  try {
    const response = await axios.post('/api/v1/signup', {
      email: email.value,
      password: password.value,
      userName: userName.value,
      nombre: nombre.value,
      apellidos: apellidos.value,
      calle: calle.value,
      colonia: colonia.value,
      numero: numero.value,
      codigoPostal: codigoPostal.value,
      telefono: telefono.value,
      fechaNacimiento: fechaNacimiento.value,
      role: {
        id: 2
      },
    }) 
    
    if (response) {
      toast("¡Registro exitoso! Bienvenido a ElectroShop", {
        hideProgressBar: true,
        autoClose: 600,
        type: "success",
        theme: "colored",
        onClose: () => {
          router.push({
            name: 'Autenticacion',
            query: { email: response.data.email }
          })
        },
      })
    }
  } catch (error) {
    // Manejar diferentes tipos de errores del backend con mensajes personalizados
    if (error.response) {
      const status = error.response.status;
      let errorMessage = "";

      switch (status) {
        case 400:
          errorMessage = "Datos inválidos. Por favor verifica la información ingresada.";
          break;
        case 409:
          errorMessage = "Este correo electrónico o nombre de usuario ya está registrado.";
          break;
        case 422:
          errorMessage = "Los datos proporcionados no son válidos. Verifica todos los campos.";
          break;
        case 500:
          errorMessage = "Error interno del servidor. Por favor intenta más tarde.";
          break;
        case 503:
          errorMessage = "Servicio no disponible temporalmente. Intenta más tarde.";
          break;
        default:
          errorMessage = "Error al procesar el registro. Por favor intenta nuevamente.";
      }

      toast(errorMessage, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "error",
        theme: "colored",
      });
    } else if (error.request) {
      // Error de conexión
      toast("No se pudo conectar con el servidor. Verifica tu conexión a internet.", {
        hideProgressBar: true,
        autoClose: 4000,
        type: "error",
        theme: "colored",
      });
    } else {
      // Otro tipo de error
      toast("Ocurrió un error inesperado. Por favor intenta nuevamente.", {
        hideProgressBar: true,
        autoClose: 4000,
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

/* Variables CSS usando colores de Bootstrap */
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-info: #0dcaf0;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
  
  --primary-gradient: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  --light-gradient: linear-gradient(135deg, var(--bs-light) 0%, #e9ecef 100%);
  --card-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  --input-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --transition: all 0.15s ease-in-out;
}

/* Wrapper principal */
.register-wrapper {
  background: #f8f9fa;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.register-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1;
}

/* Sección de imagen */
.register-image-section {
  background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  position: relative;
  z-index: 2;
}

.image-container {
  max-width: 400px;
  padding: 2rem;
}

.logo-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--card-shadow);
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-wrapper:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.2);
}

.logo-image {
  max-width: 100%;
  height: auto;
  max-height: 150px;
}

.welcome-title {
  color: white;
  font-weight: 800;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
}

.welcome-subtitle {
  color: white;
  font-size: 1.1rem;
  line-height: 1.6;
  text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
  font-weight: 500;
}

/* Sección del formulario */
.register-form-section {
  background: white;
  position: relative;
  z-index: 2;
}

.form-container {
  max-width: 600px;
  width: 100%;
  padding: 2rem;
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  color: var(--bs-dark);
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--bs-primary);
}

.form-subtitle {
  color: var(--bs-secondary);
  font-size: 1.1rem;
  margin-bottom: 0;
}

/* Formulario */
.registration-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
}

/* Inputs personalizados */
.custom-input {
  border: 2px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem 1rem 1rem 1rem;
  font-size: 1rem;
  transition: var(--transition);
  background: white;
}

.custom-input:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
  background: white;
}

.form-floating > label {
  color: var(--bs-secondary);
  font-weight: 500;
}

.form-floating > .custom-input:focus ~ label,
.form-floating > .custom-input:not(:placeholder-shown) ~ label {
  color: var(--bs-primary);
  font-weight: 600;
}

/* Sección de dirección */
.address-section {
  background: var(--bs-light);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid #dee2e6;
}

.section-title {
  color: var(--bs-dark);
  font-weight: 600;
  margin-bottom: 1rem;
  display: inline-block;
}

/* Botones personalizados */
.action-buttons {
  margin-top: 2rem;
}

.custom-btn-primary {
  background-color: var(--bs-primary) !important;
  border: none !important;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.875rem 2rem;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.025rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  color: white !important;
}

.custom-btn-primary:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.3);
  background-color: #0856d9 !important;
}

.custom-btn-outline {
  border: 2px solid var(--bs-primary);
  border-radius: 0.5rem;
  font-weight: 600;
  color: var(--bs-primary);
  transition: var(--transition);
  background: transparent;
  padding: 0.875rem 2rem;
}

.custom-btn-outline:hover {
  background: var(--bs-primary);
  color: white;
  transform: translateY(-0.125rem);
  box-shadow: var(--input-shadow);
}

/* Mensajes de error */
.invalid-feedback {
  font-size: 0.875rem;
  color: var(--bs-danger);
  font-weight: 500;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: var(--bs-danger) !important;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
}

/* Responsividad */
@media (max-width: 991.98px) {
  .register-image-section {
    min-height: 40vh;
  }
  
  .form-title {
    font-size: 2rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .form-container {
    padding: 1rem;
  }
  
  .registration-form {
    padding: 1.5rem;
  }
}

@media (max-width: 767.98px) {
  .form-container {
    padding: 0.5rem;
  }
  
  .registration-form {
    padding: 1rem;
  }
  
  .address-section {
    padding: 1rem;
  }
  
  .welcome-title {
    font-size: 1.3rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1.875rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.registration-form {
  animation: fadeInUp 0.6s ease-out;
}

.image-container {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Efectos hover en campos */
.form-floating {
  transition: var(--transition);
}

.form-floating:hover .custom-input:not(:focus) {
  border-color: rgba(var(--bs-primary-rgb), 0.5);
  box-shadow: var(--input-shadow);
}

/* Iconos */
.fas {
  color: var(--bs-primary);
}

.section-title .fas {
  color: var(--bs-primary);
}

/* Estados de validación con colores de Bootstrap */
.custom-input:valid {
  border-color: var(--bs-success);
}

.custom-input:invalid:not(:placeholder-shown) {
  border-color: var(--bs-danger);
}

/* Mejoras en accesibilidad */
.custom-input:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

/* Hover states mejorados */
.logo-wrapper:hover,
.custom-btn-primary:hover,
.custom-btn-outline:hover {
  cursor: pointer;
}

/* Transiciones suaves para todos los elementos interactivos */
button, 
.form-control, 
.btn {
  transition: var(--transition);
}
</style>
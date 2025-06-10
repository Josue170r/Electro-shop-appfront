<template>
  <div class="register-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-12">
          <div class="card register-card">
            <div class="card-header text-center">
              <h2 class="mb-3">Crear Nueva Cuenta</h2>
              <p class="text-muted">Completa tu información para registrarte</p>
            </div>

            <div class="card-body">
              <!-- Foto de Perfil -->
              <div class="photo-section text-center mb-4">
                <h5 class="mb-3">Foto de Perfil</h5>
                <div class="photo-container d-flex flex-column align-items-center">
                  <div 
                    class="profile-avatar mb-3"
                    @click="triggerFileInput"
                  >
                    <img 
                      v-if="profileImagePreview" 
                      :src="profileImagePreview" 
                      alt="Foto de perfil" 
                      class="avatar-img"
                    />
                    <div v-else class="avatar-placeholder">
                      <i class="bi bi-person-circle"></i>
                    </div>
                  </div>
                  <div class="photo-actions">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm me-2"
                      @click="triggerFileInput"
                    >
                      <i class="bi bi-camera"></i>
                      {{ profileImagePreview ? 'Cambiar Foto' : 'Subir Foto' }}
                    </button>
                    <button
                      v-if="profileImagePreview"
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="removeImage"
                    >
                      <i class="bi bi-trash"></i>
                      Eliminar
                    </button>
                  </div>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onImageChange"
                />
              </div>

              <div class="row">
                <!-- Email -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">
                    <i class="bi bi-envelope me-2"></i>Correo Electrónico *
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>

                <!-- Password -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">
                    <i class="bi bi-lock me-2"></i>Contraseña *
                  </label>
                  <input
                    v-model="formData.password"
                    type="password"
                    class="form-control"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>

                <!-- Nombre -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">
                    <i class="bi bi-person me-2"></i>Nombre(s) *
                  </label>
                  <input
                    v-model="formData.nombre"
                    type="text"
                    class="form-control"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <!-- Apellido Paterno -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">Apellido Paterno *</label>
                  <input
                    v-model="formData.apellido_paterno"
                    type="text"
                    class="form-control"
                    placeholder="Apellido paterno"
                    required
                  />
                </div>

                <!-- Apellido Materno -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">Apellido Materno</label>
                  <input
                    v-model="formData.apellido_materno"
                    type="text"
                    class="form-control"
                    placeholder="Apellido materno"
                  />
                </div>

                <!-- Fecha de Nacimiento -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">
                    <i class="bi bi-calendar me-2"></i>Fecha de Nacimiento *
                  </label>
                  <input
                    v-model="formData.fecha_nacimiento"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>

                <!-- Teléfono -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">
                    <i class="bi bi-phone me-2"></i>Teléfono
                  </label>
                  <input
                    v-model="formData.telefono"
                    type="tel"
                    class="form-control"
                    placeholder="1234567890"
                  />
                </div>

                <!-- Género -->
                <div class="col-lg-6 col-12 mb-3">
                  <label class="form-label">Género</label>
                  <select v-model="formData.genero" class="form-select">
                    <option value="">Seleccionar...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="row">
                <div class="col-lg-6 col-12 mb-2">
                  <router-link to="/inicio-sesion" class="text-decoration-none">
                    <button type="button" class="btn btn-outline-secondary w-100">
                      ¿Ya tienes cuenta? Inicia sesión
                    </button>
                  </router-link>
                </div>
                <div class="col-lg-6 col-12">
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    :disabled="!isFormValid"
                    @click="handleRegister"
                  >
                    Crear Cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { toast } from 'vue3-toastify'

export default {
  name: 'RegisterView',
  data() {
    return {
      profileImagePreview: null,
      formData: {
        email: '',
        password: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        telefono: '',
        genero: '',
        foto: null
      }
    }
  },
  computed: {
    isFormValid() {
      return (
        this.formData.email &&
        this.formData.password &&
        this.formData.nombre &&
        this.formData.apellido_paterno &&
        this.formData.fecha_nacimiento &&
        this.formData.password.length >= 6
      )
    }
  },
  methods: {
    ...mapActions('auth', {
      registerUser: 'registerUser'
    }),

    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    onImageChange(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB')
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.profileImagePreview = e.target.result
        // Extraer solo la parte base64 (sin el prefijo data:image/...)
        const base64Data = e.target.result.split(',')[1]
        this.formData.foto = base64Data
      }
      reader.readAsDataURL(file)
    },

    removeImage() {
      this.profileImagePreview = null
      this.formData.foto = null
      this.$refs.fileInput.value = ''
    },

    async handleRegister() {
      try {
        // Validar campos requeridos
        if (!this.isFormValid) {
          toast.error('Por favor completa todos los campos requeridos')
          return
        }

        // Preparar datos para el backend
        const userData = {
          usuario: {
            email: this.formData.email,
            password: this.formData.password,
            nombre: this.formData.nombre,
            apellido_paterno: this.formData.apellido_paterno,
            apellido_materno: this.formData.apellido_materno || null,
            fecha_nacimiento: new Date(this.formData.fecha_nacimiento).toISOString(),
            telefono: this.formData.telefono ? parseInt(this.formData.telefono) : null,
            genero: this.formData.genero || null,
            foto: this.formData.foto || null
          }
        }

        await this.registerUser(userData)

        toast.success('¡Usuario registrado exitosamente!', {
          autoClose: 3000,
          position: 'top-right'
        })

        // Redirigir al login después de un breve delay
        setTimeout(() => {
          this.$router.push('/inicio-sesion')
        }, 2000)

      } catch (error) {
        toast.error(error.message || 'Error al registrar usuario', {
          autoClose: 4000,
          position: 'top-right'
        })
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  padding: 2rem;
  background: #f8f9fa;
}

.register-card {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  border: none;
}

.card-header {
  background: #fff;
  border-bottom: 1px solid #eee;
  border-radius: 15px 15px 0 0 !important;
}

.card-header h2 {
  color: #2c3e50;
  font-weight: 600;
}

.photo-section {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 15px;
  margin-bottom: 1rem;
}

.photo-section h5 {
  color: #2c3e50;
  font-weight: 500;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  cursor: pointer;
  border: 4px solid #e9ecef;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.profile-avatar:hover {
  border-color: #007bff;
  transform: scale(1.05);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #6c757d;
}

.avatar-placeholder i {
  font-size: 4rem;
}

.photo-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-control, .form-select {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.75rem;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.card-footer {
  background: #fff;
  border-top: 1px solid #eee;
  border-radius: 0 0 15px 15px !important;
}

.btn {
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }
  
  .photo-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .photo-actions .btn {
    width: 100%;
  }
}
</style>
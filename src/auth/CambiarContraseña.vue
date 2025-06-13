<template>
  <div class="password-container">
    <!-- Header de la sección -->
    <div class="section-header">
      <div class="d-flex align-items-center">
        <div class="header-icon">
          <i class="bi bi-shield-lock"></i>
        </div>
        <div>
          <h2 class="mb-0 fw-bold">Cambiar Contraseña</h2>
          <p class="mb-0 text-muted">Actualiza tu contraseña para mantener tu cuenta segura</p>
        </div>
      </div>
    </div>

    <!-- Formulario de cambio de contraseña -->
    <div class="password-content">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="password-card">
            <div class="card-body">
              <!-- Información de seguridad -->
              <div class="security-info mb-4">
                <div class="d-flex align-items-center">
                  <div class="security-icon me-3">
                    <i class="bi bi-info-circle"></i>
                  </div>
                  <div>
                    <h6 class="mb-1 fw-semibold">Consejos de seguridad</h6>
                    <small class="text-muted">
                      Usa una contraseña con al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
                    </small>
                  </div>
                </div>
              </div>

              <form @submit.prevent="submitForm" class="password-form">
                <!-- Contraseña actual -->
                <div class="form-group mb-4">
                  <label for="currentPassword" class="form-label fw-semibold">
                    <i class="bi bi-lock me-2"></i>
                    Contraseña Actual
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="password"
                      class="form-control form-control-lg"
                      id="currentPassword"
                      v-model="currentPassword"
                      required
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <div class="input-icon">
                      <i class="bi bi-shield-check"></i>
                    </div>
                  </div>
                </div>

                <!-- Nueva contraseña -->
                <div class="form-group mb-4">
                  <label for="newPassword" class="form-label fw-semibold">
                    <i class="bi bi-key me-2"></i>
                    Nueva Contraseña
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="password"
                      class="form-control form-control-lg"
                      id="newPassword"
                      v-model="newPassword"
                      required
                      placeholder="Ingresa tu nueva contraseña"
                    />
                    <div class="input-icon">
                      <i class="bi bi-plus-circle"></i>
                    </div>
                  </div>
                </div>

                <!-- Confirmar nueva contraseña -->
                <div class="form-group mb-4">
                  <label for="confirmNewPassword" class="form-label fw-semibold">
                    <i class="bi bi-check-circle me-2"></i>
                    Confirmar Nueva Contraseña
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="password"
                      class="form-control form-control-lg"
                      id="confirmNewPassword"
                      v-model="confirmNewPassword"
                      required
                      placeholder="Confirma tu nueva contraseña"
                      :class="{ 
                        'is-invalid': confirmNewPassword && newPassword !== confirmNewPassword,
                        'is-valid': confirmNewPassword && newPassword === confirmNewPassword 
                      }"
                    />
                    <div class="input-icon">
                      <i class="bi bi-arrow-repeat"></i>
                    </div>
                  </div>
                  <div 
                    v-if="confirmNewPassword && newPassword !== confirmNewPassword" 
                    class="invalid-feedback d-block"
                  >
                    Las contraseñas no coinciden
                  </div>
                </div>

                <!-- Botón de envío -->
                <div class="form-actions">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg w-100"
                    :disabled="!isFormValid"
                  >
                    <i class="bi bi-shield-check me-2"></i>
                    Cambiar Contraseña
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Información adicional de seguridad -->
          <div class="security-tips mt-4">
            <div class="tips-card">
              <div class="tips-header">
                <i class="bi bi-lightbulb me-2 text-warning"></i>
                <h6 class="mb-0 fw-bold">Recomendaciones de Seguridad</h6>
              </div>
              <div class="tips-content">
                <ul class="tips-list">
                  <li>
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    Usa una combinación de letras, números y símbolos
                  </li>
                  <li>
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    Evita usar información personal como fechas de nacimiento
                  </li>
                  <li>
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    No reutilices contraseñas de otras cuentas
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import axios from 'axios';

export default {
  name: "CambiarContraseña",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      user: {},
    };
  },
  computed: {
    isFormValid() {
      return this.currentPassword && 
             this.newPassword && 
             this.confirmNewPassword && 
             this.newPassword === this.confirmNewPassword;
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userInfo")) || {};
  },
  methods: {
    async submitForm() {
      if (this.newPassword !== this.confirmNewPassword) {
        toast("Las contraseñas no coinciden", {
          hideProgressBar: true,
          autoClose: 1500,
          type: "error",
          theme: "colored",
        });
      } else {
        const data = {
          username: this.user.userName,
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        };
        
        try {
          const response = await axios.post('/api/v1/updatePassword', data);
          if (response) {
            toast(response.data, {
              hideProgressBar: true,
              autoClose: 600,
              type: "success",
              theme: "colored",
            });
            this.currentPassword = "";
            this.newPassword = "";
            this.confirmNewPassword = "";
          }
        } catch (error) {
          if (error.response) {
            console.log(error);
            let messageError = !error.response.data.message 
              ? error.response.data 
              : error.response.data.message;
            toast(messageError, {
              hideProgressBar: true,
              autoClose: 1500,
              type: "error",
              theme: "colored",
            });
          }
        }
      } 
    },
  },
};
</script>

<style scoped>
.password-container {
  padding: 2rem;
}

/* Header de la sección */
.section-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #d97706;
  font-size: 1.5rem;
}

/* Password content */
.password-content {
  animation: slideInUp 0.6s ease-out;
}

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

/* Password card */
.password-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-body {
  padding: 2.5rem;
}

/* Security info */
.security-info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #3b82f6;
}

.security-icon {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
}

/* Form styling */
.password-form .form-group {
  position: relative;
}

.form-label {
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
}

.form-control {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem 3rem 1rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

.form-control.is-valid {
  border-color: #10b981;
  background: #f0fdf4;
}

.form-control.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.125rem;
}

.form-control:focus + .input-icon {
  color: #3b82f6;
}

.form-control.is-valid + .input-icon {
  color: #10b981;
}

.form-control.is-invalid + .input-icon {
  color: #ef4444;
}

/* Form actions */
.form-actions {
  margin-top: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Security tips */
.security-tips {
  margin-top: 2rem;
}

.tips-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tips-header {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.tips-content {
  padding: 1.5rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.tips-list li:last-child {
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 991.98px) {
  .password-container {
    padding: 1rem;
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .header-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 575.98px) {
  .password-container {
    padding: 0.5rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .security-info,
  .tips-header,
  .tips-content {
    padding: 1rem;
  }
  
  .form-control {
    padding: 0.875rem 2.5rem 0.875rem 0.875rem;
  }
  
  .input-icon {
    right: 0.75rem;
  }
}
</style>
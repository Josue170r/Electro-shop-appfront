<template>
  <div class="user-profile-container">
    <!-- Header de la sección -->
    <div class="section-header">
      <div class="d-flex align-items-center">
        <div class="header-icon">
          <i class="bi bi-person-circle"></i>
        </div>
        <div>
          <h2 class="mb-0 fw-bold">Mi Perfil</h2>
          <p class="mb-0 text-muted">Administra tu información personal</p>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="row g-4">
        <!-- Columna de avatar -->
        <div class="col-lg-4">
          <div class="profile-card">
            <div class="profile-avatar-section">
              <div class="profile-avatar">
                <img
                  src="@/assets/usuario.png"
                  alt="Avatar del usuario"
                  class="avatar-image"
                />
              </div>
              <h3 class="profile-name">{{ username }}</h3>
              <p class="profile-email">{{ user.email }}</p>
              
              <!-- Estado del usuario -->
              <div class="user-status">
                <span class="status-badge active">
                  <i class="bi bi-check-circle me-1"></i>
                  Cuenta Verificada
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna de información -->
        <div class="col-lg-8">
          <div class="info-card">
            <div class="card-header">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-person-vcard me-2 text-primary"></i>
                Información Personal
              </h5>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <!-- Email -->
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-envelope"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">Correo electrónico</label>
                    <div class="info-value">{{ user.email }}</div>
                  </div>
                </div>

                <!-- Teléfono -->
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-telephone"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">Teléfono</label>
                    <div class="info-value">{{ user.telefono || 'No especificado' }}</div>
                  </div>
                </div>

                <!-- Fecha de nacimiento -->
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-calendar"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">Fecha de Nacimiento</label>
                    <div class="info-value">{{ user.fechaNacimiento || 'No especificada' }}</div>
                  </div>
                </div>

                <!-- Dirección -->
                <div class="info-item full-width">
                  <div class="info-icon">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">Dirección</label>
                    <div class="info-value">{{ formatAddres() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de cerrar sesión -->
    <div class="logout-section">
      <div class="card border-danger">
        <div class="card-body text-center">
          <i class="bi bi-box-arrow-right text-danger fs-1 mb-3"></i>
          <h5 class="text-danger mb-2">¿Necesitas salir?</h5>
          <p class="text-muted mb-3">Tu sesión se mantendrá segura hasta que decidas cerrarla.</p>
          <button class="btn btn-danger" @click="logout">
            <i class="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DatosUsuario",
  data() {
    return {
      user: {},
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userInfo")) || {};
  },
  computed: {
    username() {
      return this.user.nombre ? `${this.user.nombre} ${this.user.apellidos}` : 'Usuario';
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('isLogged');
      this.$router.push({ name: 'InicioSesion' });
    },
    formatAddres() {
      if (!this.user || !this.user.calle || !this.user.colonia || !this.user.numero || !this.user.codigoPostal) {
        return "Dirección incompleta";
      }
      return `${this.user.calle} ${this.user.numero}, ${this.user.colonia}, CP ${this.user.codigoPostal}`;
    },
  },
};
</script>

<style scoped>
.user-profile-container {
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
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #2563eb;
  font-size: 1.5rem;
}

/* Profile card */
.profile-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin-bottom: 1.5rem;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.profile-avatar:hover .avatar-image {
  transform: scale(1.05);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.profile-email {
  color: #6b7280;
  margin-bottom: 1rem;
}

/* Status badge */
.user-status {
  margin-top: 1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

/* Info card */
.info-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-body {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
}

/* Logout section */
.logout-section {
  margin-top: 2rem;
}

.logout-section .card {
  border-radius: 16px;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 991.98px) {
  .user-profile-container {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 575.98px) {
  .user-profile-container {
    padding: 0.5rem;
  }
  
  .profile-card,
  .stats-card,
  .info-card,
  .quick-actions-card {
    padding: 1rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .header-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
  }
}
</style>
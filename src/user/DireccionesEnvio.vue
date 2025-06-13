<template>
  <div class="direcciones-container">
    <!-- Header de la sección -->
    <div class="section-header">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <div class="header-icon">
            <i class="bi bi-geo-alt"></i>
          </div>
          <div>
            <h2 class="mb-0 fw-bold">Direcciones de Envío</h2>
            <p class="mb-0 text-muted">Administra tus direcciones de entrega</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de direcciones -->
    <div class="direcciones-content">
      <!-- Vista de tarjetas para móvil y tablet -->
      <div class="d-lg-none">
        <div 
          v-for="(user, index) in users" 
          :key="user.idUsuario"
          class="address-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="address-header">
            <div class="address-icon">
              <i class="bi bi-house-door"></i>
            </div>
            <div class="address-status">
              <span class="status-badge primary">
                <i class="bi bi-check-circle me-1"></i>
                Principal
              </span>
            </div>
          </div>
          
          <div class="address-body">
            <div class="address-info">
              <div class="info-row">
                <div class="info-item">
                  <i class="bi bi-signpost me-2 text-primary"></i>
                  <span class="info-label">Calle:</span>
                  <span class="info-value">{{ user.calle }}</span>
                </div>
              </div>
              
              <div class="info-row">
                <div class="info-item">
                  <i class="bi bi-building me-2 text-primary"></i>
                  <span class="info-label">Colonia:</span>
                  <span class="info-value">{{ user.colonia }}</span>
                </div>
              </div>
              
              <div class="info-row">
                <div class="info-item">
                  <i class="bi bi-hash me-2 text-primary"></i>
                  <span class="info-label">Número:</span>
                  <span class="info-value">{{ user.numero }}</span>
                </div>
              </div>
              
              <div class="info-row">
                <div class="info-item">
                  <i class="bi bi-mailbox me-2 text-primary"></i>
                  <span class="info-label">C.P.:</span>
                  <span class="info-value">{{ user.codigoPostal }}</span>
                </div>
              </div>
              
              <div class="info-row">
                <div class="info-item">
                  <i class="bi bi-telephone me-2 text-primary"></i>
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">{{ user.telefono }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de tabla para desktop -->
      <div class="d-none d-lg-block">
        <div class="table-card">
          <div class="table-header">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-list-ul me-2 text-primary"></i>
              Lista de Direcciones
            </h5>
          </div>
          
          <div class="table-responsive">
            <table class="addresses-table">
              <thead>
                <tr>
                  <th>
                    <i class="bi bi-signpost me-2"></i>
                    Calle
                  </th>
                  <th>
                    <i class="bi bi-building me-2"></i>
                    Colonia
                  </th>
                  <th>
                    <i class="bi bi-hash me-2"></i>
                    Número
                  </th>
                  <th>
                    <i class="bi bi-mailbox me-2"></i>
                    Código Postal
                  </th>
                  <th>
                    <i class="bi bi-telephone me-2"></i>
                    Teléfono
                  </th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(user, index) in users" 
                  :key="user.idUsuario"
                  class="address-row"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <td>
                    <div class="cell-content">
                      <i class="bi bi-geo-alt-fill text-primary me-2"></i>
                      {{ user.calle }}
                    </div>
                  </td>
                  <td>{{ user.colonia }}</td>
                  <td>
                    <span class="number-badge">{{ user.numero }}</span>
                  </td>
                  <td>
                    <span class="postal-code">{{ user.codigoPostal }}</span>
                  </td>
                  <td>
                    <a :href="`tel:${user.telefono}`" class="phone-link">
                      <i class="bi bi-telephone me-1"></i>
                      {{ user.telefono }}
                    </a>
                  </td>
                  <td>
                    <span class="status-badge primary">
                      <i class="bi bi-check-circle me-1"></i>
                      Principal
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="users.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-house-x"></i>
        </div>
        <h4 class="mb-3">No hay direcciones registradas</h4>
        <p class="text-muted mb-4">
          Agrega tu primera dirección de envío para comenzar a recibir tus pedidos.
        </p>
        <button class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>
          Agregar Dirección
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DireccionesEnvio",
  data() {
    return {
      users: []
    };
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      this.users.push(userInfo);
    }
    console.log(this.users);
  },
};
</script>

<style scoped>
.direcciones-container {
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
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #059669;
  font-size: 1.5rem;
}

/* Direcciones content */
.direcciones-content {
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

/* Address cards para móvil */
.address-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.address-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.address-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.address-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 1.25rem;
}

.address-body {
  padding: 1.5rem;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.info-label {
  font-weight: 600;
  color: #4b5563;
  margin-right: 0.5rem;
  min-width: 80px;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
}

/* Table card para desktop */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.addresses-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.addresses-table thead th {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #374151;
  font-weight: 600;
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.875rem;
}

.addresses-table thead th:first-child {
  border-top-left-radius: 0;
}

.addresses-table thead th:last-child {
  border-top-right-radius: 0;
}

.address-row {
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.address-row:hover {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.addresses-table tbody td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1f2937;
  font-weight: 500;
}

.cell-content {
  display: flex;
  align-items: center;
}

.number-badge {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.postal-code {
  background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
  color: #7c3aed;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
}

.phone-link {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.phone-link:hover {
  color: #047857;
  text-decoration: underline;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.primary {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 4rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.empty-state h4 {
  color: #1f2937;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 991.98px) {
  .direcciones-container {
    padding: 1rem;
  }
  
  .address-header,
  .address-body {
    padding: 1.25rem;
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
  .direcciones-container {
    padding: 0.5rem;
  }
  
  .address-header,
  .address-body {
    padding: 1rem;
  }
  
  .address-info {
    gap: 0.75rem;
  }
  
  .info-label {
    min-width: 70px;
    font-size: 0.875rem;
  }
  
  .info-value {
    font-size: 0.875rem;
  }
}
</style>
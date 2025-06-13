<template>
  <div class="pedidos-container">
    <!-- Header de la sección -->
    <div class="section-header">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <div class="header-icon">
            <i class="bi bi-bag-check"></i>
          </div>
          <div>
            <h2 class="mb-0 fw-bold">Mis Pedidos</h2>
            <p class="mb-0 text-muted">Historial y seguimiento de tus compras</p>
          </div>
        </div>
        <!-- Filtros -->
        <div class="d-none d-md-flex gap-2">
          <select class="form-select form-select-sm" style="width: auto;">
            <option>Todos los estados</option>
            <option>Preparando</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lista de pedidos -->
    <div class="pedidos-content">
      <!-- Pedido existente -->
      <div 
        v-for="(pedido, index) in pedidos" 
        :key="pedido.numeroFolio"
        class="pedido-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="pedido-header">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="pedido-info">
                <h5 class="mb-1 fw-bold">Pedido #{{ pedido.numeroFolio }}</h5>
                <div class="d-flex align-items-center text-muted">
                  <i class="bi bi-calendar3 me-2"></i>
                  <span>{{ formatDate(pedido.fechaCompra) }}</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 text-md-end">
              <div class="pedido-status">
                <span 
                  class="status-badge"
                  :class="getStatusClass(pedido.estatusPedido)"
                >
                  <i :class="getStatusIcon(pedido.estatusPedido)" class="me-1"></i>
                  {{ pedido.estatusPedido }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="pedido-body">
          <div class="row g-3">
            <!-- Información del pedido -->
            <div class="col-lg-8">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-credit-card"></i>
                    </div>
                    <div class="info-content">
                      <label class="info-label">Método de Pago</label>
                      <div class="info-value">{{ pedido.tipodePago }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-geo-alt"></i>
                    </div>
                    <div class="info-content">
                      <label class="info-label">Dirección de Envío</label>
                      <div class="info-value">{{ pedido.direccionEnvio || formatAddres() }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total y acciones -->
            <div class="col-lg-4">
              <div class="pedido-total">
                <div class="total-section">
                  <label class="total-label">Total Pagado</label>
                  <div class="total-amount">${{ formatPrice(pedido.precioTotal) }}</div>
                </div>
                <div class="pedido-actions">
                  <button class="btn btn-outline-primary btn-sm me-2">
                    <i class="bi bi-eye me-1"></i>
                    Ver Detalles
                  </button>
                  <button 
                    class="btn btn-outline-secondary btn-sm"
                    v-if="pedido.estatusPedido === 'Entregado'"
                  >
                    <i class="bi bi-arrow-repeat me-1"></i>
                    Reordenar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress bar para pedidos en proceso -->
          <div 
            v-if="pedido.estatusPedido === 'Preparando'" 
            class="order-progress mt-3"
          >
            <div class="progress-container">
              <div class="progress-step active">
                <div class="step-icon">
                  <i class="bi bi-check"></i>
                </div>
                <div class="step-label">Confirmado</div>
              </div>
              <div class="progress-line active"></div>
              <div class="progress-step active">
                <div class="step-icon">
                  <i class="bi bi-box-seam"></i>
                </div>
                <div class="step-label">Preparando</div>
              </div>
              <div class="progress-line"></div>
              <div class="progress-step">
                <div class="step-icon">
                  <i class="bi bi-truck"></i>
                </div>
                <div class="step-label">En Camino</div>
              </div>
              <div class="progress-line"></div>
              <div class="progress-step">
                <div class="step-icon">
                  <i class="bi bi-house-door"></i>
                </div>
                <div class="step-label">Entregado</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="pedidos.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-bag-x"></i>
        </div>
        <h4 class="mb-3">No tienes pedidos aún</h4>
        <p class="text-muted mb-4">
          Cuando realices tu primera compra, aparecerá aquí con toda la información de seguimiento.
        </p>
        <router-link to="/home-screen" class="btn btn-primary">
          <i class="bi bi-search me-2"></i>
          Explorar Productos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Pedidos",
  data() {
    return {
      user: {},
      pedidos: [],
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.loadPedidos();
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    },

    getStatusClass(estatus) {
      const statusMap = {
        'cancelado': 'status-cancelled',
        'preparando': 'status-preparing',
        'entregado': 'status-delivered',
        'en camino': 'status-shipping'
      };
      return statusMap[estatus.toLowerCase()] || 'status-default';
    },

    getStatusIcon(estatus) {
      const iconMap = {
        'cancelado': 'bi-x-circle',
        'preparando': 'bi-clock',
        'entregado': 'bi-check-circle',
        'en camino': 'bi-truck'
      };
      return iconMap[estatus.toLowerCase()] || 'bi-info-circle';
    },

    formatAddres() {
      if (!this.user || !this.user.calle || !this.user.colonia || !this.user.numero || !this.user.codigoPostal) {
        return "Dirección incompleta";
      }
      return `${this.user.calle} ${this.user.numero}, ${this.user.colonia}, CP ${this.user.codigoPostal}`;
    },

    async loadPedidos() {
      try {
        const response = await axios.get('/api/v1/pedidos/by-cliente/', {
          params: { idCliente: this.user.idCliente }
        });
        this.pedidos = response.data;
      } catch (error) {
        if (error.response) {
          let messageError = error.response.data.message;
          console.error(messageError);
          // toast implementation
        }
      }
    }
  },
};
</script>

<style scoped>
.pedidos-container {
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

/* Pedidos content */
.pedidos-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Pedido card */
.pedido-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.pedido-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.pedido-info h5 {
  color: #1f2937;
}

.pedido-body {
  padding: 2rem;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-cancelled {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
}

.status-preparing {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
}

.status-delivered {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

.status-shipping {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
}

.status-default {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #374151;
}

/* Info items */
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-icon {
  width: 36px;
  height: 36px;
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
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
}

/* Total section */
.pedido-total {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.total-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #059669;
  margin-bottom: 1rem;
}

.pedido-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

/* Order progress */
.order-progress {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.progress-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.progress-step.active .step-icon {
  background: #059669;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.progress-step.active .step-label {
  color: #059669;
  font-weight: 600;
}

.progress-line {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  margin: 0 1rem;
  margin-top: -20px;
  z-index: -1;
  transition: all 0.3s ease;
}

.progress-line.active {
  background: #059669;
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
</style>
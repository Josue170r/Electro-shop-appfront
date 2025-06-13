<template>
  <div class="min-vh-100 bg-light">
    <SecundaryHeader/>
    
    <!-- Header minimalista -->
    <div class="container pt-4 pb-2">
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-2">
              <li class="breadcrumb-item">
                <router-link to="/home-screen" class="text-decoration-none">
                  <i class="bi bi-house me-1"></i>Inicio
                </router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/carrito" class="text-decoration-none">
                  Carrito
                </router-link>
              </li>
              <li class="breadcrumb-item active">Pago</li>
            </ol>
          </nav>
          <h1 class="h2 mb-1 fw-bold text-dark d-flex align-items-center">
            <i class="bi bi-shield-check text-success me-2"></i>
            Pago Seguro
          </h1>
          <p class="text-muted mb-0">Completa tu compra de forma segura</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end">
            <small class="text-muted me-3">Paso 2 de 3</small>
            <div class="progress flex-grow-1" style="height: 4px; max-width: 120px;">
              <div class="progress-bar bg-success" style="width: 66.66%"></div>
            </div>
          </div>
          <img 
            src="../assets/logoElectroShop.png" 
            alt="ElectroShop" 
            class="mt-2"
            style="max-height: 40px; opacity: 0.8;" 
          />
        </div>
      </div>
    </div>

    <div class="container pb-5">
      <div class="row g-4">
        <!-- Columna principal -->
        <div class="col-lg-8">
          <!-- Información de envío -->
          <div class="card border-0 shadow-sm mb-4 payment-card">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <div class="icon-wrapper bg-primary bg-opacity-10 text-primary me-3">
                  <CarIcon size="20" />
                </div>
                <h5 class="mb-0 fw-bold">Información de Envío</h5>
                <span class="badge bg-success ms-auto">Verificado</span>
              </div>
              
              <div class="shipping-info p-3 bg-light rounded">
                <div class="row">
                  <div class="col-md-8">
                    <div class="d-flex align-items-start mb-2">
                      <i class="bi bi-person-fill text-muted me-2 mt-1"></i>
                      <div>
                        <div class="fw-semibold">{{ user.nombre }} {{ user.apellidos }}</div>
                        <div class="text-muted small">Destinatario</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-start">
                      <i class="bi bi-geo-alt-fill text-muted me-2 mt-1"></i>
                      <div>
                        <div class="fw-medium">{{ formatAddres() }}</div>
                        <div class="text-muted small">Dirección de entrega</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 text-md-end">
                    <button 
                      class="btn btn-outline-primary btn-sm"
                      @click="changeAddress"
                    >
                      <i class="bi bi-pencil me-1"></i>
                      Cambiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Métodos de pago -->
          <div class="card border-0 shadow-sm mb-4 payment-card">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-4">
                <div class="icon-wrapper bg-success bg-opacity-10 text-success me-3">
                  <WalletCardsIcon size="20" />
                </div>
                <h5 class="mb-0 fw-bold">Método de Pago</h5>
              </div>

              <!-- Formulario de tarjeta -->
              <div class="payment-form">
                <form @submit.prevent="agregarTarjeta">
                  <div class="row g-3">
                    <div class="col-12">
                      <label for="numeroTarjeta" class="form-label fw-semibold">
                        Número de tarjeta
                      </label>
                      <div class="position-relative">
                        <input
                          type="text"
                          id="numeroTarjeta"
                          v-model="nuevaTarjeta.numero"
                          class="form-control form-control-lg pe-5"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        <div class="card-icons">
                          <img src="../assets/visa.png" alt="Visa" />
                          <img src="../assets/mastercard.png" alt="MasterCard" />
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label for="fechaVencimiento" class="form-label fw-semibold">
                        Fecha de vencimiento
                      </label>
                      <input
                        type="text"
                        id="fechaVencimiento"
                        v-model="nuevaTarjeta.fechaVencimiento"
                        class="form-control form-control-lg"
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    
                    <div class="col-md-6">
                      <label for="codigoSeguridad" class="form-label fw-semibold">
                        Código de seguridad
                      </label>
                      <input
                        type="text"
                        id="codigoSeguridad"
                        v-model="nuevaTarjeta.cvc"
                        class="form-control form-control-lg"
                        placeholder="123"
                        maxlength="4"
                        required
                      />
                    </div>
                  </div>
                </form>

                <!-- Información de seguridad -->
                <div class="security-info mt-4 p-3 bg-primary bg-opacity-5 rounded">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-shield-lock-fill text-primary me-2"></i>
                    <small class="text-primary fw-medium">
                      Tu información está protegida con encriptación de 256 bits
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración adicional -->
          <div class="card border-0 shadow-sm payment-card">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-4">
                <div class="icon-wrapper bg-info bg-opacity-10 text-info me-3">
                  <i class="bi bi-gear-fill"></i>
                </div>
                <h5 class="mb-0 fw-bold">Configuración de Envío</h5>
              </div>

              <!-- País o región -->
              <div class="mb-4">
                <label for="pais" class="form-label fw-semibold">
                  País o región de envío
                </label>
                <select 
                  id="pais" 
                  v-model="paisSeleccionado" 
                  class="form-select form-select-lg" 
                  required
                >
                  <option disabled value="">Selecciona tu país</option>
                  <option v-for="pais in paises" :key="pais" :value="pais">
                    {{ pais }}
                  </option>
                </select>
              </div>

              <!-- Términos y condiciones -->
              <div class="terms-section">
                <div class="form-check mb-3 p-3 border rounded">
                  <input
                    type="checkbox"
                    id="aceptaTerminos"
                    v-model="aceptaTerminos"
                    class="form-check-input"
                    required
                  />
                  <label for="aceptaTerminos" class="form-check-label fw-medium">
                    Acepto los 
                    <a href="#" class="text-primary text-decoration-none">términos y condiciones</a>
                    de ElectroShop
                  </label>
                </div>
                
                <div class="form-check mb-3 p-3 border rounded">
                  <input
                    type="checkbox"
                    id="esMayorDeEdad"
                    v-model="esMayorDeEdad"
                    class="form-check-input"
                    required
                  />
                  <label for="esMayorDeEdad" class="form-check-label fw-medium">
                    Confirmo que soy mayor de edad (18+ años)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="col-lg-4">
          <div class="position-sticky" style="top: 2rem;">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-3">
                <div class="d-flex align-items-center">
                  <div class="icon-wrapper bg-warning bg-opacity-10 text-warning me-3">
                    <LucideDollarSign size="20" />
                  </div>
                  <h5 class="mb-0 fw-bold">Resumen del Pedido</h5>
                </div>
              </div>
              
              <div class="card-body">
                <!-- Desglose de precios -->
                <div class="price-breakdown">
                  <div class="d-flex justify-content-between mb-3">
                    <span class="text-muted">Subtotal</span>
                    <span class="fw-medium">{{ formatPrice(subTotal) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-3">
                    <span class="text-muted">
                      <i class="bi bi-truck me-1"></i>
                      Envío
                    </span>
                    <span class="text-success fw-medium">
                      <i class="bi bi-check-circle me-1"></i>
                      GRATIS
                    </span>
                  </div>
                  <div class="d-flex justify-content-between mb-3">
                    <span class="text-muted">IVA incluido</span>
                    <span class="text-muted">Ya incluido</span>
                  </div>
                  
                  <div class="border-top pt-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="h5 mb-0 fw-bold">Total a pagar</span>
                      <span class="h4 mb-0 fw-bold text-primary">
                        {{ formatPrice(subTotal) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Botón de pago -->
                <div class="d-grid gap-2 mb-3">
                  <button
                    @click="createOrder"
                    :disabled="!aceptaTerminos || !esMayorDeEdad || !paisSeleccionado"
                    class="btn btn-success btn-lg"
                  >
                    <i class="bi bi-lock-fill me-2"></i>
                    Confirmar Pago
                  </button>
                  
                  <router-link 
                    to="/carrito" 
                    class="btn btn-outline-secondary"
                  >
                    <i class="bi bi-arrow-left me-2"></i>
                    Volver al Carrito
                  </router-link>
                </div>

                <!-- Garantías -->
                <div class="guarantees mt-4">
                  <div class="text-center mb-3">
                    <small class="text-muted fw-semibold">Compra con confianza</small>
                  </div>
                  <div class="row text-center g-3">
                    <div class="col-4">
                      <i class="bi bi-shield-check text-success fs-5"></i>
                      <div class="small text-muted mt-1">Pago Seguro</div>
                    </div>
                    <div class="col-4">
                      <i class="bi bi-truck text-primary fs-5"></i>
                      <div class="small text-muted mt-1">Envío Rápido</div>
                    </div>
                    <div class="col-4">
                      <i class="bi bi-arrow-return-left text-info fs-5"></i>
                      <div class="small text-muted mt-1">Devoluciones</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación mejorado -->
    <div 
      v-if="showConfirmationModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background: rgba(0,0,0,0.5);"
      @click.self="closeConfirmationModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-body text-center p-5">
            <div class="success-animation mb-4">
              <div class="checkmark-circle">
                <i class="bi bi-check-lg"></i>
              </div>
            </div>
            
            <h3 class="fw-bold text-success mb-3">¡Pedido Confirmado!</h3>
            <p class="text-muted mb-4">
              Tu pedido ha sido procesado exitosamente.<br>
              Recibirás un correo de confirmación pronto.
            </p>
            
            <div class="order-info p-3 bg-light rounded mb-4">
              <div class="row text-start">
                <div class="col-6">
                  <small class="text-muted">Total pagado:</small>
                  <div class="fw-bold text-success">{{ formatPrice(subTotal) }}</div>
                </div>
                <div class="col-6">
                  <small class="text-muted">Método de pago:</small>
                  <div class="fw-medium">Tarjeta de crédito</div>
                </div>
              </div>
            </div>

            <div class="d-grid gap-2">
              <router-link to="/perfil-usuario" class="btn btn-primary btn-lg">
                <i class="bi bi-person-circle me-2"></i>
                Ver Mis Pedidos
              </router-link>
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="closeConfirmationModal"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar dirección -->
    <div 
      v-if="showAddressModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background: rgba(0,0,0,0.5);"
      @click.self="showAddressModal = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-geo-alt me-2 text-primary"></i>
              Cambiar Dirección de Envío
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showAddressModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info d-flex align-items-center">
              <i class="bi bi-info-circle me-2"></i>
              <small>Para modificar tu dirección de envío, ve a la configuración de tu perfil.</small>
            </div>
            <div class="current-address p-3 bg-light rounded">
              <div class="fw-semibold mb-1">Dirección actual:</div>
              <div class="text-muted">{{ formatAddres() }}</div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              @click="showAddressModal = false"
            >
              Cancelar
            </button>
            <router-link to="/perfil-usuario" class="btn btn-primary">
              <i class="bi bi-gear me-1"></i>
              Ir a Configuración
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import MainHeader from "@/components/MainHeader.vue";
import axios from "axios";
import {
  WalletCardsIcon,
  CarIcon,
  LucideDollarSign,
  LucideInfo,
} from "lucide-vue-next";
import SecundaryHeader from "@/components/SecundaryHeader.vue";

export default {
  name: "Relizarpagos",
  components: {
    WalletCardsIcon,
    CarIcon,
    LucideDollarSign,
    LucideInfo,
    MainHeader,
    SecundaryHeader,
  },
  data() {
    return {
      user: {},
      subTotal: 0,
      nuevaTarjeta: {
        numero: "",
        fechaVencimiento: "",
        cvc: "",
      },
      tarjetas: [],
      paises: ["México", "Estados Unidos", "Canadá", "España", "Argentina"],
      paisSeleccionado: "",
      aceptaTerminos: false,
      esMayorDeEdad: false,
      showConfirmationModal: false,
      showAddressModal: false,
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userInfo"));
    this.subTotal = this.$route.query.subTotal;
  },
  methods: {
    formatAddres() {
      if (!this.user || !this.user.calle || !this.user.colonia || !this.user.numero || !this.user.codigoPostal) {
        return "Dirección incompleta";
      }
      return `${this.user.calle} ${this.user.numero}, ${this.user.colonia}, CP ${this.user.codigoPostal}`;
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(price);
    },
    
    changeAddress() {
      this.showAddressModal = true;
    },
    
    closeConfirmationModal() {
      this.showConfirmationModal = false;
    },
    
    agregarTarjeta() {
      this.tarjetas.push({ ...this.nuevaTarjeta });
      this.nuevaTarjeta = {
        numero: "",
        fechaVencimiento: "",
        cvc: "",
      };
    },
    
    async createOrder() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const data = {
        precioTotal: this.subTotal,
        fechaCompra: formattedDate,
        tipodePago: 'Tarjeta de crédito',
        estatusPedido: 'Preparando',
      };
      
      try {
        const response = await axios.post('/api/v1/pedidos/', data, {
          params: { idCliente: this.user.idCliente }
        });
        console.log(response);
        this.showConfirmationModal = true;
      } catch (error) {
        if (error.response) {
          let messageError = error.response.data.message;
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
};
</script>

<style scoped>
/* Breadcrumb personalizado */
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

/* Progress bar */
.progress {
  background-color: #e9ecef;
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

/* Animaciones para las tarjetas */
.payment-card {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.payment-card:nth-child(1) { animation-delay: 0.1s; }
.payment-card:nth-child(2) { animation-delay: 0.2s; }
.payment-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.payment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

/* Iconos wrapper */
.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Información de envío */
.shipping-info {
  border-left: 4px solid #0d6efd;
}

/* Formulario de pago */
.payment-form .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Iconos de tarjetas */
.card-icons {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 5px;
}

.card-icons img {
  width: 30px;
  height: auto;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.card-icons img:hover {
  opacity: 1;
}

/* Información de seguridad */
.security-info {
  border-left: 4px solid #0d6efd;
}

/* Términos y condiciones */
.terms-section .form-check {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.terms-section .form-check:has(input:checked) {
  border-left-color: #198754;
  background-color: rgba(25, 135, 84, 0.05);
}

/* Desglose de precios */
.price-breakdown {
  font-size: 15px;
}

/* Garantías */
.guarantees i {
  transition: transform 0.3s ease;
}

.guarantees .col-4:hover i {
  transform: scale(1.1);
}

/* Modal de confirmación */
.success-animation {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  animation: bounceIn 0.8s ease-out;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.order-info {
  border-left: 4px solid #28a745;
}

/* Modal mejorado */
.modal-content {
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

/* Botones */
.btn {
  transition: all 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn-success:hover {
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 768px) {
  .icon-wrapper {
    width: 35px;
    height: 35px;
  }
  
  .card-icons {
    right: 10px;
  }
  
  .card-icons img {
    width: 25px;
  }
}
</style>
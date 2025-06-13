<template>
  <div class="min-vh-100 bg-light">
    <MainHeader />
    
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
              <li class="breadcrumb-item active">Carrito</li>
            </ol>
          </nav>
          <h1 class="h2 mb-1 fw-bold text-dark">
            Mi Carrito
            <span class="text-muted fs-6 fw-normal" v-if="cartLenght">
              ({{ cartLenght }} {{ cartLenght === 1 ? 'producto' : 'productos' }})
            </span>
          </h1>
        </div>
        <div class="col-md-4 text-md-end" v-if="cartLenght">
          <div class="d-flex align-items-center justify-content-md-end">
            <small class="text-muted me-3">Paso 1 de 3</small>
            <div class="progress flex-grow-1" style="height: 4px; max-width: 120px;">
              <div class="progress-bar bg-success" style="width: 33.33%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container pb-5">
      <!-- Carrito con productos -->
      <template v-if="cartLenght">
        <div class="row g-4">
          <!-- Lista de Productos -->
          <div class="col-lg-8">
            <!-- Encabezado de la lista (solo desktop) -->
            <div class="card border-0 shadow-sm mb-3 d-none d-lg-block">
              <div class="card-body py-3">
                <div class="row text-muted fw-semibold small">
                  <div class="col-6">PRODUCTO</div>
                  <div class="col-2 text-center">CANTIDAD</div>
                  <div class="col-2 text-center">PRECIO</div>
                  <div class="col-2 text-center">SUBTOTAL</div>
                </div>
              </div>
            </div>

            <!-- Items del carrito -->
            <div class="cart-items">
              <div
                v-for="(item, index) in cart"
                :key="item.id"
                class="card border-0 shadow-sm mb-3 cart-item"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="card-body p-4">
                  <div class="row align-items-center">
                    <!-- Información del producto -->
                    <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                      <div class="d-flex align-items-center">
                        <div class="product-image-wrapper me-3">
                          <img
                            :src="item.producto.imagenUrl"
                            :alt="item.producto.nombreProducto"
                            class="product-image"
                          />
                        </div>
                        <div class="flex-grow-1">
                          <h6 class="mb-1 fw-bold text-dark">{{ item.producto.nombreProducto }}</h6>
                          <div class="d-flex align-items-center text-muted small">
                            <i class="bi bi-shop me-1"></i>
                            {{ item.producto.proveedor.nombreProveedor }}
                          </div>
                          <div class="mt-2 d-lg-none">
                            <span class="badge bg-light text-dark">
                              Stock: {{ item.producto.stock }} unidades
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Control de cantidad -->
                    <div class="col-6 col-lg-2 mb-3 mb-lg-0">
                      <div class="quantity-controls">
                        <button
                          class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click="decreaseQuantity(item)"
                          :disabled="item.cantidad <= 1"
                        >
                          <i class="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          class="form-control form-control-sm quantity-input"
                          v-model.number="item.cantidad"
                          readonly
                          :max="item.producto.stock"
                        />
                        <button
                          class="btn btn-outline-secondary btn-sm quantity-btn"
                          :disabled="item.cantidad >= item.producto.stock"
                          @click="increaseQuantity(item)"
                        >
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                      <small class="text-muted d-none d-lg-block mt-1">
                        Stock: {{ item.producto.stock }}
                      </small>
                    </div>

                    <!-- Precio unitario -->
                    <div class="col-6 col-lg-2 mb-3 mb-lg-0 text-end text-lg-center">
                      <div class="d-lg-none small text-muted mb-1">Precio unitario</div>
                      <span class="fw-bold text-primary">
                        {{ formatPrice(item.producto.precioUnitario) }}
                      </span>
                    </div>

                    <!-- Subtotal y acciones -->
                    <div class="col-12 col-lg-2">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="text-end text-lg-center flex-grow-1">
                          <div class="d-lg-none small text-muted mb-1">Subtotal</div>
                          <div class="fw-bold h6 mb-0 text-success">
                            {{ formatPrice(item.producto.precioUnitario * item.cantidad) }}
                          </div>
                        </div>
                        <button
                          class="btn btn-outline-danger btn-sm ms-2 remove-btn"
                          @click="removeItem(item)"
                          title="Eliminar producto"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón continuar comprando -->
            <div class="text-center mt-4">
              <router-link to="/products" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-arrow-left me-2"></i>
                Continuar Comprando
              </router-link>
            </div>
          </div>

          <!-- Resumen del Carrito -->
          <div class="col-lg-4">
            <div class="position-sticky" style="top: 2rem;">
              <!-- Resumen de compra -->
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white border-0 py-3">
                  <h5 class="mb-0 fw-bold">
                    <i class="bi bi-receipt me-2 text-primary"></i>
                    Resumen de Compra
                  </h5>
                </div>
                <div class="card-body">
                  <!-- Dirección de envío -->
                  <div class="mb-4">
                    <h6 class="mb-3 fw-semibold">
                      <i class="bi bi-geo-alt me-2"></i>
                      Dirección de Envío
                    </h6>
                    <div class="address-card p-3 bg-light rounded">
                      <div class="small text-muted mb-1">Entregar en:</div>
                      <div class="fw-medium">{{ editAddress }}</div>
                    </div>
                    <button
                      class="btn btn-outline-primary btn-sm mt-2 w-100"
                      @click="showAddressForm = true"
                    >
                      <i class="bi bi-pencil me-1"></i>
                      Editar Dirección
                    </button>
                  </div>

                  <!-- Totales -->
                  <div class="border-top pt-4">
                    <div class="d-flex justify-content-between mb-3">
                      <span class="text-muted">Subtotal ({{ cartLenght }} productos)</span>
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
                      <span class="text-muted">Descuentos</span>
                      <span class="text-muted">{{ formatPrice(0.0) }}</span>
                    </div>
                    
                    <div class="border-top pt-3 mb-4">
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0 fw-bold">Total</span>
                        <span class="h4 mb-0 fw-bold text-primary">
                          {{ formatPrice(subTotal) }}
                        </span>
                      </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="d-grid gap-2">
                      <router-link
                        :to="{ path: '/metodo-pago', query: { subTotal: subTotal } }"
                        class="btn btn-primary btn-lg"
                        :class="{ 'disabled': !cart.length }"
                      >
                        <i class="bi bi-credit-card me-2"></i>
                        Proceder al Pago
                      </router-link>
                      <router-link
                        to="/home-screen"
                        class="btn btn-outline-secondary"
                      >
                        <i class="bi bi-house me-2"></i>
                        Volver al Inicio
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información adicional -->
              <div class="card border-0 bg-primary text-white">
                <div class="card-body text-center py-4">
                  <i class="bi bi-shield-check fs-1 mb-2"></i>
                  <h6 class="fw-bold mb-2">Compra Segura</h6>
                  <small class="opacity-75">
                    Tus datos están protegidos con encriptación SSL
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Carrito vacío -->
      <template v-else>
        <div class="text-center py-5">
          <div class="empty-cart-container">
            <div class="empty-cart-icon mb-4">
              <i class="bi bi-cart-x"></i>
            </div>
            <h2 class="h3 fw-bold mb-3 text-dark">Tu carrito está vacío</h2>
            <p class="text-muted mb-4 fs-5">
              ¡Descubre nuestros productos y realiza tu primera compra!
            </p>
            <div class="row justify-content-center">
              <div class="col-md-6">
                <img 
                  src="../assets/carritovacio.png" 
                  alt="Carrito vacío" 
                  class="img-fluid mb-4"
                  style="max-width: 300px; opacity: 0.7;"
                />
              </div>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
              <router-link
                to="/home-screen"
                class="btn btn-primary btn-lg px-5"
              >
                <i class="bi bi-search me-2"></i>
                Explorar Productos
              </router-link>
              <router-link
                to="/categories"
                class="btn btn-outline-primary btn-lg px-4"
              >
                <i class="bi bi-grid me-2"></i>
                Ver Categorías
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal para editar dirección -->
    <div 
      v-if="showAddressForm" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background: rgba(0,0,0,0.5);"
      @click.self="showAddressForm = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-geo-alt me-2 text-primary"></i>
              Dirección de Entrega
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showAddressForm = false"
            ></button>
          </div>
          <div class="modal-body pt-2">
            <div class="address-display p-4 bg-light rounded mb-3">
              <div class="d-flex align-items-start">
                <i class="bi bi-house-door text-primary me-3 mt-1"></i>
                <div>
                  <div class="fw-bold mb-1">Dirección actual:</div>
                  <div class="text-dark">{{ editAddress }}</div>
                </div>
              </div>
            </div>
            <div class="alert alert-info d-flex align-items-center">
              <i class="bi bi-info-circle me-2"></i>
              <small>Para modificar tu dirección, ve a tu perfil de usuario.</small>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button 
              type="button" 
              class="btn btn-primary"
              @click="showAddressForm = false"
            >
              <i class="bi bi-check me-2"></i>
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import axios from "axios";

export default defineComponent({
  name: "ShoppingCart",

  components: {
    MainHeader,
  },

  setup() {
    const cart = ref([]);
    const cartLenght = ref(0);
    const subTotal = ref(0);
    const showAddressForm = ref(false);
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const loadCart = async () => {
      try {
        const response = await axios.get("/api/v1/cart/by-user/", {
          params: { idCliente: user.idCliente },
        });
        cart.value = response.data;
        cartLenght.value = cart.value.length;
        getSubTotal();
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
    };

    const formatAddres = () => {
      if (!user || !user.calle || !user.colonia || !user.numero || !user.codigoPostal) {
        return "Dirección incompleta";
      }
      return `${user.calle} ${user.numero}, ${user.colonia}, CP ${user.codigoPostal}`;
    };
    const editAddress = ref(formatAddres());

    const formatPrice = (price) =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(price);
    
    const getSubTotal = async () => {
      console.log(user.carrito.idCarrito);
      try {
        const response = await axios.get("/api/v1/cart/get-total/", {
          params: { idCarrito: user.carrito.idCarrito }
        });
        if (response) {
          subTotal.value = parseFloat(response.data).toFixed(2);
        }
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
    };

    const updateQuantity = async (item) => {
      item['carrito'] = user.carrito;
      try {
        const response = await axios.post("/api/v1/cart/update", item);
        if (response) {
          loadCart();
          getSubTotal();
        }
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
    };

    const increaseQuantity = (item) => {
      item.cantidad++;
      updateQuantity(item);
    };

    const decreaseQuantity = (item) => {
      if (item.cantidad > 1) {
        item.cantidad--;
      }
      updateQuantity(item);
    };

    const removeItem = async (item) => {
      item['carrito'] = user.carrito;
      try {
        const response = await axios.post("/api/v1/cart/remove", item);
        if (response) {
          loadCart();
          getSubTotal();
        }
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
    };

    onMounted(loadCart);

    return {
      cart,
      cartLenght,
      subTotal,
      showAddressForm,
      editAddress,
      formatPrice,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
    };
  },
});
</script>

<style scoped>
/* Animaciones y transiciones */
.cart-item {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Imagen del producto mejorada */
.product-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #f8f9fa;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image-wrapper:hover .product-image {
  transform: scale(1.05);
}

/* Controles de cantidad mejorados */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  max-width: 120px;
  margin: 0 auto;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.quantity-btn:first-child {
  border-radius: 6px 0 0 6px;
}

.quantity-btn:last-child {
  border-radius: 0 6px 6px 0;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
  transform: scale(1.05);
}

.quantity-input {
  width: 56px;
  height: 32px;
  text-align: center;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  font-weight: 600;
  background-color: #f8f9fa;
}

/* Botón eliminar */
.remove-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
  transform: scale(1.1);
}

/* Carrito vacío */
.empty-cart-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.empty-cart-icon {
  font-size: 6rem;
  color: #6c757d;
  opacity: 0.5;
}

/* Dirección */
.address-card {
  border-left: 4px solid #0d6efd;
  transition: all 0.3s ease;
}

.address-display {
  border-left: 4px solid #0d6efd;
}

/* Modal mejorado */
.modal-content {
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.modal-header {
  padding: 1.5rem 1.5rem 0.5rem;
}

.modal-body {
  padding: 0.5rem 1.5rem;
}

.modal-footer {
  padding: 0.5rem 1.5rem 1.5rem;
}

/* Responsive mejoras */
@media (max-width: 768px) {
  .product-image-wrapper {
    width: 70px;
    height: 70px;
  }
  
  .quantity-controls {
    max-width: 100px;
  }
  
  .quantity-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .quantity-input {
    width: 44px;
    height: 28px;
    font-size: 12px;
  }
  
  .remove-btn {
    width: 32px;
    height: 32px;
  }
}

/* Efectos adicionales */
.card {
  transition: all 0.3s ease;
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
}

/* Progress bar personalizada */
.progress {
  background-color: #e9ecef;
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

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
</style>
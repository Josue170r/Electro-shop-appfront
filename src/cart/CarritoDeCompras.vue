<template>
  <div class="h-screen w-full flex flex-col md:flex-row bg-gray-100">
    <MainHeader />
    <div class="container py-4">
      <h2 class="mb-4">Carrito de Compras</h2>

      <!-- Verificación de datos -->
      <template v-if="cartLength > 0">
        <div class="row">
          <div class="col-md-8">
            <div class="card shadow-md mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Productos en tu carrito</h5>
                <button 
                  class="btn btn-outline-danger btn-sm"
                  @click="clearCart"
                  :disabled="isLoading"
                >
                  <i class="bi bi-trash"></i> Vaciar carrito
                </button>
              </div>
              <div class="card-body">
                <!-- Encabezado de la lista -->
                <div class="d-none d-md-flex w-full border-bottom pb-2 mb-3">
                  <div class="col-5">Producto</div>
                  <div class="col-2 text-center">Cantidad</div>
                  <div class="col-2 text-center">Precio Unit.</div>
                  <div class="col-2 text-center">Subtotal</div>
                  <div class="col-1 text-center">Acción</div>
                </div>

                <!-- Items del carrito -->
                <div
                  v-for="item in cart"
                  :key="item.id_articulo"
                  class="row align-items-center py-3 border-bottom"
                >
                  <!-- Información del producto -->
                  <div class="col-12 col-md-5 mb-2 mb-md-0">
                    <div class="d-flex align-items-center">
                      <img
                        :src="item.imagen || defaultImage"
                        :alt="item.nombre || 'Producto'"
                        class="cart-item-image me-3"
                        style="width: 80px; height: 80px; object-fit: cover"
                      />
                      <div>
                        <h6 class="mb-0">{{ item.nombre || '' }}</h6>
                        <small class="text-muted">
                          {{ item.descripcion || '' }}
                        </small>
                      </div>
                    </div>
                  </div>

                  <!-- Control de cantidad -->
                  <div class="col-6 col-md-2 mb-2 mb-md-0">
                    <div class="d-flex justify-content-center align-items-center">
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="decreaseQuantity(item)"
                        :disabled="item.cantidad <= 1 || isLoading"
                      >
                        <i class="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        class="form-control form-control-sm mx-2 text-center"
                        style="width: 60px"
                        v-model.number="item.cantidad"
                        readonly
                      />
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="increaseQuantity(item)"
                        :disabled="isLoading"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Precio unitario -->
                  <div class="col-6 col-md-2 text-end text-md-center">
                    <span class="d-inline d-md-none">Precio: </span>
                    {{ formatPrice(item.precio || 0) }}
                  </div>

                  <!-- Subtotal del item -->
                  <div class="col-6 col-md-2 text-end text-md-center">
                    <span class="d-inline d-md-none">Subtotal: </span>
                    <strong>{{ formatPrice((item.precio || 0) * (item.cantidad || 0)) }}</strong>
                  </div>

                  <!-- Botón eliminar -->
                  <div class="col-6 col-md-1 text-end text-md-center">
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="removeItem(item)"
                      :disabled="isLoading"
                      title="Eliminar producto"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <!-- Loading overlay para operaciones -->
                <div v-if="isLoading" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                  <span class="text-muted">Actualizando carrito...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen del Carrito -->
          <div class="col-md-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title mb-4">Resumen de Compra</h5>
                
                <!-- Cálculos del carrito -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Artículos ({{ totalItems }}):</span>
                    <span>{{ formatPrice(subtotal) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <span class="text-success">Gratis</span>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong class="text-primary fs-5">{{ formatPrice(total) }}</strong>
                  </div>
                </div>

                <!-- Dirección de envío -->
                <div class="mb-4">
                  <h6 class="mb-2">Dirección de Envío</h6>
                  <button
                    class="btn btn-sm btn-outline-primary mt-2"
                    @click="showAddressForm = true"
                  >
                    Ver dirección
                  </button>
                </div>
                
                <div class="border-top pt-3">
                  <router-link
                    :to="{ path: '/metodo-pago' }"
                    class="w-100 mt-4"
                  >
                    <button
                      class="btn btn-primary w-100"
                      :disabled="!cartLength || isLoading"
                    >
                      Proceder al Pago
                    </button>
                  </router-link>
                  <router-link
                    to="/home-screen"
                    class="btn btn-outline-secondary w-100 mt-3"
                  >
                    Regresar a Inicio
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <template v-else>
        <div class="text-center py-5">
          <h3>Tu carrito está vacío...</h3>
          <div class="text-center">
            <img :src="defaultImage" alt="Carrito vacío" style="max-width: 300px;" />
          </div>
          <p class="text-muted">¡Realiza tu primer pedido!</p>
          <router-link
            to="/home-screen"
            class="btn btn-primary w-50 mt-3"
          >
            Buscar productos
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import axios from "axios";
import { useStore } from 'vuex';
import { toast } from 'vue3-toastify';

const store = useStore();
const cart = ref([]);
const showAddressForm = ref(false);
const isLoading = ref(false);
const defaultImage = new URL('@/assets/producto_sinfoto.png', import.meta.url).href;

// Datos del usuario desde Vuex
const user = computed(() => store.state.users?.user);
const tokenAccess = computed(() => store.state.users?.tokenAccess);

// Verificar autenticación
const isAuthenticated = computed(() => user.value && tokenAccess.value);

// Longitud del carrito
const cartLength = computed(() => Array.isArray(cart.value) ? cart.value.length : 0);

// Cálculos del carrito
const totalItems = computed(() => {
  return cart.value.reduce((total, item) => total + (item.cantidad || 0), 0);
});

const subtotal = computed(() => {
  return cart.value.reduce((total, item) => {
    return total + ((item.precio || 0) * (item.cantidad || 0));
  }, 0);
});

const total = computed(() => {
  // Por ahora el total es igual al subtotal (envío gratis)
  return subtotal.value;
});

// Cargar el carrito
const loadCart = async () => {
  if (!isAuthenticated.value) {
    cart.value = [];
    return;
  }
  
  try {
    const response = await axios.post("/consulta_carrito", {
      id_usuario: user.value.id_usuario,
      token: tokenAccess.value,
    });
    
    cart.value = response.data.map(product => {
      return {
        ...product,
        imagen: product.fotografia ? `data:image/jpeg;base64,${product.fotografia}` : null
      }
    });
    
    console.log('Carrito cargado:', cart.value);
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    cart.value = [];
    if (error.response) {
      toast(error.response.data.message || 'Error al cargar el carrito', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      });
    }
  }
};

// Actualizar cantidad de un producto
const updateQuantity = async (item) => {
  if (!isAuthenticated.value) {
    toast('Debes iniciar sesión', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "warning",
      theme: "colored",
    });
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.post("/actualiza_carrito", {
      id_usuario: user.value.id_usuario,
      token: tokenAccess.value,
      id_articulo: item.id_articulo,
      cantidad: item.cantidad
    });

    if (response.status === 200) {
      toast('Cantidad actualizada correctamente', {
        hideProgressBar: true,
        autoClose: 1000,
        type: "success",
        theme: "colored",
      });
      // Recargar carrito para obtener datos actualizados
      await loadCart();
    }
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    if (error.response) {
      toast(error.response.data.message || 'Error al actualizar la cantidad', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      });
    }
    // Recargar carrito en caso de error para sincronizar
    await loadCart();
  } finally {
    isLoading.value = false;
  }
};

// Aumentar cantidad
const increaseQuantity = (item) => {
  if (item.cantidad < 100) { // Límite máximo razonable
    item.cantidad++;
    updateQuantity(item);
  }
};

// Disminuir cantidad
const decreaseQuantity = (item) => {
  if (item.cantidad > 1) {
    item.cantidad--;
    updateQuantity(item);
  }
};

// Eliminar un artículo específico del carrito
const removeItem = async (item) => {
  if (!isAuthenticated.value) {
    toast('Debes iniciar sesión', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "warning",
      theme: "colored",
    });
    return;
  }

  // Confirmar eliminación
  if (!confirm(`¿Estás seguro de eliminar "${item.nombre}" del carrito?`)) {
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.post("/elimina_articulo_carrito_compra", {
      id_usuario: user.value.id_usuario,
      token: tokenAccess.value,
      id_articulo: item.id_articulo
    });

    if (response.status === 200) {
      toast('Producto eliminado del carrito', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "success",
        theme: "colored",
      });
      // Recargar carrito
      await loadCart();
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    if (error.response) {
      toast(error.response.data.message || 'Error al eliminar el producto', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

// Vaciar todo el carrito
const clearCart = async () => {
  if (!isAuthenticated.value) {
    toast('Debes iniciar sesión', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "warning",
      theme: "colored",
    });
    return;
  }

  // Confirmar eliminación
  if (!confirm('¿Estás seguro de vaciar todo el carrito? Esta acción no se puede deshacer.')) {
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.post("/elimina_carrito_compra", {
      id_usuario: user.value.id_usuario,
      token: tokenAccess.value
    });

    if (response.status === 200) {
      toast('Carrito vaciado correctamente', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "success",
        theme: "colored",
      });
      cart.value = [];
    }
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    if (error.response) {
      toast(error.response.data.message || 'Error al vaciar el carrito', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

// Formatear precio
const formatPrice = (price) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);

onMounted(loadCart);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card {
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cart-item-image {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.border-bottom:last-child {
  border-bottom: none !important;
}

@media (max-width: 768px) {
  .row.align-items-center {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }
  
  .col-6 {
    margin-bottom: 0.5rem;
  }
}
</style>
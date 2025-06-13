<template>
  <div>
    <MainHeader />
    <div v-if="product" class="container py-3">
      <div class="row g-4 align-items-stretch">
        <!-- Columna de la imagen -->
        <div class="col-md-5 d-flex">
          <!-- Imagen principal -->
          <div class="card border-0 shadow-sm mb-3 w-100">
            <div class="card-body p-3 d-flex flex-column justify-content-between">
              <div class="d-flex justify-content-center align-items-center" style="height: 240px;">
                <img
                  :src="product.imagenUrl || defaultImage"
                  :alt="product.nombreProducto"
                  class="img-fluid rounded"
                  style="max-height: 100%; max-width: 100%; object-fit: contain;"
                />
              </div>
              
              <!-- Miniaturas adicionales -->
              <div
                v-if="product.additionalImages && product.additionalImages.length > 0"
                class="d-flex gap-2 justify-content-center mt-3"
              >
                <div
                  v-for="(image, index) in product.additionalImages"
                  :key="index"
                  class="thumbnail-container"
                >
                  <img
                    :src="image"
                    :alt="product.nombreProducto"
                    class="img-thumbnail rounded"
                    style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
                    @click="setMainImage(image)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna de detalles -->
        <div class="col-md-7 d-flex">
          <div class="card border-0 shadow-sm w-100">
            <div class="card-body p-4 d-flex flex-column justify-content-between">
              <!-- Header del producto -->
              <div class="border-bottom pb-3 mb-3">
                <h2 class="h3 fw-bold text-dark mb-2">{{ product.nombreProducto }}</h2>
                <p class="text-muted mb-0">
                  <i class="bi bi-shop me-2"></i>{{ product.proveedor.nombreProveedor }}
                </p>
              </div>

              <!-- Precio y stock -->
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="h2 fw-bold text-primary mb-0">
                  {{ formatPrice(product.precioUnitario) }}
                </span>
                <span 
                  v-if="product.stock > 0" 
                  class="badge bg-success px-3 py-2"
                >
                  <i class="bi bi-check-circle me-1"></i>En stock
                </span>
                <span 
                  v-else 
                  class="badge bg-danger px-3 py-2"
                >
                  <i class="bi bi-x-circle me-1"></i>Agotado
                </span>
              </div>

              <!-- Controles de cantidad y carrito -->
              <div class="bg-light rounded p-3 mb-3">
                <div class="row align-items-center g-3">
                  <div class="col-auto">
                    <label for="quantity" class="form-label fw-semibold mb-0">Cantidad:</label>
                  </div>
                  <div class="col-auto">
                    <div class="input-group" style="width: 130px;">
                      <button
                        class="btn btn-outline-primary btn-sm"
                        type="button"
                        @click="decreaseQuantity"
                        :disabled="quantity <= 1"
                      >
                        <i class="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        class="form-control form-control-sm text-center fw-bold"
                        id="quantity"
                        v-model.number="quantity"
                        min="1"
                        readonly
                        :max="product.stock"
                      />
                      <button
                        class="btn btn-outline-primary btn-sm"
                        type="button"
                        @click="increaseQuantity"
                        :disabled="quantity >= product.stock"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col">
                    <button
                      class="btn btn-primary"
                      @click="addToCart"
                      :disabled="product.stock <= 0"
                    >
                      <i class="bi bi-cart-plus me-2"></i>Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div>
                <h5 class="fw-bold text-dark mb-2">
                  <i class="bi bi-info-circle text-primary me-2"></i>Descripción
                </h5>
                <p class="text-muted mb-0">{{ product.descripcionProducto }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Componente de reseñas -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 p-3">
              <h4 class="fw-bold text-dark mb-0">
                <i class="bi bi-star text-warning me-2"></i>Reseñas del producto
              </h4>
            </div>
            <div class="card-body p-3">
              <ResenasProducto :productId="product.idProducto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import ResenasProducto from "@/cart/ResenasProducto.vue";
import axios from "axios";
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify'
import MainHeader from "@/components/MainHeader.vue";

export default defineComponent({
  name: "ProductDetail",
  components: {
    ResenasProducto,
    MainHeader
  },

  setup() {
    const route = useRoute();
    const router = useRouter()
    const product = ref(null);
    const quantity = ref(1);
    const defaultImage = "https://via.placeholder.com/500"; // Imagen genérica por defecto
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log(user)

    const loadProduct = async () => {
      const idProduct = route.query.id
      console.log(idProduct)
      try {
        const response = await axios.get(
          `/api/v1/productos/${idProduct}`
        )
        product.value = response.data;
      } catch (error) {
        if (error.response) {
          let messageError = error.response.data.message
          toast(messageError, {
            hideProgressBar: true,
            autoClose: 1500,
            type: "error",
            theme: "colored",
          })
        }
      }
    }

    // Agregar al carrito
    const addToCart = async () => {
      const data = {
        cantidad: quantity.value,
        producto: product.value,
        carrito: user.carrito,
      }
      try {
        const response = await axios.post('/api/v1/cart/add', data);
        if (response) {
          toast("Producto añadido al carrito", {
            hideProgressBar: true,
            autoClose: 600,
            type: "success",
            theme: "colored",
            onClose: () => {
              router.push({name: 'CarritoDeCompras'})
            },
          })
        }
      } catch (error) {
        if (error.response) {
          let messageError = 'Este producto ya está en el carrito'
          toast(messageError, {
            hideProgressBar: true,
            autoClose: 1500,
            type: "error",
            theme: "colored",
          })
        }
      }
    };

    // Formatear precio
    const formatPrice = (price) => {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(price);
    };

    // Manejar cantidad
    const increaseQuantity = () => {
      quantity.value++;
    };

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    // Cambiar imagen principal
    const setMainImage = (image) => {
      const currentMain = product.value.mainImage;
      product.value = {
        ...product.value,
        mainImage: image,
        additionalImages: product.value.additionalImages.map((img) =>
          img === image ? currentMain : img
        ),
      };
    };

    onMounted(loadProduct);

    return {
      product,
      quantity,
      defaultImage,
      formatPrice,
      increaseQuantity,
      decreaseQuantity,
      setMainImage,
      addToCart,
    };
  },
});
</script>

<style scoped>
.thumbnail-container img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-color: var(--bs-primary) !important;
}

.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0,123,255,0.3);
}

.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}

/* Mejoras responsivas */
@media (max-width: 768px) {
  .h2 {
    font-size: 1.5rem;
  }
  
  .h3 {
    font-size: 1.25rem;
  }
}
</style>
<template>
  <div>
    <MainHeader />
    <div v-if="product" class="container py-4">
      <div class="row h-100">
        <!-- Columna de la imagen -->
        <div class="col-md-6 mb-4 h-100">
          <img
            :src="mainImage || defaultImage"
            :alt="product.nombre"
            class="img-fluid rounded"
          />

          <!-- Miniaturas adicionales -->
          <div
            v-if="(product.imagenes && product.imagenes.length > 1)"
            class="d-flex mt-3 gap-2"
          >
            <div
              v-for="(image, index) in product.imagenes"
              :key="index"
              class="thumbnail-container"
              style="width: 80px; height: 80px"
            >
              <img
                :src="image || defaultImage"
                :alt="product.nombre"
                class="img-thumbnail"
                style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;"
                @click="setMainImage(image)"
              />
            </div>
          </div>
        </div>

        <!-- Columna de detalles -->
        <div class="col-md-6">
          <h2 class="mb-2">{{ product.nombre }}</h2>

          <div class="fs-3 fw-bold text-primary mb-4">
            {{ formatPrice(product.precio) }}
          </div>

          <!-- Stock status -->
          <div class="mb-4">
            <span v-if="product.cantidad > 0" class="badge bg-success">En stock</span>
            <span v-else class="badge bg-danger">Agotado</span>
          </div>

          <!-- Cantidad y botón de agregar al carrito -->
          <div class="mb-4">
            <label for="quantity" class="form-label">Cantidad:</label>
            <div class="d-flex gap-3 align-items-center">
              <div class="input-group" style="width: 140px">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  class="form-control text-center"
                  id="quantity"
                  v-model.number="quantity"
                  min="1"
                  readonly
                  :max="product.cantidad"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="increaseQuantity"
                  :disabled="quantity >= product.cantidad"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>

              <button
                class="btn btn-primary"
                @click="addToCart"
                :disabled="product.cantidad <= 0"
              >
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Descripción -->
          <div class="mt-4">
            <h5>Descripción</h5>
            <p>{{ product.descripcion }}</p>
          </div>
        </div>
      </div>
      <!-- Componente de reseñas (ajusta el prop según tu store) -->
      <ResenasProducto :idProducto="product.id_articulo" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ResenasProducto from "@/cart/ResenasProducto.vue";
import axios from "axios";
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import MainHeader from "@/components/MainHeader.vue";
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const quantity = ref(1);
const defaultImage = new URL('@/assets/producto_sinfoto.png', import.meta.url).href;

const product = computed(() => store.state.articulos.selectedArticle);
const user = computed(() => store.state.users.user);
const tokenAccess = computed(() => store.state.users.tokenAccess);
// Imagen principal (local)
const mainImage = ref(`data:image/jpeg;base64,${product.fotografia}`|| defaultImage);

watch(
  () => product.value,
  (newProduct) => {
    mainImage.value = newProduct?.imagen || defaultImage;
    quantity.value = 1;
  },
  { immediate: true }
);

const setMainImage = (image) => {
  mainImage.value = image || defaultImage;
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
  if (quantity.value < product.value.cantidad) quantity.value++;
};
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// Agregar al carrito
const addToCart = async () => {
  try {
    const response = await axios.post('/compra_articulo', {
      cantidad: quantity.value,
      id_articulo: product.value.id_articulo,
      id_usuario: user.value.id_usuario,
      token: tokenAccess.value,
    });
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
      let messageError = error.response.data.detailMessage
      toast(messageError, {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      })
    }
  }
};
</script>

<style scoped>
.thumbnail-container {
  transition: all 0.2s ease-in-out;
}
.thumbnail-container:hover {
  transform: scale(1.05);
}
.img-fluid {
  max-height: 500px;
  object-fit: contain;
}
</style>

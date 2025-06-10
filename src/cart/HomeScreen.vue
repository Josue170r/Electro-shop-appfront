<template>
  <div>
    <MainHeader />
    <div class="container py-4 mt-4">
      <!-- Barra de búsqueda -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-search"></i>
                    </span>
                    <input
                      v-model="searchTerm"
                      type="text"
                      class="form-control"
                      placeholder="Buscar productos por nombre o descripción..."
                      @keyup.enter="searchProducts"
                      @input="handleSearchInput"
                    />
                  </div>
                </div>
                <div class="col-md-4 mt-2 mt-md-0">
                  <div class="d-flex gap-2">
                    <button 
                      class="btn btn-primary flex-fill"
                      @click="searchProducts"
                      :disabled="isSearching || !canSearch"
                    >
                      <span v-if="isSearching" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-search me-2"></i>
                      {{ isSearching ? 'Buscando...' : 'Buscar' }}
                    </button>
                    <button 
                      class="btn btn-outline-secondary"
                      @click="clearSearch"
                      :disabled="isSearching"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicador de resultados -->
      <div v-if="searchTerm" class="row mb-3">
        <div class="col-12">
          <div class="alert alert-info d-flex align-items-center">
            <i class="bi bi-info-circle me-2"></i>
            <span>
              {{ searchResults.length > 0 
                ? `Se encontró: "${searchResults[0].nombre}" para la búsqueda "${searchTerm}"` 
                : `No se encontraron resultados para "${searchTerm}"` 
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- Indicador cuando se muestran todos los productos -->
      <div v-else-if="!searchTerm && products.length > 0" class="row mb-3">
        <div class="col-12">
          <div class="alert alert-success d-flex align-items-center">
            <i class="bi bi-grid-3x3-gap me-2"></i>
            <span>Mostrando todos los productos disponibles ({{ products.length }} productos)</span>
          </div>
        </div>
      </div>

      <!-- Verificación si hay productos -->
      <main>
        <div v-if="displayProducts.length === 0 && !isLoading && !isSearching" class="text-center py-5">
          <h3>{{ searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles' }}</h3>
          <div class="text-center">
            <img src="../assets/pctriste.png" alt="Sin productos" style="max-width: 300px;" />
          </div>
          <p class="text-muted">
            {{ searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Por favor, verifica más tarde.' }}
          </p>
          <button v-if="searchTerm" class="btn btn-outline-primary" @click="clearSearch">
            <i class="bi bi-arrow-left me-2"></i>Ver todos los productos
          </button>
        </div>

        <!-- Loading spinner -->
        <div v-if="isLoading || isSearching" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ isSearching ? 'Buscando...' : 'Cargando...' }}</span>
          </div>
          <p class="mt-2 text-muted">
            {{ isSearching ? 'Buscando productos...' : 'Cargando productos...' }}
          </p>
        </div>

        <div v-else-if="displayProducts.length > 0 && !isLoading && !isSearching" class="row g-4">
          <!-- Grid de Productos -->
          <div
            v-for="(product, index) in displayProducts"
            :key="product.id_articulo || index"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <div class="card h-100">
              <img
                :src="product.imagen || defaultImage"
                class="card-img-top"
                style="height: 200px; object-fit: cover"
                :alt="product.nombre"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ product.nombre }}</h5>
                <p class="card-text flex-grow-1">
                  <small class="text-muted">{{ product.descripcion }}</small>
                </p>
                <p class="card-text">
                  <span class="fs-4 text-primary fw-bold">
                    ${{ product.precio?.toLocaleString() }}
                  </span>
                </p>
                <button class="btn btn-primary w-100 mt-auto" @click="sendToCart(product)">
                  Detalle
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import { toast } from 'vue3-toastify'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

const products = ref([]);
const searchResults = ref([]);
const searchTerm = ref('');
const isLoading = ref(false);
const isSearching = ref(false);

const router = useRouter()
const store = useStore();

// Obtener datos del usuario desde Vuex
const user = computed(() => store.state.users?.user)
const tokenAccess = computed(() => store.state.users?.tokenAccess)

// Verificar si se puede realizar búsqueda (usuario logueado)
const canSearch = computed(() => {
  return user.value && tokenAccess.value && searchTerm.value.trim().length > 0
})

// Productos a mostrar (todos o resultados de búsqueda)
const displayProducts = computed(() => {
  return searchTerm.value ? searchResults.value : products.value
})

// Cargar todos los productos
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/todos_articulos')
    
    // Procesar las imágenes de los productos
    products.value = response.data.map(product => {
      return {
        ...product,
        imagen: product.fotografia ? `data:image/jpeg;base64,${product.fotografia}` : null
      }
    })
  } catch (error) {
    console.error('Error al cargar productos:', error);
    if (error.response) {
      let messageError = error.response.data.message || 'Error al cargar productos'
      toast(messageError, {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      })
    }
  } finally {
    isLoading.value = false;
  }
}

// Buscar productos por palabra clave
const searchProducts = async () => {
  if (!canSearch.value) {
    if (!user.value || !tokenAccess.value) {
      toast('Debes iniciar sesión para buscar productos', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "warning",
        theme: "colored",
      })
    }
    return;
  }

  const palabraClave = searchTerm.value.trim();
  if (!palabraClave) {
    clearSearch();
    return;
  }

  isSearching.value = true;
  try {
    const searchData = {
      palabra_clave: palabraClave,
      id_usuario: user.value.id_usuario,
      token: tokenAccess.value
    };

    console.log('Buscando productos con:', searchData);

    const response = await axios.post('/consulta_articulo', searchData);
    
    // El backend devuelve UN SOLO producto (no array)
    if (response.data && response.status === 200) {
      const foundProduct = {
        ...response.data,
        imagen: response.data.fotografia ? `data:image/jpeg;base64,${response.data.fotografia}` : null
      };
      searchResults.value = [foundProduct]; // Lo convertimos en array para mostrar
      
      toast(`Se encontró el producto: ${foundProduct.nombre}`, {
        hideProgressBar: true,
        autoClose: 2000,
        type: "success",
        theme: "colored",
      });
    } else {
      searchResults.value = [];
    }

  } catch (error) {
    console.error('Error al buscar productos:', error);
    searchResults.value = [];
    
    if (error.response) {
      let messageError = error.response.data.message || 'Error al buscar productos'
      
      // Manejo específico para cuando no encuentra productos
      if (error.response.status === 400 && 
          (messageError.includes('No se encontró') || messageError.includes('articulo'))) {
        toast('No se encontró ningún producto con ese término de búsqueda', {
          hideProgressBar: true,
          autoClose: 2500,
          type: "info",
          theme: "colored",
        });
      } else if (error.response.status === 401) {
        toast('Sesión expirada. Por favor, inicia sesión nuevamente', {
          hideProgressBar: true,
          autoClose: 1500,
          type: "warning",
          theme: "colored",
        });
      } else {
        toast(messageError, {
          hideProgressBar: true,
          autoClose: 1500,
          type: "error",
          theme: "colored",
        });
      }
    } else {
      toast('Error de conexión al buscar productos', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      });
    }
  } finally {
    isSearching.value = false;
  }
}

// Limpiar búsqueda
const clearSearch = () => {
  searchTerm.value = '';
  searchResults.value = [];
}

// Manejar entrada de texto en búsqueda
const handleSearchInput = () => {
  // Si se borra el texto, limpiar resultados
  if (!searchTerm.value.trim()) {
    searchResults.value = [];
  }
}

const defaultImage = new URL('@/assets/producto_sinfoto.png', import.meta.url).href;

const sendToCart = async (product) => {
  console.log(product)
  store.commit('cart/setSelectedArticle', product)
  router.push({
    name: 'ProductoCliente',
  })
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  object-fit: cover;
  height: 200px;
}

.container {
  clear: both;
}

.btn-primary {
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: white;
  padding: 10px 20px;
  font-weight: 500;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline-secondary {
  border: 1px solid #6c757d;
  background-color: transparent;
  color: #6c757d;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #6c757d;
  color: white;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b8daff;
  color: #0c5460;
}

.alert-success {
  background-color: #d1e7dd;
  border-color: #badbcc;
  color: #0a3622;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-text.flex-grow-1 {
  flex: 1;
}

@media (max-width: 768px) {
  .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
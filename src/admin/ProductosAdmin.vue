<template>
  <div>
    <!-- Header principal -->
    <MainHeader />
    
    <div class="container-fluid px-4">
      <h1 class="text-center my-4">Gestión de Productos</h1>

      <!-- Botón para agregar producto -->
      <div class="card shadow-lg rounded-4 p-4 border-0 bg-light mb-4">
        <div class="d-flex justify-content-center">
          <button
            class="btn btn-primary btn-lg d-flex align-items-center gap-3"
            data-bs-toggle="modal"
            data-bs-target="#productModal"
            @click="openAddProductModal"
          >
            <i class="bi bi-plus-circle fs-4"></i>
            <span>Agregar Nuevo Producto</span>
          </button>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div class="card shadow-lg rounded-4 border-0">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-striped table-hover align-middle text-center mb-0">
              <thead>
                <tr>
                  <th class="text-center align-middle" style="width: 100px; background-color: #2563eb; color: white;">
                    <i class="bi bi-image"></i> Foto
                  </th>
                  <th class="align-middle" style="background-color: #2563eb; color: white;">
                    <i class="bi bi-tag"></i> Nombre
                  </th>
                  <th class="align-middle" style="background-color: #2563eb; color: white;">
                    <i class="bi bi-card-text"></i> Descripción
                  </th>
                  <th class="align-middle text-end" style="background-color: #2563eb; color: white;">
                    <i class="bi bi-currency-dollar"></i> Precio
                  </th>
                  <th class="align-middle text-end" style="background-color: #2563eb; color: white;">
                    <i class="bi bi-box"></i> Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="product in products" 
                  :key="product.id_articulo" 
                  :class="{ 'table-warning': product.cantidad === 0 }"
                >
                  <td>
                    <img 
                      v-if="product.imagen"
                      :src="product.imagen" 
                      alt="Foto del producto" 
                      class="rounded border border-secondary" 
                      style="width: 80px; height: 80px; object-fit: cover;"
                    />
                    <div v-else class="bg-light rounded d-flex align-items-center justify-content-center" 
                         style="width: 80px; height: 80px;">
                      <i class="bi bi-image text-muted fs-3"></i>
                    </div>
                  </td>
                  <td class="fw-bold">{{ product.nombre }}</td>
                  <td class="text-truncate" style="max-width: 200px;" :title="product.descripcion">
                    {{ product.descripcion }}
                  </td>
                  <td class="text-end">${{ product.precio?.toLocaleString() }}</td>
                  <td class="text-end">
                    <span class="badge" :class="product.cantidad === 0 ? 'bg-danger' : 'bg-success'">
                      {{ product.cantidad }} unids.
                    </span>
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="6" class="text-muted py-4">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    No hay productos registrados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer text-muted text-center">
          Total de productos: {{ products.length }}
        </div>
      </div>

      <!-- Modal para agregar/editar producto -->
      <div
        class="modal fade"
        id="productModal"
        tabindex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="productModalLabel">
                {{ currentProduct.id_articulo ? "Editar Producto" : "Agregar Producto" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form @submit.prevent="saveProduct">
              <div class="modal-body">
                <!-- Primera fila -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="nombre" class="form-label">Nombre del Producto</label>
                    <input
                      v-model="currentProduct.nombre"
                      type="text"
                      class="form-control"
                      id="nombre"
                      required
                      placeholder="Ej: Laptop Dell Inspiron"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="precio" class="form-label">Precio</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                        v-model.number="currentProduct.precio"
                        type="number"
                        step="0.01"
                        class="form-control"
                        id="precio"
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <!-- Segunda fila -->
                <div class="row mb-3">
                  <div class="col-md-12">
                    <label for="descripcion" class="form-label">Descripción</label>
                    <textarea
                      v-model="currentProduct.descripcion"
                      class="form-control"
                      id="descripcion"
                      rows="3"
                      required
                      placeholder="Describe las características del producto..."
                    ></textarea>
                  </div>
                </div>

                <!-- Tercera fila -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="cantidad" class="form-label">Cantidad en Stock</label>
                    <div class="input-group">
                      <input
                        v-model.number="currentProduct.cantidad"
                        type="number"
                        class="form-control"
                        id="cantidad"
                        required
                        min="0"
                        placeholder="0"
                      />
                      <span class="input-group-text">unidades</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="fotografia" class="form-label">Fotografía del Producto</label>
                    <input
                      type="file"
                      class="form-control"
                      id="fotografia"
                      accept="image/*"
                      @change="handleImageUpload"
                      ref="fileInput"
                    />
                  </div>
                </div>

                <!-- Preview de imagen -->
                <div v-if="imagePreview" class="row mb-3">
                  <div class="col-12 text-center">
                    <label class="form-label">Vista previa:</label>
                    <div>
                      <img 
                        :src="imagePreview" 
                        alt="Vista previa" 
                        class="img-thumbnail"
                        style="max-width: 200px; max-height: 200px;"
                      />
                      <br>
                      <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger mt-2"
                        @click="removeImage"
                      >
                        <i class="bi bi-trash"></i> Eliminar imagen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Guardando...' : 'Guardar Producto' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import MainHeader from "@/components/MainHeader.vue"
import axios from "axios"
import { toast } from "vue3-toastify"

const store = useStore()

// Estado
const products = ref([])
const isLoading = ref(false)
const imagePreview = ref(null)
const fileInput = ref(null)

// Obtener datos del usuario desde Vuex
const user = computed(() => store.state.users.user)
const tokenAccess = computed(() => store.state.users.tokenAccess)

// Producto actual para editar/agregar
const currentProduct = ref({
  id_articulo: null,
  nombre: '',
  descripcion: '',
  precio: 0,
  cantidad: 0,
  fotografia: null
})

// Cargar productos al montar el componente
onMounted(() => {
  fetchProducts()
})

// Función para obtener todos los productos
const fetchProducts = async () => {
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
    console.error('Error al cargar productos:', error)
    if (error.response) {
      let messageError = error.response.data.message || 'Error al cargar productos'
      toast(messageError, {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      })
    }
  }
}

// Abrir modal para agregar producto
const openAddProductModal = () => {
  currentProduct.value = {
    id_articulo: null,
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    fotografia: null
  }
  imagePreview.value = null
  
  // Limpiar el input de archivo
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Manejar subida de imagen
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast('Por favor selecciona un archivo de imagen válido', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      })
      return
    }
    
    // Validar tamaño de archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast('La imagen no puede ser mayor a 5MB', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      })
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target.result.split(',')[1] // Remover el prefijo data:image/...;base64,
      currentProduct.value.fotografia = base64String
      imagePreview.value = e.target.result
    }
    reader.onerror = () => {
      toast('Error al leer el archivo de imagen', {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      })
    }
    reader.readAsDataURL(file)
  }
}

// Función para eliminar la imagen
const removeImage = () => {
  currentProduct.value.fotografia = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Guardar producto
const saveProduct = async () => {
  if (!user.value || !tokenAccess.value) {
    toast('Debes iniciar sesión para realizar esta acción', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "error",
      theme: "colored",
    })
    return
  }

  // Validaciones adicionales
  if (!currentProduct.value.nombre.trim()) {
    toast('El nombre del producto es requerido', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "error",
      theme: "colored",
    })
    return
  }

  if (!currentProduct.value.descripcion.trim()) {
    toast('La descripción del producto es requerida', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "error",
      theme: "colored",
    })
    return
  }

  if (currentProduct.value.precio <= 0) {
    toast('El precio debe ser mayor a 0', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "error",
      theme: "colored",
    })
    return
  }

  if (currentProduct.value.cantidad < 0) {
    toast('La cantidad no puede ser negativa', {
      hideProgressBar: true,
      autoClose: 1500,
      type: "error",
      theme: "colored",
    })
    return
  }

  isLoading.value = true
  
  try {
    // Preparar el objeto para enviar al backend
    // Enviamos la fotografia como string base64, el backend se encarga de convertirla a byte[]
    const articuloData = {
      articulo: {
        id_articulo: currentProduct.value.id_articulo,
        nombre: currentProduct.value.nombre.trim(),
        descripcion: currentProduct.value.descripcion.trim(),
        precio: parseFloat(currentProduct.value.precio),
        cantidad: parseInt(currentProduct.value.cantidad),
        fotografia: currentProduct.value.fotografia, // Enviamos como string base64
        id_usuario: user.value.id_usuario,
        token: tokenAccess.value
      }
    }

    console.log('Enviando datos al backend:', {
      ...articuloData,
      articulo: {
        ...articuloData.articulo,
        fotografia: articuloData.articulo.fotografia ? '[BASE64_STRING]' : null
      }
    })

    const response = await axios.post('/alta_articulo', articuloData)
    
    if (response.status === 200) {
      const successMessage = currentProduct.value.id_articulo 
        ? "Producto actualizado correctamente" 
        : "Producto guardado correctamente"
      
      toast(successMessage, {
        hideProgressBar: true,
        autoClose: 1500,
        type: "success",
        theme: "colored",
      })

      await fetchProducts()
      
      // Cerrar modal
      const modal = document.getElementById('productModal')
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      
    }
    
  } catch (error) {
    console.error('Error al guardar producto:', error)
    if (error.response) {
      let messageError = error.response.data.message || 'Error al guardar el producto'
      toast(messageError, {
        hideProgressBar: true,
        autoClose: 1500,
        type: "error",
        theme: "colored",
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.container-fluid {
  max-width: 1400px;
}

.table th {
  font-weight: 500;
  border: none;
}

.table td {
  vertical-align: middle;
  border-color: #e9ecef;
}

.btn-group {
  gap: 0.5rem;
}

.modal-lg {
  max-width: 800px;
}

.badge {
  min-width: 70px;
  padding: 0.5em 0.8em;
}

.card {
  border: none !important;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
}

.btn-primary {
  background-color: #2563eb;
  border-color: #2563eb;
}

.btn-primary:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.table-warning {
  background-color: #fff3cd;
}

.img-thumbnail {
  border: 2px solid #dee2e6;
}
</style>
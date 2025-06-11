<template>
  <div>
    <MainHeader />
    <div class="products-container">
      <div class="container py-4">
        <!-- Barra de búsqueda -->
        <div class="search-section mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
              <div class="search-wrapper">
                <div class="search-input-group">
                  <div class="search-icon">
                    <i class="fas fa-search"></i>
                  </div>
                  <input
                    type="text"
                    v-model="searchQuery"
                    class="search-input"
                    placeholder="Buscar productos por nombre o descripción..."
                    @input="filterProducts"
                  />
                  <button
                    v-if="searchQuery"
                    @click="clearSearch"
                    class="clear-search-btn"
                    type="button"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultados de búsqueda -->
          <div v-if="searchQuery" class="search-results-info text-center mt-3">
            <small class="text-muted">
              <i class="fas fa-info-circle me-1"></i>
              {{ filteredProducts.length }} producto(s) encontrado(s) para "{{
                searchQuery
              }}"
            </small>
          </div>
        </div>

        <!-- Contenido principal -->
        <main>
          <!-- Sin productos (cuando no hay productos en general) -->
          <div
            v-if="products.length === 0"
            class="empty-state text-center py-5"
          >
            <div class="empty-icon mb-3">
              <i class="fas fa-box-open"></i>
            </div>
            <h3 class="empty-title">No hay productos disponibles</h3>
            <div class="empty-image">
              <img src="../assets/pctriste.png" alt="Sin productos" />
            </div>
            <p class="empty-description">Por favor, verifica más tarde.</p>
          </div>

          <!-- Sin resultados de búsqueda -->
          <div
            v-else-if="searchQuery && filteredProducts.length === 0"
            class="no-results text-center py-5"
          >
            <div class="no-results-icon mb-3">
              <i class="fas fa-search-minus"></i>
            </div>
            <h3 class="no-results-title">No se encontraron productos</h3>
            <p class="no-results-description">
              No hay productos que coincidan con "{{ searchQuery }}"
            </p>
            <button @click="clearSearch" class="btn btn-outline-primary">
              <i class="fas fa-times me-2"></i>
              Limpiar búsqueda
            </button>
          </div>

          <!-- Grid de productos -->
          <div v-else class="products-grid">
            <div class="row g-4">
              <div
                v-for="(product, index) in filteredProducts"
                :key="index"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div class="product-card">
                  <!-- Badge de disponibilidad -->
                  <div class="product-badge">
                    <span v-if="product.stock > 0" class="badge-available">
                      <i class="fas fa-check-circle me-1"></i>
                      Disponible
                    </span>
                    <span v-else class="badge-unavailable">
                      <i class="fas fa-times-circle me-1"></i>
                      Sin stock
                    </span>
                  </div>

                  <!-- Imagen del producto -->
                  <div class="product-image-wrapper">
                    <img
                      :src="product.imagenUrl"
                      class="product-image"
                      :alt="product.nombreProducto"
                      @error="handleImageError"
                    />
                    <div class="image-overlay">
                      <button
                        class="quick-view-btn"
                        @click="sendToCart(product)"
                      >
                        <i class="fas fa-eye me-2"></i>
                        Ver detalles
                      </button>
                    </div>
                  </div>

                  <!-- Contenido del card -->
                  <div class="product-content">
                    <div class="product-header">
                      <h5 class="product-title">
                        {{ product.nombreProducto }}
                      </h5>

                      <!-- Descripción del producto -->
                      <div class="product-description">
                        <p>
                          {{ truncateDescription(product.descripcionProducto) }}
                        </p>
                      </div>

                      <!-- Información del proveedor -->
                      <div class="product-supplier">
                        <div class="supplier-info">
                          <i class="fas fa-store me-2"></i>
                          <span class="supplier-label">Proveedor:</span>
                          <span class="supplier-name">{{
                            product.proveedor.nombreProveedor
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="product-footer">
                      <div class="product-price">
                        <span class="price-label">Precio:</span>
                        <div class="price-value">
                          <span class="price-symbol">$</span>
                          <span class="price-amount">{{
                            formatPrice(product.precioUnitario)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
import { useRouter } from "vue-router";

const products = ref([]);
const searchQuery = ref("");
const router = useRouter();

// Computed para productos filtrados
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value;
  }

  const query = searchQuery.value.toLowerCase();
  return products.value.filter((product) => {
    const name = product.nombreProducto?.toLowerCase() || "";
    const description = product.descripcionProducto?.toLowerCase() || "";
    const supplier = product.proveedor?.nombreProveedor?.toLowerCase() || "";

    return (
      name.includes(query) ||
      description.includes(query) ||
      supplier.includes(query)
    );
  });
});

const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/v1/productos/activos");
    products.value = response.data;
  } catch (error) {
    if (error.response) {
      let messageError =
        error.response.data.message || "Error al cargar productos";
      toast(messageError, {
        hideProgressBar: true,
        autoClose: 3000,
        type: "error",
        theme: "colored",
      });
    }
  }
};

const sendToCart = (product) => {
  router.push({
    name: "ProductoCliente",
    query: { id: product.idProducto },
  });
};

const filterProducts = () => {
  // La función está implícita en el computed filteredProducts
  // Este método se mantiene para consistencia pero la lógica está en computed
};

const clearSearch = () => {
  searchQuery.value = "";
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const truncateDescription = (description) => {
  if (!description) return "Sin descripción disponible";
  return description.length > 80
    ? description.substring(0, 80) + "..."
    : description;
};

const handleImageError = (event) => {
  event.target.src = "/placeholder-product.jpg"; // Imagen por defecto
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* Importar Font Awesome */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

/* Variables */
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
  --card-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  --transition: all 0.3s ease;
}

.products-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 80px);
}

/* Barra de búsqueda */
.search-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
}

.search-wrapper {
  position: relative;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 50px;
  padding: 0.5rem;
  transition: var(--transition);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.search-input-group:focus-within {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 4px rgba(var(--bs-primary-rgb), 0.1);
  transform: translateY(-2px);
}

.search-icon {
  color: var(--bs-primary);
  padding: 0 1rem;
  font-size: 1.1rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  background: transparent;
  color: var(--bs-dark);
}

.search-input::placeholder {
  color: var(--bs-secondary);
}

.clear-search-btn {
  background: var(--bs-secondary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  transition: var(--transition);
  cursor: pointer;
}

.clear-search-btn:hover {
  background: var(--bs-dark);
  transform: scale(1.1);
}

.search-results-info {
  background: rgba(var(--bs-primary-rgb), 0.1);
  border-radius: 10px;
  padding: 0.75rem;
  color: var(--bs-primary);
  font-weight: 500;
}

/* Estados vacíos */
.empty-state,
.no-results {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: var(--card-shadow);
}

.empty-icon,
.no-results-icon {
  font-size: 4rem;
  color: var(--bs-secondary);
  margin-bottom: 1rem;
}

.empty-title,
.no-results-title {
  color: var(--bs-dark);
  font-weight: 600;
  margin-bottom: 1rem;
}

.empty-description,
.no-results-description {
  color: var(--bs-secondary);
  font-size: 1.1rem;
}

.empty-image img {
  max-width: 300px;
  height: auto;
  margin: 1rem 0;
}

/* Grid de productos */
.products-grid {
  animation: fadeInUp 0.6s ease-out;
}

/* Cards de productos */
.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  transition: var(--transition);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
}

/* Badge de disponibilidad */
.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

.badge-available {
  background: linear-gradient(135deg, var(--bs-success) 0%, #157347 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 0.25rem 0.5rem rgba(25, 135, 84, 0.3);
}

.badge-unavailable {
  background: linear-gradient(135deg, var(--bs-danger) 0%, #b02a37 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 0.25rem 0.5rem rgba(220, 53, 69, 0.3);
}

/* Imagen del producto */
.product-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: var(--bs-light);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: white;
  color: var(--bs-primary);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: var(--transition);
  cursor: pointer;
}

.quick-view-btn:hover {
  background: var(--bs-primary);
  color: white;
  transform: scale(1.05);
}

/* Contenido del card */
.product-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 240px;
}

.product-header {
  flex: 1;
  margin-bottom: 0.3rem;
}

.product-title {
  color: var(--bs-dark);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  margin-bottom: 1rem;
}

.product-description p {
  color: var(--bs-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-supplier {
  margin-bottom: 1rem;
}

.supplier-info {
  background: rgba(var(--bs-primary-rgb), 0.1);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0; /* Permite que los elementos flex se encojan */
}

.supplier-info i {
  color: var(--bs-primary);
  font-size: 0.9rem;
  flex-shrink: 0; /* Evita que el icono se encoja */
}

.supplier-label {
  color: var(--bs-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  flex-shrink: 0; /* Evita que la etiqueta se encoja */
}

.supplier-name {
  color: var(--bs-dark);
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0; /* Permite que se encoja cuando sea necesario */
}

.product-footer {
  margin-top: auto;
  border-top: 1px solid #f1f3f4;
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label {
  color: var(--bs-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  color: var(--bs-primary);
  font-weight: 700;
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 1rem;
  margin-right: 0.25rem;
}

.price-amount {
  font-size: 1.5rem;
}

/* Responsividad */
@media (max-width: 767.98px) {
  .search-section {
    padding: 1.5rem;
    margin: 0 1rem;
  }

  .product-card {
    margin: 0 0.5rem;
  }

  .product-content {
    padding: 1rem;
  }

  .product-footer {
    padding-top: 0.75rem;
  }

  .search-input {
    font-size: 0.9rem;
  }
}

@media (max-width: 575.98px) {
  .container {
    padding: 1rem;
  }

  .search-section {
    margin: 0;
    border-radius: 15px;
  }

  .product-image-wrapper {
    height: 180px;
  }

  .product-title {
    font-size: 1rem;
  }

  .price-amount {
    font-size: 1.25rem;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mejoras de accesibilidad */
.quick-view-btn:focus-visible,
.clear-search-btn:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.search-input:focus-visible {
  outline: none;
}
</style>

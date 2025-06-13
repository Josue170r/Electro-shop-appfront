<template>
  <div>
    <div v-if="reviews && reviews.length > 0" class="row">
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="col-12 col-md-6 col-lg-4 mb-4"
      >
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ review.name }}</h5>
            <p class="card-text text-muted">
              <i>{{ new Date(review.date).toLocaleDateString("es-MX") }}</i>
            </p>
            <p class="card-text">{{ review.comment }}</p>
            <div class="d-flex align-items-center">
              <span class="me-2">Puntuación:</span>
              <span class="badge bg-warning text-dark"
                >{{ review.rating }} / 5</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted">
      <p>Este producto no tiene reseñas.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "ResenasProducto",
  props: {
    productId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const reviews = ref(null);

    // Simulación de llamada al backend
    const loadReviews = async () => {
      try {
        // Aquí harías una llamada a tu backend con el ID del producto
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simula un retraso
        // Mock de datos de reseñas
        reviews.value = [
          {
            name: "Juan Pérez",
            comment: "Excelente producto, lo recomiendo ampliamente.",
            date: "2025-01-10",
            rating: 5,
          },
          {
            name: "Ana Gómez",
            comment: "La calidad es buena, pero llegó tarde.",
            date: "2025-01-08",
            rating: 3,
          },
          {
            name: "Carlos López",
            comment: "Cumple con lo prometido, aunque podría ser mejor.",
            date: "2025-01-07",
            rating: 4,
          },
        ];
      } catch (error) {
        console.error("Error al cargar las reseñas:", error);
      }
    };

    onMounted(loadReviews);

    return {
      reviews,
    };
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>

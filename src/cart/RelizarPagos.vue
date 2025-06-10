<template>
  <div class="container mt-4">
    <MainHeader/>
    <h2 class="d-flex align-items-center justify-content-between mb-4">
      Finalizar la compra de manera segura
      <img src="../assets/logoElectroShop.png" alt="Seguridad" style="max-height: 150px;" />
    </h2>

    <!-- Información de envío -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="mb-3 d-flex align-items-center">
          <CarIcon class="me-2" />
          <h5 class="card-title mb-0">Datos del envío</h5>
        </div>
        <p>
          Enviar a: <strong>{{ user.nombre }}</strong> <strong>{{ user.apellidos }}</strong><br />
          {{ formatAddres() }}
        </p>
      </div>
    </div>

    <!-- Métodos de pago -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="mb-3 d-flex align-items-center">
          <WalletCardsIcon class="me-2" />
          <h5 class="card-title mb-0">Pagar con tarjeta de crédito o débito</h5>
        </div>
        <!-- Mis tarjetas -->
        <div class="mb-3">
          <h6>Mis tarjetas</h6>
          <form @submit.prevent="agregarTarjeta" class="mb-3">
            <div class="row g-3">
              <div class="col-md-6 position-relative">
                <label for="numeroTarjeta" class="form-label">Número de tarjeta</label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  v-model="nuevaTarjeta.numero"
                  class="form-control pe-5"
                  placeholder="---- ---- ---- ----"
                  required
                />
                <div
                  class="card-icons position-absolute mt-2"
                  style="right: 10px; top: 50%; transform: translateY(-50%);"
                >
                  <img src="../assets/visa.png" alt="Visa" style="width: 30px; margin-right: 5px;" />
                  <img src="../assets/mastercard.png" alt="MasterCard" style="width: 30px;" />
                </div>
              </div>

              <div class="col-md-3">
                <label for="fechaVencimiento" class="form-label">Fecha de vencimiento</label>
                <input
                  type="text"
                  id="fechaVencimiento"
                  v-model="nuevaTarjeta.fechaVencimiento"
                  class="form-control"
                  placeholder="MM/AA"
                  required
                />
              </div>
              <div class="col-md-3">
                <label for="codigoSeguridad" class="form-label">CVC</label>
                <input
                  type="text"
                  id="codigoSeguridad"
                  v-model="nuevaTarjeta.cvc"
                  class="form-control"
                  placeholder="CVC"
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Resumen del pedido -->
    <div class="card">
      <div class="card-body">
        <div class="mb-3 d-flex align-items-center">
          <LucideDollarSign class="me-2" />
          <h5 class="card-title">Resumen del pedido</h5>
        </div>
        <p>Total (IVA incluido): <strong>{{ subTotal }}</strong></p>

        <!-- País o región -->
        <div class="mb-3">
          <label for="pais" class="form-label">Selecciona tu país o región</label>
          <select id="pais" v-model="paisSeleccionado" class="form-select" required>
            <option disabled value="">Selecciona un país</option>
            <option v-for="pais in paises" :key="pais" :value="pais">
              {{ pais }}
            </option>
          </select>
        </div>

        <!-- Checkboxes -->
        <div class="form-check mb-2">
          <input
            type="checkbox"
            id="aceptaTerminos"
            v-model="aceptaTerminos"
            class="form-check-input"
            required
          />
          <label for="aceptaTerminos" class="form-check-label">
            Acepto los términos y condiciones
          </label>
        </div>
        <div class="form-check mb-3">
          <input
            type="checkbox"
            id="esMayorDeEdad"
            v-model="esMayorDeEdad"
            class="form-check-input"
            required
          />
          <label for="esMayorDeEdad" class="form-check-label">
            Confirmo que soy mayor de edad
          </label>
        </div>

        <!-- Botón para confirmar pago y dirección -->
        <button
          @click="createOrder"
          :disabled="!aceptaTerminos || !esMayorDeEdad || !paisSeleccionado"
          class="btn btn-outline-success w-100"
        >
          Confirmar pago y dirección de envío
        </button>

        <!-- Modal de confirmación -->
        <div
          class="modal fade"
          id="confirmationModal"
          tabindex="-1"
          aria-labelledby="confirmationModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="confirmationModalLabel">¡Pedido confirmado!</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body text-center">
                <div class="check-icon">
                  <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                </div>
                <p class="mt-3 fw-bold text-success">¡Se confirmó tu pedido! Espéralo muy pronto.</p>
              </div>
              <div class="modal-footer">
                <router-link to="/perfil-usuario" class="w-100 mt-4">
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                  >
                    Cerrar
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar dirección -->
    <div
      class="modal fade"
      id="changeAddressModal"
      tabindex="-1"
      aria-labelledby="changeAddressModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="changeAddressModalLabel">Cambiar dirección</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-outline-success"
              data-bs-dismiss="modal"
            >
              Cambiar
            </button>
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
export default {
  name: "Relizarpagos",
  components: {
    WalletCardsIcon,
    CarIcon,
    LucideDollarSign,
    LucideInfo,
    MainHeader,
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
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userInfo"));
    this.subTotal = this.$route.query.subTotal
  },
  methods: {
    formatAddres()  {
      if (!this.user || !this.user.calle || !this.user.colonia || !this.user.numero || !this.user.codigoPostal) {
        return "Dirección incompleta";
      }
      return `${this.user.calle} ${this.user.numero}, ${this.user.colonia}, CP ${this.user.codigoPostal}`;
    },
    changeAddress() {
      const modalElement = document.getElementById("changeAddressModal");
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    },
    showModal() {
      const modalElement = document.getElementById("confirmationModal");
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
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
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes comienza desde 0
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const data = {
        precioTotal: this.subTotal,
        fechaCompra: formattedDate,
        tipodePago: 'Tarjeta de crédito',
        estatusPedido: 'Preparando',
      }
      try {
        const response = await axios.post('/api/v1/pedidos/', data, {
          params: { idCliente: this.user.idCliente }
        });
        console.log(response)
        this.showModal();
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
  },
};
</script>

<style scoped>
.card-title {
  color: #111;
}

.check-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
button:disabled {
  cursor: no-drop !important;
  pointer-events: all !important;
}
</style>

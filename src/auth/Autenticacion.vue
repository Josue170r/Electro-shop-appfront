<template>
  <div class="verification-page">
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
      <div class="verification-container">
        <!-- Logo y Header -->
        <div class="header-section text-center mb-4">
          <div class="logo-wrapper mb-3">
            <img
              src="../assets/logoElectroShop.png"
              alt="ElectroShop Logo"
              class="logo"
            />
          </div>
          <h2 class="title">Verifica tu cuenta</h2>
          <p class="subtitle">
            Introduce el código de 6 dígitos enviado a tu correo electrónico
          </p>
        </div>

        <!-- Código de verificación -->
        <div class="code-section mb-4">
          <div class="code-container">
            <input
              v-for="(digit, index) in code"
              :key="index"
              type="text"
              class="code-digit"
              maxlength="1"
              v-model="code[index]"
              :ref="'input' + index"
              @input="handleInput(index)"
              @keydown.backspace="handleBackspace(index)"
              @paste="handlePaste"
            />
          </div>
        </div>

        <!-- Botones -->
        <div class="buttons-section">
          <button 
            class="btn btn-primary btn-validate" 
            @click="validateCode"
            :disabled="!isCodeComplete"
          >
            Verificar Código
          </button>
          
          <button 
            class="btn btn-link btn-resend" 
            @click="resendCode"
          >
            Reenviar código
          </button>
        </div>

        <!-- Info adicional -->
        <div class="info-text text-center">
          <small class="text-muted">
            ¿No recibiste el código? Revisa tu carpeta de spam
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify'

export default {
  data() {
    return {
      code: ["", "", "", "", "", ""],
      email: "",
    };
  },
  computed: {
    isCodeComplete() {
      return this.code.every(digit => digit !== "");
    }
  },
  created() {
    this.email = this.$route.query.email
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.input0?.[0]) {
        this.$refs.input0[0].focus();
      }
    });
  },
  methods: {
    handleInput(index) {
      // Solo números
      this.code[index] = this.code[index].replace(/[^0-9]/g, '');
      
      // Siguiente input
      if (this.code[index].length === 1 && index < this.code.length - 1) {
        this.$refs["input" + (index + 1)][0]?.focus();
      }
    },
    handleBackspace(index) {
      if (this.code[index] === "" && index > 0) {
        this.$refs["input" + (index - 1)][0]?.focus();
      }
    },
    handlePaste(e) {
      e.preventDefault();
      const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
      if (paste.length === 6) {
        for (let i = 0; i < 6; i++) {
          this.code[i] = paste[i] || '';
        }
      }
    },
    async validateCode() {
      const fullCode = this.code.join("");
      
      if (!this.isCodeComplete) {
        toast("Completa el código de 6 dígitos", {
          type: "warning",
          theme: "colored",
          autoClose: 2000
        });
        return;
      }

      try {
        const response = await axios.post('/api/v1/validate-token', {
          email: this.email,
          token: fullCode,
        });
        
        if (response) {
          toast("¡Cuenta verificada exitosamente!", {
            type: "success",
            theme: "colored",
            autoClose: 1500,
            onClose: () => {
              this.$router.push({ name: 'InicioSesion' });
            }
          });
        }
      } catch (error) {
        toast("Código incorrecto. Inténtalo nuevamente", {
          type: "error",
          theme: "colored",
          autoClose: 3000
        });
        
        // Limpiar y enfocar
        this.code = ["", "", "", "", "", ""];
        this.$nextTick(() => {
          this.$refs.input0?.[0]?.focus();
        });
      }
    },
    async resendCode() {
      try {
        const response = await axios.get('/api/v1/send-token', {
          params: { email: this.email },
        });
        
        if (response) {
          toast("Nuevo código enviado", {
            type: "success",
            theme: "colored",
            autoClose: 2000
          });
          
          this.code = ["", "", "", "", "", ""];
          this.$nextTick(() => {
            this.$refs.input0?.[0]?.focus();
          });
        }
      } catch (error) {
        toast("Error al enviar código", {
          type: "error",
          theme: "colored",
          autoClose: 3000
        });
      }
    },
  },
};
</script>

<style scoped>
.verification-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
}

.verification-container {
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  width: 100%;
  border: 1px solid #e9ecef;
}

.header-section {
  margin-bottom: 32px;
}

.logo-wrapper {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: inline-block;
}

.logo {
  max-width: 200px;
  height: auto;
}

.title {
  color: #212529;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #6c757d;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.code-section {
  margin-bottom: 32px;
}

.code-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.code-digit {
  width: 56px;
  height: 56px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  background: white;
  transition: all 0.2s ease;
  outline: none;
}

.code-digit:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.code-digit:not(:placeholder-shown) {
  border-color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.02);
}

.buttons-section {
  text-align: center;
  margin-bottom: 24px;
}

.btn-validate {
  background-color: #0d6efd;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.btn-validate:hover:not(:disabled) {
  background-color: #0b5ed7;
  transform: translateY(-1px);
}

.btn-validate:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-resend {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
  border: none;
  background: none;
  padding: 8px 16px;
}

.btn-resend:hover {
  color: #0b5ed7;
  text-decoration: underline;
}

.info-text {
  margin-top: 16px;
}

/* Responsividad */
@media (max-width: 576px) {
  .verification-container {
    padding: 32px 24px;
    margin: 10px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .code-digit {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
  
  .code-container {
    gap: 8px;
  }
  
  .logo {
    max-width: 160px;
  }
}

@media (max-width: 400px) {
  .code-digit {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .code-container {
    gap: 6px;
  }
}
</style>
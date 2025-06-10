// Importa los estilos de tu proyecto y Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // CSS de Bootstrap
import 'bootstrap'; // JavaScript de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue3-toastify/dist/index.css';
// import '@fortawesome/fontawesome-free/css/all.min.css'; // Estilos de Font Awesome
// Importa Vue y las configuraciones de tu proyecto
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins'; // Esto usa el export default de plugins/index.js

import 'bootstrap/dist/css/bootstrap.min.css'; // CSS de Bootstrap
import 'bootstrap'; // JavaScript de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app');

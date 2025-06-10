import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8080/Servicio/rest/ws";
axios.defaults.timeout = 5000;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export default axios;
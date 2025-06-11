import axios from 'axios';

axios.defaults.baseURL = "https://electro-shop-kl4nw.ondigitalocean.app";
axios.defaults.timeout = 5000;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export default axios;
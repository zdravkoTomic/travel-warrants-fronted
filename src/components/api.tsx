import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/travel-warrants/public/api',
});

export default api;
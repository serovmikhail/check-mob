import axios from 'axios';
import { getToken } from './store/tokenStore';

export const API_URL = 'http://192.168.0.107:5000';

const $api = axios.create({ baseURL: API_URL });

$api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default $api

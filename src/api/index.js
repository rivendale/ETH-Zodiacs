import axios from 'axios';
import config from '../config';

export const client = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

const api = ({ method, url, data }) => client({
  url,
  method,
  data,
});

export default api

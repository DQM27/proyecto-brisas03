import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Usa la URL del backend
  withCredentials: true, // Para leer refresh_token en cookie
});

export default instance;

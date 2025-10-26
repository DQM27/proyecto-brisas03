import axios, { AxiosError } from "axios";

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tipos de datos (ejemplos)
export interface Contratista {
  id: number;
  nombre: string;
  // agrega más campos según tu backend
}

export interface Vehiculo {
  id: number;
  placa: string;
  // agrega más campos según tu backend
}

export interface IngresoPayload {
  contratistaId: number;
  vehiculoId: number;
  fecha: string;
  // otros campos que envíes al backend
}

// Función para obtener contratistas según búsqueda
export const getContratistas = async (query: string): Promise<Contratista[]> => {
  try {
    const { data } = await api.get<Contratista[]>(`/contratistas`, { params: { query } });
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching contratistas:", error.message);
    } else {
      console.error("Error inesperado fetching contratistas:", error);
    }
    return [];
  }
};

// Función para obtener vehículos de un contratista
export const getVehiculos = async (contratistaId: number): Promise<Vehiculo[]> => {
  try {
    const { data } = await api.get<Vehiculo[]>(`/contratistas/${contratistaId}/vehiculos`);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching vehículos:", error.message);
    } else {
      console.error("Error inesperado fetching vehículos:", error);
    }
    return [];
  }
};

// Función para registrar un ingreso
export const registrarIngreso = async (payload: IngresoPayload) => {
  try {
    const { data } = await api.post(`/ingresos`, payload);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error registrando ingreso:", error.message);
      throw error;
    } else {
      console.error("Error inesperado registrando ingreso:", error);
      throw error;
    }
  }
};

export default api;

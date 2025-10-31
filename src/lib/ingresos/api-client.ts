import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ErrorResponse, ErrorResponseSchema } from './ingresos.schemas';

/**
 * Cliente de Axios configurado para la API
 */
class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptores para manejo automático de errores y tokens
   */
  private setupInterceptors() {
    // Interceptor de Request: Agregar token de autenticación
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Si usas autenticación, agrega el token aquí
        const token = this.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de Response: Manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  /**
   * Obtiene el token de autenticación
   * Ajusta esto según tu sistema de autenticación
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // Para Next.js cliente
      return localStorage.getItem('auth_token');
    }
    // Para Next.js servidor (SSR)
    return null;
  }

  /**
   * Maneja errores de forma centralizada
   */
  private handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      // El servidor respondió con un código de error
      const errorData = error.response.data;
      
      try {
        // Intentar parsear el error con Zod
        const parsedError = ErrorResponseSchema.parse(errorData);
        
        // Puedes agregar lógica específica según el errorCode
        if (parsedError.errorCode === 'CONTRATISTA_LISTA_NEGRA') {
          console.error('❌ Contratista en lista negra');
        }
        
        return Promise.reject({
          ...parsedError,
          status: error.response.status,
        });
      } catch {
        // Si no se puede parsear, devolver el error original
        return Promise.reject({
          message: 'Error del servidor',
          statusCode: error.response.status,
        });
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return Promise.reject({
        message: 'No se recibió respuesta del servidor',
        errorCode: 'NETWORK_ERROR',
      });
    } else {
      // Error al configurar la petición
      return Promise.reject({
        message: error.message || 'Error desconocido',
        errorCode: 'REQUEST_ERROR',
      });
    }
  }

  /**
   * Métodos HTTP básicos con tipado
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    const response = await this.client.post<T>(url, data, { params });
    return response.data;
  }

  async patch<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    const response = await this.client.patch<T>(url, data, { params });
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  /**
   * Permite acceso directo al cliente de Axios para casos especiales
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

/**
 * Instancia singleton del cliente API
 * Ajusta la baseURL según tu configuración
 */
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
);

export default apiClient;
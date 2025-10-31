import { apiClient } from './api-client';
import {
  CreateIngresoDto,
  CreateIngresoSchema,
  UpdateIngresoDto,
  UpdateIngresoSchema,
  ResponseIngreso,
  ResponseIngresoSchema,
  PaginatedIngresos,
  PaginatedIngresosSchema,
  EstadoDevolucionGafete,
} from './ingresos.schemas';

/**
 * Servicio para interactuar con el módulo de ingresos del backend
 */
class IngresosService {
  private readonly basePath = '/ingresos';

  /**
   * Registra el ingreso de un contratista
   * 
   * @param dto - Datos del ingreso a registrar
   * @param usuarioId - ID del usuario que registra el ingreso
   * @returns Ingreso registrado
   * @throws Error con mensaje específico según el tipo de validación fallida
   */
  async registrarIngreso(
    dto: CreateIngresoDto,
    usuarioId: number
  ): Promise<ResponseIngreso> {
    // Validar DTO con Zod antes de enviar
    const validatedDto = CreateIngresoSchema.parse(dto);

    const response = await apiClient.post<ResponseIngreso>(
      this.basePath,
      validatedDto,
      { usuarioId }
    );

    // Validar respuesta del servidor
    return ResponseIngresoSchema.parse(response);
  }

  /**
   * Registra la salida de un contratista
   * 
   * @param contratistaId - ID del contratista que sale
   * @param usuarioId - ID del usuario que registra la salida
   * @param estadoGafete - Estado del gafete al ser devuelto (opcional)
   * @returns Ingreso actualizado con la salida registrada
   */
  async registrarSalida(
    contratistaId: number,
    usuarioId: number,
    estadoGafete?: EstadoDevolucionGafete
  ): Promise<ResponseIngreso> {
    const params: Record<string, any> = { usuarioId };
    
    if (estadoGafete) {
      params.gafeteEstado = estadoGafete;
    }

    const response = await apiClient.patch<ResponseIngreso>(
      `${this.basePath}/${contratistaId}/salida`,
      {},
      params
    );

    return ResponseIngresoSchema.parse(response);
  }

  /**
   * Lista todos los ingresos con paginación
   * 
   * @param page - Número de página (por defecto: 1)
   * @param limit - Registros por página (por defecto: 50)
   * @returns Lista paginada de ingresos
   */
  async listarIngresos(
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedIngresos> {
    const response = await apiClient.get<PaginatedIngresos>(
      this.basePath,
      { page, limit }
    );

    return PaginatedIngresosSchema.parse(response);
  }

  /**
   * Obtiene un ingreso específico por su ID
   * 
   * @param id - ID del ingreso
   * @returns Datos completos del ingreso
   */
  async obtenerIngreso(id: number): Promise<ResponseIngreso> {
    const response = await apiClient.get<ResponseIngreso>(
      `${this.basePath}/${id}`
    );

    return ResponseIngresoSchema.parse(response);
  }

  /**
   * Actualiza un ingreso existente
   * 
   * @param id - ID del ingreso a actualizar
   * @param dto - Datos a actualizar (solo observaciones y tipoAutorizacion)
   * @returns Ingreso actualizado
   */
  async actualizarIngreso(
    id: number,
    dto: UpdateIngresoDto
  ): Promise<ResponseIngreso> {
    const validatedDto = UpdateIngresoSchema.parse(dto);

    const response = await apiClient.patch<ResponseIngreso>(
      `${this.basePath}/${id}`,
      validatedDto
    );

    return ResponseIngresoSchema.parse(response);
  }

  /**
   * Obtiene la duración de un ingreso
   * 
   * @deprecated Usar el campo `duracion` en la respuesta del ingreso
   * @param id - ID del ingreso
   * @returns Duración en formato legible
   */
  async calcularDuracion(id: number): Promise<string> {
    const response = await apiClient.get<{ duracion: string }>(
      `${this.basePath}/${id}/duracion`
    );

    return response.duracion;
  }

  /**
   * Obtiene solo los ingresos activos (contratistas dentro)
   * 
   * @param page - Número de página
   * @param limit - Registros por página
   * @returns Lista paginada de ingresos activos
   */
  async listarIngresosActivos(
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedIngresos> {
    const result = await this.listarIngresos(page, limit);
    
    // Filtrar solo los activos
    const ingresosActivos = result.data.filter(ingreso => ingreso.dentroFuera);
    
    return {
      ...result,
      data: ingresosActivos,
      total: ingresosActivos.length,
    };
  }

  /**
   * Obtiene el ingreso activo de un contratista específico
   * 
   * @param contratistaId - ID del contratista
   * @returns Ingreso activo o null si no tiene
   */
  async obtenerIngresoActivoContratista(
    contratistaId: number
  ): Promise<ResponseIngreso | null> {
    try {
      // Buscar en la primera página de ingresos activos
      const ingresos = await this.listarIngresosActivos(1, 100);
      
      const ingresoActivo = ingresos.data.find(
        ingreso => ingreso.contratista.id === contratistaId && ingreso.dentroFuera
      );

      return ingresoActivo || null;
    } catch (error) {
      console.error('Error al buscar ingreso activo:', error);
      return null;
    }
  }
}

/**
 * Instancia singleton del servicio de ingresos
 */
export const ingresosService = new IngresosService();

export default ingresosService;
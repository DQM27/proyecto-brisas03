import { useState, useCallback } from 'react';
import { ingresosService } from './ingresos.service';
import {
  CreateIngresoDto,
  UpdateIngresoDto,
  ResponseIngreso,
  PaginatedIngresos,
  EstadoDevolucionGafete,
  ErrorResponse,
} from './ingresos.schemas';
import { ZodError } from 'zod';

/**
 * Estado de la operación
 */
interface OperationState {
  loading: boolean;
  error: ErrorResponse | null;
  success: boolean;
}

/**
 * Hook para registrar ingresos
 */
export function useRegistrarIngreso() {
  const [state, setState] = useState<OperationState>({
    loading: false,
    error: null,
    success: false,
  });

  const registrar = useCallback(
    async (dto: CreateIngresoDto, usuarioId: number): Promise<ResponseIngreso | null> => {
      setState({ loading: true, error: null, success: false });

      try {
        const ingreso = await ingresosService.registrarIngreso(dto, usuarioId);
        setState({ loading: false, error: null, success: true });
        return ingreso;
      } catch (error: any) {
        const errorMessage = error.message || 'Error al registrar ingreso';
        setState({ 
          loading: false, 
          error: { message: errorMessage, errorCode: error.errorCode }, 
          success: false 
        });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { ...state, registrar, reset };
}

/**
 * Hook para registrar salidas
 */
export function useRegistrarSalida() {
  const [state, setState] = useState<OperationState>({
    loading: false,
    error: null,
    success: false,
  });

  const registrarSalida = useCallback(
    async (
      contratistaId: number,
      usuarioId: number,
      estadoGafete?: EstadoDevolucionGafete
    ): Promise<ResponseIngreso | null> => {
      setState({ loading: true, error: null, success: false });

      try {
        const ingreso = await ingresosService.registrarSalida(
          contratistaId,
          usuarioId,
          estadoGafete
        );
        setState({ loading: false, error: null, success: true });
        return ingreso;
      } catch (error: any) {
        const errorMessage = error.message || 'Error al registrar salida';
        setState({ 
          loading: false, 
          error: { message: errorMessage, errorCode: error.errorCode }, 
          success: false 
        });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { ...state, registrarSalida, reset };
}

/**
 * Hook para listar ingresos con paginación
 */
export function useListarIngresos(initialPage: number = 1, initialLimit: number = 50) {
  const [state, setState] = useState<{
    data: PaginatedIngresos | null;
    loading: boolean;
    error: ErrorResponse | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const cargar = useCallback(
    async (newPage?: number, newLimit?: number) => {
      const currentPage = newPage ?? page;
      const currentLimit = newLimit ?? limit;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const data = await ingresosService.listarIngresos(currentPage, currentLimit);
        setState({ data, loading: false, error: null });
        
        if (newPage !== undefined) setPage(newPage);
        if (newLimit !== undefined) setLimit(newLimit);
      } catch (error: any) {
        setState({ 
          data: null, 
          loading: false, 
          error: { message: error.message || 'Error al cargar ingresos' } 
        });
      }
    },
    [page, limit]
  );

  const siguientePagina = useCallback(() => {
    if (state.data && page < state.data.totalPages) {
      cargar(page + 1);
    }
  }, [state.data, page, cargar]);

  const paginaAnterior = useCallback(() => {
    if (page > 1) {
      cargar(page - 1);
    }
  }, [page, cargar]);

  const irAPagina = useCallback((newPage: number) => {
    if (state.data && newPage >= 1 && newPage <= state.data.totalPages) {
      cargar(newPage);
    }
  }, [state.data, cargar]);

  return {
    ...state,
    page,
    limit,
    cargar,
    siguientePagina,
    paginaAnterior,
    irAPagina,
    setLimit: (newLimit: number) => cargar(page, newLimit),
  };
}

/**
 * Hook para obtener un ingreso específico
 */
export function useObtenerIngreso(id: number | null) {
  const [state, setState] = useState<{
    data: ResponseIngreso | null;
    loading: boolean;
    error: ErrorResponse | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const cargar = useCallback(async () => {
    if (!id) return;

    setState({ data: null, loading: true, error: null });

    try {
      const ingreso = await ingresosService.obtenerIngreso(id);
      setState({ data: ingreso, loading: false, error: null });
    } catch (error: any) {
      setState({ 
        data: null, 
        loading: false, 
        error: { message: error.message || 'Error al cargar ingreso' } 
      });
    }
  }, [id]);

  return { ...state, cargar };
}

/**
 * Hook para actualizar un ingreso
 */
export function useActualizarIngreso() {
  const [state, setState] = useState<OperationState>({
    loading: false,
    error: null,
    success: false,
  });

  const actualizar = useCallback(
    async (id: number, dto: UpdateIngresoDto): Promise<ResponseIngreso | null> => {
      setState({ loading: true, error: null, success: false });

      try {
        const ingreso = await ingresosService.actualizarIngreso(id, dto);
        setState({ loading: false, error: null, success: true });
        return ingreso;
      } catch (error: any) {
        const errorMessage = error.message || 'Error al actualizar ingreso';
        setState({ 
          loading: false, 
          error: { message: errorMessage }, 
          success: false 
        });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { ...state, actualizar, reset };
}

/**
 * Hook para obtener el ingreso activo de un contratista
 */
export function useIngresoActivoContratista(contratistaId: number | null) {
  const [state, setState] = useState<{
    data: ResponseIngreso | null;
    loading: boolean;
    error: ErrorResponse | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const cargar = useCallback(async () => {
    if (!contratistaId) return;

    setState({ data: null, loading: true, error: null });

    try {
      const ingreso = await ingresosService.obtenerIngresoActivoContratista(contratistaId);
      setState({ data: ingreso, loading: false, error: null });
    } catch (error: any) {
      setState({ 
        data: null, 
        loading: false, 
        error: { message: error.message } 
      });
    }
  }, [contratistaId]);

  return { ...state, cargar };
}
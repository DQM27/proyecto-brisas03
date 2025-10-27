import { create } from 'zustand';
import { z } from 'zod';
import * as ingresosApi from '@/src/app/api/ingresosApi';
import { createIngresoSchema, responseIngresoSchema } from '@/src/app/schemas/ingresos.schema';

// Tipos inferidos desde los schemas de Zod
export type Ingreso = z.infer<typeof responseIngresoSchema>;
export type CreateIngresoDto = z.infer<typeof createIngresoSchema>;

interface IngresosState {
  ingresos: Ingreso[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchIngresosActivos: () => Promise<void>;
  registrarIngreso: (dto: CreateIngresoDto) => Promise<Ingreso>;
  registrarSalida: (contratistaId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useIngresosStore = create<IngresosState>((set) => ({
  ingresos: [],
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  // Obtener todos los ingresos activos (sin fecha de salida)
  fetchIngresosActivos: async () => {
    try {
      set({ loading: true, error: null });

      const data = await ingresosApi.getIngresos();
      
      // Filtrar solo los activos (sin fecha de salida)
      const ingresosActivos = data.filter(
        (ingreso) => !ingreso.fechaSalida && ingreso.activo
      );

      set({ ingresos: ingresosActivos, loading: false });
    } catch (error) {
      console.error('Error al obtener ingresos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw error;
    }
  },

  // Registrar un nuevo ingreso
  registrarIngreso: async (dto: CreateIngresoDto) => {
    try {
      set({ loading: true, error: null });

      const nuevoIngreso = await ingresosApi.createIngreso(dto);
      
      // Agregar el nuevo ingreso al estado
      set((state) => ({
        ingresos: [...state.ingresos, nuevoIngreso],
        loading: false,
      }));

      return nuevoIngreso;
    } catch (error) {
      console.error('Error al registrar ingreso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw error;
    }
  },

  // Registrar salida de un contratista
  registrarSalida: async (contratistaId: number) => {
    try {
      set({ loading: true, error: null });

      await ingresosApi.registrarSalida(contratistaId);

      // Remover el ingreso del estado (ya no está activo)
      set((state) => ({
        ingresos: state.ingresos.filter((i) => i.id !== contratistaId),
        loading: false,
      }));
    } catch (error) {
      console.error('Error al registrar salida:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw error;
    }
  },
}));
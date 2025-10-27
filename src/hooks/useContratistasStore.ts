import { create } from "zustand";
import * as contratistasApi from "@/src/app/api/contratistas.api";
import { Contratista, CreateContratistaDto, UpdateContratistaDto } from "@/src/app/schemas/contratistas.schema";

interface ContratistasState {
  contratistas: Contratista[];
  loading: boolean;
  error: string | null;

  fetchContratistas: () => Promise<void>;
  buscarContratistas: (query: string) => Promise<Contratista[]>;
  crearContratista: (dto: CreateContratistaDto) => Promise<Contratista>;
  actualizarContratista: (id: number, dto: UpdateContratistaDto) => Promise<Contratista>;
  eliminarContratista: (id: number) => Promise<void>;
  restaurarContratista: (id: number) => Promise<Contratista>;
}

export const useContratistasStore = create<ContratistasState>((set) => ({
  contratistas: [],
  loading: false,
  error: null,

  fetchContratistas: async () => {
    try {
      set({ loading: true, error: null });
      const data = await contratistasApi.getContratistas();
      set({ contratistas: data, loading: false });
    } catch (err: unknown) {
      console.error("Error al obtener contratistas:", err);
      const message = err instanceof Error ? err.message : "Error desconocido";
      set({ error: message, loading: false });
    }
  },

  buscarContratistas: async (query: string) => {
    try {
      const data = await contratistasApi.getContratistas();
      if (!query.trim()) return data;
      const searchTerm = query.toLowerCase();
      return data.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm) ||
        c.cedula.toLowerCase().includes(searchTerm)
      );
    } catch (err: unknown) {
      console.error("Error al buscar contratistas:", err);
      const message = err instanceof Error ? err.message : "Error desconocido";
      set({ error: message });
      return [];
    }
  },

  crearContratista: async (dto: CreateContratistaDto) => {
    const nuevo = await contratistasApi.createContratista(dto);
    set(state => ({ contratistas: [...state.contratistas, nuevo] }));
    return nuevo;
  },

  actualizarContratista: async (id: number, dto: UpdateContratistaDto) => {
    const actualizado = await contratistasApi.updateContratista(id, dto);
    set(state => ({
      contratistas: state.contratistas.map(c => c.id === id ? actualizado : c)
    }));
    return actualizado;
  },

  eliminarContratista: async (id: number) => {
    await contratistasApi.deleteContratista(id);
    set(state => ({
      contratistas: state.contratistas.filter(c => c.id !== id)
    }));
  },

  restaurarContratista: async (id: number) => {
    const restaurado = await contratistasApi.restoreContratista(id);
    set(state => ({
      contratistas: [...state.contratistas, restaurado]
    }));
    return restaurado;
  },
}));

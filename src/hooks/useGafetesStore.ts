import { create } from "zustand";
import * as gafetesApi from "@/src/app/api/gafetes.api";
import { Gafete, CreateGafeteDto, UpdateGafeteDto } from "@/src/app/schemas/gafetes.schema";

interface GafetesState {
  gafetes: Gafete[];
  loading: boolean;
  error: string | null;

  fetchGafetes: () => Promise<void>;
  crearGafete: (dto: CreateGafeteDto) => Promise<Gafete>;
  actualizarGafete: (id: number, dto: UpdateGafeteDto) => Promise<Gafete>;
  eliminarGafete: (id: number) => Promise<void>;
  restaurarGafete: (id: number) => Promise<Gafete>;
  cambiarEstadoGafete: (id: number, estado: string) => Promise<Gafete>;
  fetchPendientes: () => Promise<void>;
}

export const useGafetesStore = create<GafetesState>((set, get) => ({
  gafetes: [],
  loading: false,
  error: null,

  fetchGafetes: async () => {
    try {
      set({ loading: true, error: null });
      const data = await gafetesApi.getGafetes();
      set({ gafetes: data, loading: false });
    } catch (err: unknown) {
      console.error(err);
      set({ error: (err as Error).message || "Error desconocido", loading: false });
    }
  },

  crearGafete: async (dto: CreateGafeteDto) => {
    const nuevo = await gafetesApi.createGafete(dto);
    set(state => ({ gafetes: [...state.gafetes, nuevo] }));
    return nuevo;
  },

  actualizarGafete: async (id: number, dto: UpdateGafeteDto) => {
    const actualizado = await gafetesApi.updateGafete(id, dto);
    set(state => ({
      gafetes: state.gafetes.map(g => (g.id === id ? actualizado : g)),
    }));
    return actualizado;
  },

  eliminarGafete: async (id: number) => {
    await gafetesApi.deleteGafete(id);
    set(state => ({ gafetes: state.gafetes.filter(g => g.id !== id) }));
  },

  restaurarGafete: async (id: number) => {
    const restaurado = await gafetesApi.restoreGafete(id);
    set(state => ({ gafetes: [...state.gafetes, restaurado] }));
    return restaurado;
  },

  cambiarEstadoGafete: async (id: number, estado: string) => {
    const actualizado = await gafetesApi.cambiarEstadoGafete(id, estado);
    set(state => ({
      gafetes: state.gafetes.map(g => (g.id === id ? actualizado : g)),
    }));
    return actualizado;
  },

  fetchPendientes: async () => {
    try {
      const pendientes = await gafetesApi.getGafetesPendientes();
      set({ gafetes: pendientes });
    } catch (err: unknown) {
      console.error(err);
      set({ error: (err as Error).message || "Error desconocido" });
    }
  },
}));

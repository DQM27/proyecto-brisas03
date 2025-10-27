import { create } from "zustand";
import * as empresasApi from "@/src/app/api/empresas.api";
import { Empresa, CreateEmpresaDto, UpdateEmpresaDto } from "@/src/app/schemas/empresas.schema";

interface EmpresasState {
  empresas: Empresa[];
  loading: boolean;
  error: string | null;

  fetchEmpresas: () => Promise<void>;
  buscarEmpresas: (query: string) => Promise<Empresa[]>;
  crearEmpresa: (dto: CreateEmpresaDto) => Promise<Empresa>;
  actualizarEmpresa: (id: number, dto: UpdateEmpresaDto) => Promise<Empresa>;
  eliminarEmpresa: (id: number) => Promise<void>;
  restaurarEmpresa: (id: number) => Promise<Empresa>;
}

export const useEmpresasStore = create<EmpresasState>((set, get) => ({
  empresas: [],
  loading: false,
  error: null,

  fetchEmpresas: async () => {
    try {
      set({ loading: true, error: null });
      const data = await empresasApi.getEmpresas();
      set({ empresas: data, loading: false });
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      console.error("Error al obtener empresas:", message);
      set({ error: message, loading: false });
    }
  },

  buscarEmpresas: async (query: string) => {
    try {
      const data = await empresasApi.getEmpresas();
      if (!query.trim()) return data;
      const searchTerm = query.toLowerCase();
      return data.filter((e) =>
        e.nombre.toLowerCase().includes(searchTerm)
      );
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      console.error("Error al buscar empresas:", message);
      set({ error: message });
      return [];
    }
  },

  crearEmpresa: async (dto: CreateEmpresaDto) => {
    try {
      const nuevo = await empresasApi.createEmpresa(dto);
      set((state) => ({ empresas: [...state.empresas, nuevo] }));
      return nuevo;
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      console.error("Error al crear empresa:", message);
      set({ error: message });
      throw err;
    }
  },

  actualizarEmpresa: async (id: number, dto: UpdateEmpresaDto) => {
    try {
      const actualizado = await empresasApi.updateEmpresa(id, dto);
      set((state) => ({
        empresas: state.empresas.map((e) => (e.id === id ? actualizado : e)),
      }));
      return actualizado;
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      console.error("Error al actualizar empresa:", message);
      set({ error: message });
      throw err;
    }
  },

  eliminarEmpresa: async (id: number) => {
    try {
      await empresasApi.deleteEmpresa(id);
      set((state) => ({
        empresas: state.empresas.filter((e) => e.id !== id),
      }));
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      console.error("Error al eliminar empresa:", message);
      set({ error: message });
    }
  },

  restaurarEmpresa: async (id: number) => {
    try {
      const restaurado = await empresasApi.restoreEmpresa(id);
      set((state) => ({
        empresas: [...state.empresas, restaurado],
      }));
      return restaurado;
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      console.error("Error al restaurar empresa:", message);
      set({ error: message });
      throw err;
    }
  },
}));

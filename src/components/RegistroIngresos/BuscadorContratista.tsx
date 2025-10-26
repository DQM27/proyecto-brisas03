import React, { useState, useEffect, useCallback } from "react";
import { Controller, Control } from "react-hook-form";
import { Search, User } from "lucide-react";
import { Contratista, FormularioIngreso } from "@/src/app/types/index";
import { getContratistas } from "../../app/api/api";

interface Props {
  control: Control<FormularioIngreso>;
  setContratistaSeleccionado: (contratista: Contratista | null) => void;
}

export default function BuscadorContratista({ control, setContratistaSeleccionado }: Props) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Contratista[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Debounce de búsqueda
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setCargando(true);
        const data = await getContratistas(query);
        setResultados(data);
        setMostrarResultados(true);
        setCargando(false);
      } else {
        setResultados([]);
        setMostrarResultados(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSeleccionar = (contratista: Contratista) => {
    setContratistaSeleccionado(contratista);
    setQuery(contratista.nombre);
    setMostrarResultados(false);
  };

  const handleLimpiar = () => {
    setContratistaSeleccionado(null);
    setQuery("");
    setResultados([]);
    setMostrarResultados(false);
  };

  return (
    <Controller
      control={control}
      name="contratista_id"
      render={({ field: { value, onChange } }) => (
        <div className="space-y-2 relative">
          <label className="block text-sm font-medium text-gray-700">Buscar Contratista</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre o cédula..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!!value}
              aria-autocomplete="list"
              aria-controls="listbox"
            />
            {value && (
              <button
                type="button"
                onClick={handleLimpiar}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {mostrarResultados && !value && resultados.length > 0 && (
            <ul
              id="listbox"
              role="listbox"
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {resultados.map((c) => (
                <li
                  key={c.id}
                  role="option"
                  onClick={() => {
                    handleSeleccionar(c);
                    onChange(c.id);
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{c.nombre}</p>
                    <p className="text-sm text-gray-500">
                      Cédula: {c.cedula} {c.empresa && `• ${c.empresa}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {mostrarResultados && resultados.length === 0 && !cargando && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
              No se encontraron contratistas
            </div>
          )}
        </div>
      )}
    />
  );
}

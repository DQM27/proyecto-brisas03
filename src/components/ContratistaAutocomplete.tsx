"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, User, Building2, CreditCard, X } from 'lucide-react';
import { buscarContratistas } from '@/src/app/api/contratistas.api';
import type { Contratista } from '@/src/app/schemas/contratistas.schema';

interface ContratistaAutocompleteProps {
  onSelect: (contratista: Contratista) => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function ContratistaAutocomplete({
  onSelect,
  onClear,
  disabled = false,
}: ContratistaAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Contratista[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedContratista, setSelectedContratista] = useState<Contratista | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar contratistas con debounce
  useEffect(() => {
    if (!query.trim() || selectedContratista) {
      setResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await buscarContratistas(query);
        setResultados(data.slice(0, 10)); // Limitar a 10 resultados
        setShowDropdown(true);
      } catch (error) {
        console.error('Error al buscar contratistas:', error);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedContratista]);

  const handleSelect = useCallback((contratista: Contratista) => {
    setSelectedContratista(contratista);
    setQuery(contratista.nombre);
    setShowDropdown(false);
    onSelect(contratista);
  }, [onSelect]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSelectedContratista(null);
    setResultados([]);
    setShowDropdown(false);
    onClear();
  }, [onClear]);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <span className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Buscar Contratista *
        </span>
      </label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedContratista) {
              setSelectedContratista(null);
              onClear();
            }
          }}
          onFocus={() => {
            if (resultados.length > 0) setShowDropdown(true);
          }}
          disabled={disabled}
          placeholder="Buscar por nombre, cédula o empresa..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     transition-shadow"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="absolute right-3 top-[42px] animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
      )}

      {/* Dropdown de resultados */}
      {showDropdown && resultados.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {resultados.map((contratista) => (
            <button
              key={contratista.id}
              type="button"
              onClick={() => handleSelect(contratista)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 
                         border-b border-gray-100 last:border-b-0
                         transition-colors focus:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {contratista.nombre}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {contratista.cedula && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                        <CreditCard className="w-3 h-3" />
                        {contratista.cedula}
                      </span>
                    )}
                    {contratista.empresa && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                        <Building2 className="w-3 h-3" />
                        {contratista.empresa}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No hay resultados */}
      {showDropdown && !loading && query.trim() && resultados.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-500 text-sm">
            No se encontraron contratistas
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}

      {/* Contratista seleccionado */}
      {selectedContratista && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-medium text-green-900">
                ✓ Contratista seleccionado
              </p>
              <p className="text-sm text-green-700 mt-1">
                {selectedContratista.nombre}
              </p>
              {selectedContratista.empresa && (
                <p className="text-xs text-green-600 mt-0.5">
                  {selectedContratista.empresa}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
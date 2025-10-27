"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface IngresosSearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function IngresosSearch({ 
  onSearch,
  placeholder = "Buscar por nombre, cédula o gafete..."
}: IngresosSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Debounce de 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Ejecutar búsqueda cuando cambia el valor debounced
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setDebouncedValue('');
  }, []);

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-gray-900 placeholder-gray-400
                     transition-shadow"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {inputValue && (
        <p className="text-xs text-gray-500 mt-2">
          Buscando: <span className="font-medium text-gray-700">{inputValue}</span>
        </p>
      )}
    </div>
  );
}
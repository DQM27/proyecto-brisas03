"use client";

import { useState, useEffect } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';
import { getGafetesDisponibles } from '@/src/app/api/gafetes.api';
import type { Gafete } from '@/src/app/schemas/gafetes.schema';

interface GafeteSelectorProps {
  onSelect: (gafeteId: number | null) => void;
  disabled?: boolean;
}

export default function GafeteSelector({
  onSelect,
  disabled = false,
}: GafeteSelectorProps) {
  const [gafetes, setGafetes] = useState<Gafete[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGafeteId, setSelectedGafeteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchGafetes = async () => {
      try {
        setLoading(true);
        const data = await getGafetesDisponibles();
        setGafetes(data.filter(g => g.estado === 'DISPONIBLE'));
      } catch (error) {
        console.error('Error al cargar gafetes:', error);
        setGafetes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGafetes();
  }, []);

  const handleSelect = (gafeteId: number) => {
    setSelectedGafeteId(gafeteId);
    onSelect(gafeteId);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <span className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Gafete *
        </span>
      </label>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : gafetes.length === 0 ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">
                No hay gafetes disponibles
              </p>
              <p className="text-xs text-red-700 mt-1">
                Todos los gafetes están en uso. Por favor, espera a que se devuelva uno.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {gafetes.map((gafete) => (
            <button
              key={gafete.id}
              type="button"
              onClick={() => handleSelect(gafete.id)}
              disabled={disabled}
              className={`p-3 border-2 rounded-lg transition-all text-center
                ${selectedGafeteId === gafete.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-full ${
                  selectedGafeteId === gafete.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <CreditCard className={`w-5 h-5 ${
                    selectedGafeteId === gafete.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                </div>
                <span className={`font-bold text-lg ${
                  selectedGafeteId === gafete.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {gafete.numero}
                </span>
                {selectedGafeteId === gafete.id && (
                  <span className="text-xs text-blue-600 font-medium">
                    Seleccionado ✓
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedGafeteId && (
        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
          <CreditCard className="w-4 h-4" />
          Gafete seleccionado: <strong>{gafetes.find(g => g.id === selectedGafeteId)?.numero}</strong>
        </p>
      )}
    </div>
  );
}
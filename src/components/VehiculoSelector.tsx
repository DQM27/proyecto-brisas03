"use client";

import { useState, useEffect } from 'react';
import { Car, Check } from 'lucide-react';
import { getVehiculosPorContratista } from '@/src/app/api/vehiculos.api';
import type { Vehiculo } from '@/src/app/schemas/vehiculos.schema';

interface VehiculoSelectorProps {
  contratistaId: number | null;
  onSelect: (vehiculoId: number | null) => void;
  disabled?: boolean;
}

export default function VehiculoSelector({
  contratistaId,
  onSelect,
  disabled = false,
}: VehiculoSelectorProps) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<number | null>(null);

  // Cargar vehículos cuando cambia el contratista
  useEffect(() => {
    if (!contratistaId) {
      setVehiculos([]);
      setSelectedVehiculoId(null);
      onSelect(null);
      return;
    }

    const fetchVehiculos = async () => {
      try {
        setLoading(true);
        const data = await getVehiculosPorContratista(contratistaId);
        setVehiculos(data);
        
        // Si no hay vehículos, seleccionar "Caminando" por defecto
        if (data.length === 0) {
          setSelectedVehiculoId(null);
          onSelect(null);
        }
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
        setVehiculos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, [contratistaId, onSelect]);

  const handleSelect = (vehiculoId: number | null) => {
    setSelectedVehiculoId(vehiculoId);
    onSelect(vehiculoId);
  };

  if (!contratistaId) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <span className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          Vehículo
        </span>
      </label>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : vehiculos.length === 0 ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Este contratista no tiene vehículos registrados
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Ingresará caminando
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Opción Caminando */}
          <button
            type="button"
            onClick={() => handleSelect(null)}
            disabled={disabled}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all
              ${selectedVehiculoId === null
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  selectedVehiculoId === null ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Car className={`w-5 h-5 ${
                    selectedVehiculoId === null ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <p className={`font-medium ${
                    selectedVehiculoId === null ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    Caminando
                  </p>
                  <p className="text-sm text-gray-500">Sin vehículo</p>
                </div>
              </div>
              {selectedVehiculoId === null && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </button>

          {/* Vehículos del contratista */}
          {vehiculos.map((vehiculo) => (
            <button
              key={vehiculo.id}
              type="button"
              onClick={() => handleSelect(vehiculo.id)}
              disabled={disabled}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all
                ${selectedVehiculoId === vehiculo.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full mt-0.5 ${
                    selectedVehiculoId === vehiculo.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Car className={`w-5 h-5 ${
                      selectedVehiculoId === vehiculo.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      selectedVehiculoId === vehiculo.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {vehiculo.numeroPlaca}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {vehiculo.marca} • {vehiculo.color} • {vehiculo.tipo}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {vehiculo.tieneLicencia && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          Licencia ✓
                        </span>
                      )}
                      {vehiculo.dekraAlDia && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          Dekra ✓
                        </span>
                      )}
                      {vehiculo.marchamoAlDia && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          Marchamo ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {selectedVehiculoId === vehiculo.id && (
                  <Check className="w-5 h-5 text-blue-600 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from 'react';
import { useToast } from '@/src/hooks/useToast';
import { createIngreso } from '@/src/app/api/ingresosApi';
import { Save } from 'lucide-react';
import ContratistaAutocomplete from './ContratistaAutocomplete';
import VehiculoSelector from './VehiculoSelector';
import GafeteSelector from './GafeteSelector';
import type { Contratista } from '@/src/app/schemas/contratistas.schema';

interface IngresoFormProps {
  onSuccess?: () => void;
}

export default function IngresoForm({ onSuccess }: IngresoFormProps) {
  const toast = useToast();
  
  const [contratistaSeleccionado, setContratistaSeleccionado] = useState<Contratista | null>(null);
  const [vehiculoId, setVehiculoId] = useState<number | null>(null);
  const [gafeteId, setGafeteId] = useState<number | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!contratistaSeleccionado) {
      toast.warning('Debes seleccionar un contratista');
      return;
    }

    if (!gafeteId) {
      toast.warning('Debes seleccionar un gafete');
      return;
    }

    try {
      setGuardando(true);
      
      await createIngreso({
        contratistaId: contratistaSeleccionado.id,
        vehiculoId: vehiculoId || undefined,
        gafeteId,
        observaciones: observaciones.trim() || undefined,
      });

      toast.success(`Ingreso registrado: ${contratistaSeleccionado.nombre}`);
      
      // Limpiar formulario
      handleReset();
      
      // Callback de éxito (cierra el formulario colapsable)
      onSuccess?.();
      
    } catch (error) {
      console.error('Error al registrar ingreso:', error);
      toast.error('Error al registrar el ingreso. Inténtalo nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = () => {
    setContratistaSeleccionado(null);
    setVehiculoId(null);
    setGafeteId(null);
    setObservaciones('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Paso 1: Buscar Contratista */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3">
          Paso 1: Seleccionar Contratista
        </h3>
        <ContratistaAutocomplete
          onSelect={setContratistaSeleccionado}
          onClear={() => {
            setContratistaSeleccionado(null);
            setVehiculoId(null);
          }}
          disabled={guardando}
        />
      </div>

      {/* Paso 2: Seleccionar Vehículo (solo si hay contratista) */}
      {contratistaSeleccionado && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-3">
            Paso 2: Seleccionar Vehículo
          </h3>
          <VehiculoSelector
            contratistaId={contratistaSeleccionado.id}
            onSelect={setVehiculoId}
            disabled={guardando}
          />
        </div>
      )}

      {/* Paso 3: Seleccionar Gafete (solo si hay contratista) */}
      {contratistaSeleccionado && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-3">
            Paso 3: Seleccionar Gafete
          </h3>
          <GafeteSelector
            onSelect={setGafeteId}
            disabled={guardando}
          />
        </div>
      )}

      {/* Observaciones (opcional) */}
      {contratistaSeleccionado && (
        <div>
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones (Opcional)
          </label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            disabled={guardando}
            rows={3}
            maxLength={500}
            placeholder="Ingresa cualquier observación relevante..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:bg-gray-100 disabled:cursor-not-allowed
                       transition-shadow resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {observaciones.length}/500 caracteres
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando || !contratistaSeleccionado || !gafeteId}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                     text-white font-semibold py-3 px-6 rounded-lg
                     flex items-center justify-center gap-2
                     transition-colors shadow-md hover:shadow-lg
                     disabled:cursor-not-allowed"
        >
          {guardando ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Registrar Ingreso</span>
            </>
          )}
        </button>

        {contratistaSeleccionado && !guardando && (
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 
                       font-semibold rounded-lg hover:bg-gray-50 
                       transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Ayuda */}
      {!contratistaSeleccionado && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            👆 Comienza buscando y seleccionando un contratista
          </p>
        </div>
      )}
    </form>
  );
}
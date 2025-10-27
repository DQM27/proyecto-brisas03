"use client";

import { memo, useMemo } from 'react';
import { LogOut, Clock, Car, User, Building2, CreditCard } from 'lucide-react';

interface Ingreso {
  id: number;
  fechaIngreso: Date;
  contratista?: {
    id: number;
    nombre: string;
    cedula?: string | null;
    empresa?: string | null;
  };
  vehiculo?: {
    id: number;
    numeroPlaca: string;
    marca: string;
    color: string;
  } | null;
  gafete?: {
    id: number;
    numero: string;
  } | null;
}

interface IngresoRowProps {
  ingreso: Ingreso;
  onRegistrarSalida: (id: number, nombre: string) => void;
  procesando: boolean;
  tiempoActual: number; // timestamp para forzar re-render del tiempo
}

function IngresoRow({ ingreso, onRegistrarSalida, procesando, tiempoActual }: IngresoRowProps) {
  // Formatear fecha
  const fechaFormateada = useMemo(() => {
    const date = ingreso.fechaIngreso instanceof Date 
      ? ingreso.fechaIngreso 
      : new Date(ingreso.fechaIngreso);
    return date.toLocaleString("es-CR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, [ingreso.fechaIngreso]);

  // Calcular tiempo transcurrido
  const tiempoTranscurrido = useMemo(() => {
    const inicio = ingreso.fechaIngreso instanceof Date 
      ? ingreso.fechaIngreso 
      : new Date(ingreso.fechaIngreso);
    const ahora = new Date(tiempoActual);
    const diffMs = ahora.getTime() - inicio.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    }
    return `${diffMins}m`;
  }, [ingreso.fechaIngreso, tiempoActual]);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Nombre */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {ingreso.contratista?.nombre || 'N/A'}
            </p>
            {ingreso.contratista?.empresa && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" />
                {ingreso.contratista.empresa}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Cédula */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-700">
          {ingreso.contratista?.cedula || '-'}
        </span>
      </td>

      {/* Gafete */}
      <td className="px-6 py-4 whitespace-nowrap">
        {ingreso.gafete ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                           text-xs font-medium bg-purple-100 text-purple-800">
            <CreditCard className="w-3 h-3" />
            {ingreso.gafete.numero}
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>

      {/* Vehículo */}
      <td className="px-6 py-4 whitespace-nowrap">
        {ingreso.vehiculo ? (
          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
            <Car className="w-4 h-4 text-gray-500" />
            {ingreso.vehiculo.numeroPlaca}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Caminando</span>
        )}
      </td>

      {/* Hora Ingreso */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-700">{fechaFormateada}</span>
      </td>

      {/* Tiempo */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                         text-xs font-medium bg-blue-50 text-blue-700">
          <Clock className="w-3.5 h-3.5" />
          {tiempoTranscurrido}
        </span>
      </td>

      {/* Acción */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button
          onClick={() => onRegistrarSalida(ingreso.id, ingreso.contratista)}
          disabled={procesando}
          className="inline-flex items-center gap-2 px-3 py-2 
                     bg-red-600 hover:bg-red-700 disabled:bg-gray-400 
                     text-white text-sm font-medium rounded-lg 
                     transition-colors shadow-sm hover:shadow-md 
                     disabled:cursor-not-allowed"
        >
          {procesando ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              <span>Salida</span>
            </>
          )}
        </button>
      </td>
    </tr>
  );
}

// Memoización para evitar re-renders innecesarios
export default memo(IngresoRow, (prevProps, nextProps) => {
  return (
    prevProps.ingreso.id === nextProps.ingreso.id &&
    prevProps.procesando === nextProps.procesando &&
    prevProps.tiempoActual === nextProps.tiempoActual
  );
});
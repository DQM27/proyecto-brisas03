"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import IngresoRow from './IngresoRow';
import IngresosSearch from './IngresosSearch';
import IngresosPagination from './IngresosPagination';

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
  } | null;
  gafete?: {
    id: number;
    numero: string;
  } | null;
}

interface IngresosTableProps {
  ingresos: Ingreso[];
  loading: boolean;
  onRegistrarSalida: (id: number, nombre: string) => Promise<void>;
  procesandoSalida: number | null;
}

const ITEMS_PER_PAGE = 15;

export default function IngresosTable({
  ingresos,
  loading,
  onRegistrarSalida,
  procesandoSalida,
}: IngresosTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tiempoActual, setTiempoActual] = useState(Date.now());

  // Actualizar tiempo cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(Date.now());
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, []);

  // Filtrar ingresos por búsqueda
  const ingresosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return ingresos;

    const term = searchTerm.toLowerCase().trim();
    return ingresos.filter((ingreso) => {
      const nombre = ingreso.contratista?.nombre?.toLowerCase() || '';
      const cedula = ingreso.contratista?.cedula?.toLowerCase() || '';
      const gafete = ingreso.gafete?.numero?.toLowerCase() || '';

      return nombre.includes(term) || cedula.includes(term) || gafete.includes(term);
    });
  }, [ingresos, searchTerm]);

  // Calcular paginación
  const totalPages = Math.ceil(ingresosFiltrados.length / ITEMS_PER_PAGE);
  
  const ingresosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return ingresosFiltrados.slice(startIndex, endIndex);
  }, [ingresosFiltrados, currentPage]);

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Contratistas Activos
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {ingresosFiltrados.length} {ingresosFiltrados.length === 1 ? 'persona' : 'personas'} 
              {searchTerm && ' (filtrado)'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-5 py-3">
            <p className="text-white font-bold text-3xl">
              {ingresosFiltrados.length}
            </p>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="p-6 border-b border-gray-200">
        <IngresosSearch onSearch={handleSearch} />
      </div>

      {/* Tabla */}
      {ingresosFiltrados.length === 0 ? (
        <div className="text-center py-16 px-4">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {searchTerm ? 'No se encontraron resultados' : 'No hay ingresos activos'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm 
              ? 'Intenta con otro término de búsqueda'
              : 'Los registros aparecerán aquí cuando se registren ingresos'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contratista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cédula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gafete
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ingresosPaginados.map((ingreso) => (
                  <IngresoRow
                    key={ingreso.id}
                    ingreso={ingreso}
                    onRegistrarSalida={onRegistrarSalida}
                    procesando={procesandoSalida === ingreso.id}
                    tiempoActual={tiempoActual}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <IngresosPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={ingresosFiltrados.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
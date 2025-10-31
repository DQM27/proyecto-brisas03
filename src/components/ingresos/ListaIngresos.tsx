'use client';

import React, { useEffect } from 'react';
import { useListarIngresos } from '@/src/lib/ingresos/useIngresos';
import { ResponseIngreso } from '@/src/lib/ingresos/ingresos.schemas';

/**
 * Componente de ejemplo para listar ingresos con paginación
 */
export default function ListaIngresos() {
  const {
    data,
    loading,
    error,
    page,
    cargar,
    siguientePagina,
    paginaAnterior,
    irAPagina,
  } = useListarIngresos(1, 10);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargar();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error al cargar ingresos</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No hay ingresos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ingresos Registrados</h2>
        <div className="text-sm text-gray-600">
          Total: {data.total} ingresos
        </div>
      </div>

      {/* Tabla de Ingresos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contratista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gafete
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.map((ingreso) => (
                <tr key={ingreso.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ingreso.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ingreso.contratista.nombreCompleto}
                    </div>
                    <div className="text-sm text-gray-500">
                      Cédula: {ingreso.contratista.cedula}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ingreso.gafete ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {ingreso.gafete.codigo}
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin gafete</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ingreso.fechaIngreso).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ingreso.dentroFuera ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Dentro
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Salió
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ingreso.duracion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando página <span className="font-medium">{page}</span> de{' '}
              <span className="font-medium">{data.totalPages}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={paginaAnterior}
                disabled={page === 1 || loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              {/* Números de página */}
              <div className="hidden sm:flex gap-1">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => irAPagina(pageNum)}
                      disabled={loading}
                      className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={siguientePagina}
                disabled={page >= data.totalPages || loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de carga durante actualización */}
      {loading && data && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Actualizando...
        </div>
      )}
    </div>
  );
}
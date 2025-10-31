'use client';

import React, { useEffect } from 'react';
import { useListarIngresos } from '@/src/lib/ingresos/useIngresos';

/**
 * Página de listado de ingresos
 */
export default function IngresosPage() {
  const {
    data,
    loading,
    error,
    page,
    cargar,
    siguientePagina,
    paginaAnterior,
  } = useListarIngresos(1, 10);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargar();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ingresos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">❌ Error al cargar ingresos</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">📋 No hay ingresos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Ingresos Registrados</h1>

      {/* Tabla de Ingresos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contratista</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gafete</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Ingreso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((ingreso) => (
              <tr key={ingreso.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{ingreso.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{ingreso.contratista.nombreCompleto}</div>
                  <div className="text-sm text-gray-500">Cédula: {ingreso.contratista.cedula}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {ingreso.gafete?.codigo || 'Sin gafete'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(ingreso.fechaIngreso).toLocaleString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ingreso.dentroFuera ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Dentro
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      Salió
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Página {page} de {data.totalPages} - Total: {data.total} registros
        </div>
        <div className="flex gap-2">
          <button
            onClick={paginaAnterior}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={siguientePagina}
            disabled={page >= data.totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
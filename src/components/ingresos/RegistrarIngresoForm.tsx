'use client';

import React, { useState } from 'react';
import { useRegistrarIngreso } from '@/src/lib/ingresos/useIngresos';
import { CreateIngresoDto, TipoAutorizacion } from '@/src/lib/ingresos/ingresos.schemas';

/**
 * Componente de ejemplo para registrar ingresos
 * 
 * Este es un ejemplo completo que muestra:
 * - Formulario con validación
 * - Manejo de estados (loading, error, success)
 * - Integración con el hook useRegistrarIngreso
 */
export default function RegistrarIngresoForm() {
  const { loading, error, success, registrar, reset } = useRegistrarIngreso();
  
  const [formData, setFormData] = useState<CreateIngresoDto>({
    contratistaId: 0,
    gafeteId: undefined,
    vehiculoId: undefined,
    puntoEntradaId: undefined,
    tipoAutorizacion: 'AUTOMATICA',
    observaciones: '',
  });

  const [usuarioId] = useState(5); // En producción, obtener del contexto de auth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar campos vacíos
    const cleanData: CreateIngresoDto = {
      contratistaId: formData.contratistaId,
      ...(formData.gafeteId && { gafeteId: formData.gafeteId }),
      ...(formData.vehiculoId && { vehiculoId: formData.vehiculoId }),
      ...(formData.puntoEntradaId && { puntoEntradaId: formData.puntoEntradaId }),
      ...(formData.tipoAutorizacion && { tipoAutorizacion: formData.tipoAutorizacion }),
      ...(formData.observaciones && { observaciones: formData.observaciones }),
    };

    const resultado = await registrar(cleanData, usuarioId);
    
    if (resultado) {
      console.log('✅ Ingreso registrado:', resultado);
      // Resetear formulario o redirigir
      setFormData({
        contratistaId: 0,
        tipoAutorizacion: 'AUTOMATICA',
        observaciones: '',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (
        name.includes('Id') ? Number(value) : value
      ),
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Registrar Ingreso</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{typeof error.message === 'string' ? error.message : error.message.join(', ')}</p>
          {error.errorCode && (
            <p className="text-sm mt-1">Código: {error.errorCode}</p>
          )}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>✅ Ingreso registrado exitosamente</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contratista ID (Obligatorio) */}
        <div>
          <label htmlFor="contratistaId" className="block text-sm font-medium text-gray-700 mb-1">
            ID Contratista <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="contratistaId"
            name="contratistaId"
            value={formData.contratistaId || ''}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123"
          />
        </div>

        {/* Gafete ID (Opcional) */}
        <div>
          <label htmlFor="gafeteId" className="block text-sm font-medium text-gray-700 mb-1">
            ID Gafete (opcional)
          </label>
          <input
            type="number"
            id="gafeteId"
            name="gafeteId"
            value={formData.gafeteId || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="78"
          />
        </div>

        {/* Vehículo ID (Opcional) */}
        <div>
          <label htmlFor="vehiculoId" className="block text-sm font-medium text-gray-700 mb-1">
            ID Vehículo (opcional)
          </label>
          <input
            type="number"
            id="vehiculoId"
            name="vehiculoId"
            value={formData.vehiculoId || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="45"
          />
        </div>

        {/* Punto de Entrada ID (Opcional) */}
        <div>
          <label htmlFor="puntoEntradaId" className="block text-sm font-medium text-gray-700 mb-1">
            ID Punto de Entrada (opcional)
          </label>
          <input
            type="number"
            id="puntoEntradaId"
            name="puntoEntradaId"
            value={formData.puntoEntradaId || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2"
          />
        </div>

        {/* Tipo de Autorización */}
        <div>
          <label htmlFor="tipoAutorizacion" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Autorización
          </label>
          <select
            id="tipoAutorizacion"
            name="tipoAutorizacion"
            value={formData.tipoAutorizacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AUTOMATICA">Automática</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones (opcional)
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingreso autorizado por..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.observaciones?.length || 0}/500 caracteres
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Registrando...' : 'Registrar Ingreso'}
          </button>

          {(error || success) && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
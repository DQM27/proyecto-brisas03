'use client';

import React, { useState } from 'react';
import { useRegistrarIngreso } from '@/src/lib/ingresos/useIngresos';
import { CreateIngresoDto } from '@/src/lib/ingresos/ingresos.schemas';

/**
 * Página de registro de ingresos
 */
export default function RegistroIngresosPage() {
  const { loading, error, success, registrar, reset } = useRegistrarIngreso();
  
  const [formData, setFormData] = useState<CreateIngresoDto>({
    contratistaId: 0,
    gafeteId: undefined,
    vehiculoId: undefined,
    puntoEntradaId: undefined,
    tipoAutorizacion: 'AUTOMATICA',
    observaciones: '',
  });

  // TODO: Obtener el usuarioId del sistema de autenticación
  const usuarioId = 1; // Cambiar por el ID real del usuario logueado

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.contratistaId <= 0) {
      alert('Por favor ingrese un ID de contratista válido');
      return;
    }

    // Limpiar campos vacíos antes de enviar
    const cleanData: CreateIngresoDto = {
      contratistaId: formData.contratistaId,
      ...(formData.gafeteId && formData.gafeteId > 0 && { gafeteId: formData.gafeteId }),
      ...(formData.vehiculoId && formData.vehiculoId > 0 && { vehiculoId: formData.vehiculoId }),
      ...(formData.puntoEntradaId && formData.puntoEntradaId > 0 && { puntoEntradaId: formData.puntoEntradaId }),
      tipoAutorizacion: formData.tipoAutorizacion,
      ...(formData.observaciones && formData.observaciones.trim() && { observaciones: formData.observaciones }),
    };

    const resultado = await registrar(cleanData, usuarioId);
    
    if (resultado) {
      console.log('✅ Ingreso registrado:', resultado);
      // Limpiar formulario
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
      [name]: name.includes('Id') && value !== '' ? Number(value) : value,
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">📝 Registrar Ingreso</h1>

      {/* Mensajes de Estado */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">❌ Error al registrar ingreso</p>
          <p className="text-sm mt-1">
            {typeof error.message === 'string' ? error.message : error.message.join(', ')}
          </p>
          {error.errorCode && (
            <p className="text-xs mt-2 font-mono">Código: {error.errorCode}</p>
          )}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <p className="font-semibold">✅ Ingreso registrado exitosamente</p>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Contratista ID - OBLIGATORIO */}
        <div>
          <label htmlFor="contratistaId" className="block text-sm font-medium text-gray-700 mb-2">
            ID del Contratista <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="contratistaId"
            name="contratistaId"
            value={formData.contratistaId || ''}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 123"
          />
          <p className="text-xs text-gray-500 mt-1">Este campo es obligatorio</p>
        </div>

        {/* Gafete ID - Opcional */}
        <div>
          <label htmlFor="gafeteId" className="block text-sm font-medium text-gray-700 mb-2">
            ID del Gafete (opcional)
          </label>
          <input
            type="number"
            id="gafeteId"
            name="gafeteId"
            value={formData.gafeteId || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 78"
          />
        </div>

        {/* Vehículo ID - Opcional */}
        <div>
          <label htmlFor="vehiculoId" className="block text-sm font-medium text-gray-700 mb-2">
            ID del Vehículo (opcional)
          </label>
          <input
            type="number"
            id="vehiculoId"
            name="vehiculoId"
            value={formData.vehiculoId || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 45"
          />
        </div>

        {/* Punto de Entrada ID - Opcional */}
        <div>
          <label htmlFor="puntoEntradaId" className="block text-sm font-medium text-gray-700 mb-2">
            ID del Punto de Entrada (opcional)
          </label>
          <input
            type="number"
            id="puntoEntradaId"
            name="puntoEntradaId"
            value={formData.puntoEntradaId || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 2"
          />
        </div>

        {/* Tipo de Autorización */}
        <div>
          <label htmlFor="tipoAutorizacion" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Autorización
          </label>
          <select
            id="tipoAutorizacion"
            name="tipoAutorizacion"
            value={formData.tipoAutorizacion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="AUTOMATICA">Automática</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones (opcional)
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Ingreso autorizado por..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.observaciones?.length || 0}/500 caracteres
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            ) : (
              '✅ Registrar Ingreso'
            )}
          </button>

          {(error || success) && (
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
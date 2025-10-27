import React from 'react';
import { ChevronDown, ChevronUp, Car } from 'lucide-react';

// Enum para tipo de vehículo
enum TipoVehiculo {
  AUTOMOVIL = 'AUTOMOVIL',
  MOTOCICLETA = 'MOTOCICLETA',
  CAMION = 'CAMION',
  PICKUP = 'PICKUP',
}

// Type definitions
interface ContratistaFormData {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  cedula: string;
  empresaId: string;
  fechaVencimientoPraind: string;
}

interface VehiculoFormData {
  tipo: TipoVehiculo;
  marca: string;
  color: string;
  numeroPlaca: string;
  tieneLicencia: boolean;
  dekraAlDia: boolean;
  marchamoAlDia: boolean;
}

interface ContratistaFormProps {
  initialData?: Partial<ContratistaFormData>;
  initialVehiculo?: Partial<VehiculoFormData>;
  onSubmit: (data: { contratista: ContratistaFormData; vehiculo?: VehiculoFormData }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  className?: string;
}

export default function ContratistaForm({
  initialData,
  initialVehiculo,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Guardar',
  className = '',
}: ContratistaFormProps) {
  const [formData, setFormData] = React.useState<ContratistaFormData>({
    primerNombre: initialData?.primerNombre || '',
    segundoNombre: initialData?.segundoNombre || '',
    primerApellido: initialData?.primerApellido || '',
    segundoApellido: initialData?.segundoApellido || '',
    cedula: initialData?.cedula || '',
    empresaId: initialData?.empresaId || '',
    fechaVencimientoPraind: initialData?.fechaVencimientoPraind || '',
  });

  const [tieneVehiculo, setTieneVehiculo] = React.useState(!!initialVehiculo);
  const [vehiculoData, setVehiculoData] = React.useState<VehiculoFormData>({
    tipo: initialVehiculo?.tipo || TipoVehiculo.AUTOMOVIL,
    marca: initialVehiculo?.marca || '',
    color: initialVehiculo?.color || '',
    numeroPlaca: initialVehiculo?.numeroPlaca || '',
    tieneLicencia: initialVehiculo?.tieneLicencia ?? false,
    dekraAlDia: initialVehiculo?.dekraAlDia ?? false,
    marchamoAlDia: initialVehiculo?.marchamoAlDia ?? false,
  });

  const handleContratistaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehiculoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setVehiculoData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      contratista: formData,
      vehiculo: tieneVehiculo ? vehiculoData : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Registro de Contratista
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1: Datos del Contratista */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Información Personal
          </h3>

          {/* Nombres */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="primerNombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Primer Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="primerNombre"
                name="primerNombre"
                value={formData.primerNombre}
                onChange={handleContratistaChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Juan"
              />
            </div>

            <div>
              <label
                htmlFor="segundoNombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Segundo Nombre
              </label>
              <input
                type="text"
                id="segundoNombre"
                name="segundoNombre"
                value={formData.segundoNombre}
                onChange={handleContratistaChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Carlos"
              />
            </div>
          </div>

          {/* Apellidos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="primerApellido"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Primer Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="primerApellido"
                name="primerApellido"
                value={formData.primerApellido}
                onChange={handleContratistaChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Pérez"
              />
            </div>

            <div>
              <label
                htmlFor="segundoApellido"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Segundo Apellido
              </label>
              <input
                type="text"
                id="segundoApellido"
                name="segundoApellido"
                value={formData.segundoApellido}
                onChange={handleContratistaChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Gómez"
              />
            </div>
          </div>

          {/* Cédula */}
          <div>
            <label
              htmlFor="cedula"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cédula <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={handleContratistaChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="1-2345-6789"
            />
          </div>

          {/* Empresa y Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="empresaId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Empresa
              </label>
              <input
                type="number"
                id="empresaId"
                name="empresaId"
                value={formData.empresaId}
                onChange={handleContratistaChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="1"
                min="1"
              />
            </div>

            <div>
              <label
                htmlFor="fechaVencimientoPraind"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vencimiento PRAIND
              </label>
              <input
                type="date"
                id="fechaVencimientoPraind"
                name="fechaVencimientoPraind"
                value={formData.fechaVencimientoPraind}
                onChange={handleContratistaChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Columna 2: Datos del Vehículo */}
        <div className="space-y-4">
          {/* Toggle para mostrar formulario de vehículo */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Información del Vehículo
            </h3>
            <button
              type="button"
              onClick={() => setTieneVehiculo(!tieneVehiculo)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tieneVehiculo ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ocultar
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Agregar Vehículo
                </>
              )}
            </button>
          </div>

          {tieneVehiculo && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Tipo de Vehículo */}
              <div>
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Vehículo <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={vehiculoData.tipo}
                  onChange={handleVehiculoChange}
                  required={tieneVehiculo}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value={TipoVehiculo.AUTOMOVIL}>Automóvil</option>
                  <option value={TipoVehiculo.MOTOCICLETA}>Motocicleta</option>
                  <option value={TipoVehiculo.CAMION}>Camión</option>
                  <option value={TipoVehiculo.PICKUP}>Pickup</option>
                </select>
              </div>

              {/* Marca y Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="marca"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={vehiculoData.marca}
                    onChange={handleVehiculoChange}
                    required={tieneVehiculo}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Toyota"
                  />
                </div>

                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={vehiculoData.color}
                    onChange={handleVehiculoChange}
                    required={tieneVehiculo}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Rojo"
                  />
                </div>
              </div>

              {/* Número de Placa */}
              <div>
                <label
                  htmlFor="numeroPlaca"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número de Placa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="numeroPlaca"
                  name="numeroPlaca"
                  value={vehiculoData.numeroPlaca}
                  onChange={handleVehiculoChange}
                  required={tieneVehiculo}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="ABC-1234"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="tieneLicencia"
                    checked={vehiculoData.tieneLicencia}
                    onChange={handleVehiculoChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Tiene licencia de conducir
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dekraAlDia"
                    checked={vehiculoData.dekraAlDia}
                    onChange={handleVehiculoChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Revisión técnica (DEKRA) al día
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="marchamoAlDia"
                    checked={vehiculoData.marchamoAlDia}
                    onChange={handleVehiculoChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Marchamo al día
                  </span>
                </label>
              </div>
            </div>
          )}

          {!tieneVehiculo && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400">
              <Car className="w-16 h-16 mb-3 opacity-30" />
              <p className="text-sm">El contratista no tiene vehículo</p>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Procesando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

// Ejemplo de uso
function ExampleUsage() {
  const handleSubmit = (data: { contratista: ContratistaFormData; vehiculo?: VehiculoFormData }) => {
    console.log('Datos del formulario:', data);
    // Aquí irá tu lógica de negocio
  };

  const handleCancel = () => {
    console.log('Formulario cancelado');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <ContratistaForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
          submitLabel="Registrar Contratista"
        />
      </div>
    </div>
  );
}
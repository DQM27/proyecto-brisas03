"use client";

import { Users, Car, UserCheck, Building2 } from 'lucide-react';

interface Ingreso {
  id: number;
  contratista?: {
    nombre: string;
    empresa?: string | null;
  };
  vehiculo?: {
    numeroPlaca: string;
  } | null;
}

interface IngresosStatsProps {
  ingresos: Ingreso[];
}

export default function IngresosStats({ ingresos }: IngresosStatsProps) {
  const total = ingresos.length;
  const conVehiculo = ingresos.filter((i) => i.vehiculo).length;
  const caminando = total - conVehiculo;
  
  // Contar empresas únicas
  const empresasUnicas = new Set(
    ingresos
      .map((i) => i.contratista?.empresa)
      .filter((e) => e && e.trim() !== '')
  ).size;

  const stats = [
    {
      label: 'Total Activos',
      value: total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Con Vehículo',
      value: conVehiculo,
      icon: Car,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Caminando',
      value: caminando,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Empresas',
      value: empresasUnicas,
      icon: Building2,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-xs font-medium mb-0.5">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
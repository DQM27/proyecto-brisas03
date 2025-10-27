"use client";

import { useEffect, useState, useCallback } from "react";
import { useIngresosStore } from "@/src/lib/useIngresosStore";
import { useToast } from "@/src/hooks/useToast";
import CollapsibleIngresoForm from "@/src/components/IngresoForm";
import IngresosStats from "@/src/components/IngresosStats";
import IngresosTable from "@/src/components/IngresosTable";

export default function IngresosPage() {
  const { ingresos, fetchIngresosActivos, registrarSalida, loading } = useIngresosStore();
  const [procesandoSalida, setProcesandoSalida] = useState<number | null>(null);
  const toast = useToast();

  // Cargar ingresos al montar
  useEffect(() => {
    fetchIngresosActivos();
  }, [fetchIngresosActivos]);

  // Manejar salida de contratista
  const handleRegistrarSalida = useCallback(async (ingresoId: number, nombreContratista: string) => {
    const confirmar = window.confirm(
      `¿Confirmar salida de ${nombreContratista}?`
    );

    if (!confirmar) return;

    try {
      setProcesandoSalida(ingresoId);
      await registrarSalida(ingresoId);
      await fetchIngresosActivos();
      
      toast.success(`Salida registrada: ${nombreContratista}`);
    } catch (error) {
      console.error("Error al registrar salida:", error);
      toast.error("Error al registrar la salida. Inténtalo nuevamente.");
    } finally {
      setProcesandoSalida(null);
    }
  }, [registrarSalida, fetchIngresosActivos, toast]);

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Control de Ingresos
          </h1>
          <p className="text-gray-600">
            Gestión de acceso de contratistas y vehículos
          </p>
        </div>

        {/* Formulario Colapsable */}
        <CollapsibleIngresoForm />

        {/* Estadísticas */}
        <IngresosStats ingresos={ingresos} />

        {/* Tabla de Ingresos */}
        <IngresosTable
          ingresos={ingresos}
          loading={loading}
          onRegistrarSalida={handleRegistrarSalida}
          procesandoSalida={procesandoSalida}
        />
      </div>
    </main>
  );
}
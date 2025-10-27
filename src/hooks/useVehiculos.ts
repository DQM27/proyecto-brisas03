// frontend-next/src/hooks/useVehiculos.ts
import { useState, useEffect } from "react";
import { getVehiculosPorContratista } from "@/src/app/api/vehiculos.api";
import { Vehiculo } from "@/src/app/types/index"; // o tu tipo basado en Zod

export const useVehiculos = (contratistaId?: number) => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contratistaId) return;

    const fetchVehiculos = async () => {
      setLoading(true);
      try {
        const data = await getVehiculosPorContratista(contratistaId);
        setVehiculos(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar vehículos");
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, [contratistaId]);

  return { vehiculos, loading, error };
};

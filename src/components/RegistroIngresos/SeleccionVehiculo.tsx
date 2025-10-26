import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Vehiculo, FormularioIngreso } from "@/src/app/types/index";
import { getVehiculos } from "../../app/api/api";

interface Props {
  control: Control<FormularioIngreso>;
  contratistaId: number;
}

export default function SeleccionVehiculo({ control, contratistaId }: Props) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      const data = await getVehiculos(contratistaId);
      setVehiculos(data);
    };
    fetchVehiculos();
  }, [contratistaId]);

  return (
    <Controller
      control={control}
      name="vehiculo"
      render={({ field }) => (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Vehículo</label>
          <select
            {...field}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Caminando">Caminando</option>
            {vehiculos.map((v) => (
              <option key={v.numero_placa} value={v.numero_placa}>
                {v.numero_placa} - {v.marca}
              </option>
            ))}
          </select>
        </div>
      )}
    />
  );
}

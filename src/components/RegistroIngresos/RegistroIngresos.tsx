// RegistroIngresos.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import BuscadorContratista from "./BuscadorContratista";
import InfoContratista from "./InfoContratista";
import SeleccionVehiculo from "./SeleccionVehiculo";
import AutorizacionIngreso from "./AutorizacionIngreso";
import GafeteInput from "./GafeteInput";
import BotonesAccion from "./BotonesAccion";

import { FormularioIngreso } from "@/src/app/types/index";

// Validación con Zod
const schema = z.object({
  contratista_id: z.number().min(1, "Selecciona un contratista"),
  vehiculo: z.string(),
  autorizacion: z.enum(["PRAIND", "Temporal", "Visitante"]),
  gafete: z.string().min(1, "Ingresa el número de gafete"),
});

export default function RegistroIngresos() {
  const [contratistaSeleccionado, setContratistaSeleccionado] = useState(null);

  const { handleSubmit, control, reset, watch, setValue } = useForm<FormularioIngreso>({
    resolver: zodResolver(schema),
    defaultValues: {
      contratista_id: 0,
      vehiculo: "Caminando",
      autorizacion: "PRAIND",
      gafete: "",
    },
  });

  const onSubmit = (data: FormularioIngreso) => {
    console.log("Enviando registro:", { ...data, fecha_hora: new Date().toISOString() });
    reset();
    setContratistaSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Registro de Ingresos</h1>

        <BuscadorContratista
          control={control}
          setContratistaSeleccionado={setContratistaSeleccionado}
        />

        {contratistaSeleccionado && (
          <>
            <InfoContratista contratista={contratistaSeleccionado} />
            <SeleccionVehiculo control={control} contratistaId={contratistaSeleccionado.id} />
            <AutorizacionIngreso contratista={contratistaSeleccionado} control={control} />
            <GafeteInput control={control} />
          </>
        )}

        <BotonesAccion
          handleSubmit={handleSubmit(onSubmit)}
          contratistaSeleccionado={contratistaSeleccionado}
          reset={() => {
            reset();
            setContratistaSeleccionado(null);
          }}
        />
      </div>
    </div>
  );
}

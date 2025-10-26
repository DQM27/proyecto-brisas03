import React, { useCallback } from "react";
import { Controller, Control } from "react-hook-form";
import { CheckCircle, XCircle } from "lucide-react";
import { Contratista, FormularioIngreso } from "@/src/app/types/index";

interface Props {
  contratista: Contratista;
  control: Control<FormularioIngreso>;
}

export default function AutorizacionIngreso({ contratista, control }: Props) {
  const verificarAutorizacion = useCallback((contratista: Contratista) => {
    if (!contratista.fecha_expiracion_praind) return false;
    return new Date(contratista.fecha_expiracion_praind) >= new Date();
  }, []);

  const autorizacionValida = verificarAutorizacion(contratista);

  return (
    <Controller
      control={control}
      name="autorizacion"
      render={({ field }) => (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Autorización de Ingreso</label>
          <div className="flex items-center gap-4">
            <select
              {...field}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PRAIND">PRAIND</option>
              <option value="Temporal">Temporal</option>
              <option value="Visitante">Visitante</option>
            </select>

            {contratista.fecha_expiracion_praind && (
              <div className="flex items-center gap-2">
                {autorizacionValida ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Vigente</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Expirado</span>
                  </>
                )}
              </div>
            )}
          </div>

          {contratista.fecha_expiracion_praind && (
            <p className="text-xs text-gray-500 mt-1">
              Fecha de expiración: {new Date(contratista.fecha_expiracion_praind).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    />
  );
}

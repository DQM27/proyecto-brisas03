import React from "react";
import { Contratista } from "@/src/app/types/index";

interface Props {
  contratista: Contratista;
}

export default function InfoContratista({ contratista }: Props) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-2">Contratista Seleccionado</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Nombre:</span> {contratista.nombre}</p>
        <p><span className="font-medium">Cédula:</span> {contratista.cedula}</p>
        {contratista.empresa && (
          <p><span className="font-medium">Empresa:</span> {contratista.empresa}</p>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Controller, Control } from "react-hook-form";
import { FormularioIngreso } from "@/src/app/types/index";

interface Props {
  control: Control<FormularioIngreso>;
}

export default function GafeteInput({ control }: Props) {
  return (
    <Controller
      control={control}
      name="gafete"
      render={({ field }) => (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Número de Gafete *</label>
          <input
            {...field}
            type="text"
            placeholder="Ej: G-001"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    />
  );
}

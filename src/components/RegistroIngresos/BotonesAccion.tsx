import React from "react";

interface Props {
  handleSubmit: () => void;
  contratistaSeleccionado: any;
  reset: () => void;
}

export default function BotonesAccion({ handleSubmit, contratistaSeleccionado, reset }: Props) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!contratistaSeleccionado}
        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
      >
        Registrar Ingreso
      </button>
      {contratistaSeleccionado && (
        <button
          type="button"
          onClick={reset}
          className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}

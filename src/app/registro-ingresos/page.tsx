"use client";
import React from "react";
import { useIngresos } from "@/src/hooks/useIngresos";

export default function PageIngresos() {
  const { ingresos, loading } = useIngresos();

  if (loading) return <p>Cargando ingresos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Ingresos</h1>

      <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto">
        {JSON.stringify(ingresos, null, 2)}
      </pre>
    </div>
  );
}

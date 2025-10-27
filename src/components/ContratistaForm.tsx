"use client";

import { useState } from "react";
import { useContratistasStore } from "@/src/hooks/useContratistasStore";
import { CreateContratistaDto } from "@/src/app/schemas/contratistas.schema";

export default function ContratistaForm() {
  const [primerNombre, setPrimerNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const crearContratista = useContratistasStore((state) => state.crearContratista);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dto: CreateContratistaDto = {
      primerNombre,
      primerApellido,
      cedula,
    };

    try {
      await crearContratista(dto);
      alert("Contratista creado correctamente!");
      setPrimerNombre("");
      setPrimerApellido("");
      setCedula("");
    } catch (error) {
      console.error(error);
      alert("Error al crear contratista");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded w-96">
      <div>
        <label>Primer Nombre:</label>
        <input
          value={primerNombre}
          onChange={(e) => setPrimerNombre(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </div>
      <div>
        <label>Primer Apellido:</label>
        <input
          value={primerApellido}
          onChange={(e) => setPrimerApellido(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </div>
      <div>
        <label>Cédula:</label>
        <input
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
        Crear
      </button>
    </form>
  );
}

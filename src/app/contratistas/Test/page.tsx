// frontend-next/src/app/contratistas/test.tsx
"use client";

import { useState } from "react";
import { useContratistasStore } from "@/src/hooks/useContratistasStore";

export default function TestContratistaPage() {
  const { crearContratista } = useContratistasStore();
  const [primerNombre, setPrimerNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [empresaId, setEmpresaId] = useState<number | "">("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Crear el payload mínimo según el DTO del backend
      const payload = {
        primerNombre,
        primerApellido,
        cedula,
        empresaId: empresaId === "" ? undefined : empresaId,
        notas: notas || undefined,
      };
      console.log("Payload enviado:", payload);

      const nuevo = await crearContratista(payload);
      setMensaje(`¡Contratista creado! ID: ${nuevo.id}`);
      // limpiar campos
      setPrimerNombre("");
      setPrimerApellido("");
      setCedula("");
      setEmpresaId("");
      setNotas("");
    } catch (err: any) {
      console.error("Error al crear contratista:", err);
      setMensaje(`Error: ${err.message || "Desconocido"}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Crear Contratista</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Primer Nombre:</label>
          <input
            type="text"
            value={primerNombre}
            onChange={(e) => setPrimerNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Primer Apellido:</label>
          <input
            type="text"
            value={primerApellido}
            onChange={(e) => setPrimerApellido(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cédula:</label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Empresa ID:</label>
          <input
            type="number"
            value={empresaId}
            onChange={(e) => setEmpresaId(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Notas:</label>
          <input
            type="text"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </div>
        <button type="submit">Crear Contratista</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

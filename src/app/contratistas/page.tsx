// frontend-next/src/app/contratistas/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useContratistasStore } from "@/src/hooks/useContratistasStore";
import { CreateContratistaDto } from "@/src/app/schemas/contratistas.schema";

export default function ContratistasPage() {
  const { contratistas, fetchContratistas, crearContratista } = useContratistasStore();
  const [form, setForm] = useState<CreateContratistaDto>({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    cedula: "",
    telefono: "",
    empresaId: undefined,
    fechaVencimientoPraind: "",
    activo: true,
    notas: "",
  });

  useEffect(() => {
    fetchContratistas();
  }, [fetchContratistas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearContratista(form);
      alert("Contratista creado");
      setForm({
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        cedula: "",
        telefono: "",
        empresaId: undefined,
        fechaVencimientoPraind: "",
        activo: true,
        notas: "",
      });
    } catch (err) {
      alert("Error al crear contratista");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Registro de Contratistas</h1>
      <form onSubmit={handleSubmit}>
        <input name="primerNombre" placeholder="Primer Nombre" value={form.primerNombre} onChange={handleChange} required />
        <input name="segundoNombre" placeholder="Segundo Nombre" value={form.segundoNombre} onChange={handleChange} />
        <input name="primerApellido" placeholder="Primer Apellido" value={form.primerApellido} onChange={handleChange} required />
        <input name="segundoApellido" placeholder="Segundo Apellido" value={form.segundoApellido} onChange={handleChange} />
        <input name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="empresaId" placeholder="ID Empresa" type="number" value={form.empresaId || ""} onChange={handleChange} />
        <input name="fechaVencimientoPraind" placeholder="Fecha Vencimiento Praind" type="date" value={form.fechaVencimientoPraind} onChange={handleChange} />
        <input name="notas" placeholder="Notas" value={form.notas} onChange={handleChange} />
        <button type="submit">Guardar</button>
      </form>

      <h2>Contratistas Registrados</h2>
      <ul>
        {contratistas.map((c) => (
          <li key={c.id}>
            {c.primerNombre} {c.segundoNombre || ""} {c.primerApellido} {c.segundoApellido || ""} - {c.cedula}
          </li>
        ))}
      </ul>
    </div>
  );
}

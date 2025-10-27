"use client";

import React, { useEffect, useState } from "react";
import { useGafetesStore } from "@/src/hooks/useGafetesStore";
import { CreateGafeteDto } from "@/src/app/schemas/gafetes.schema";
import { TipoGafete, EstadoGafete } from "@/src/common/enums/gafetes.enums";

export default function GafetesTestPage() {
  const { gafetes, fetchGafetes, crearGafete, eliminarGafete, restaurarGafete } = useGafetesStore();

  const [form, setForm] = useState<CreateGafeteDto>({
    codigo: "",
    tipo: TipoGafete.PERSONAL,
    estado: EstadoGafete.ACTIVO,
    contratistaId: undefined,
  });

  const [restaurarId, setRestaurarId] = useState<number | "">("");

  useEffect(() => {
    fetchGafetes();
  }, [fetchGafetes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.codigo) return alert("El código es obligatorio");
    await crearGafete(form);
    setForm({ codigo: "", tipo: TipoGafete.PERSONAL, estado: EstadoGafete.ACTIVO });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Test Gafetes</h1>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 max-w-md">
        <input
          className="border rounded p-2"
          placeholder="Código"
          value={form.codigo}
          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
        />

        <select
          className="border rounded p-2"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoGafete })}
        >
          {Object.values(TipoGafete).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoGafete })}
        >
          {Object.values(EstadoGafete).map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <input
          type="number"
          className="border rounded p-2"
          placeholder="Contratista ID (opcional)"
          value={form.contratistaId ?? ""}
          onChange={(e) => setForm({ ...form, contratistaId: e.target.value ? Number(e.target.value) : undefined })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Crear Gafete
        </button>
      </form>

      {/* LISTA */}
      <h2 className="text-lg font-medium mb-2">Gafetes registrados:</h2>
      <ul className="space-y-2">
        {gafetes.map((g) => (
          <li key={g.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <strong>{g.codigo}</strong> — {g.tipo} — {g.estado} {g.contratistaId && `(Contratista: ${g.contratistaId})`}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => eliminarGafete(g.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* RESTAURAR */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">Restaurar gafete eliminado:</h3>
        <div className="flex gap-2">
          <input
            type="number"
            className="border rounded p-2"
            placeholder="ID de gafete"
            value={restaurarId}
            onChange={(e) => setRestaurarId(e.target.value ? Number(e.target.value) : "")}
          />
          <button
            onClick={() => {
              if (!restaurarId) return;
              restaurarGafete(Number(restaurarId));
              setRestaurarId("");
            }}
            className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
          >
            Restaurar
          </button>
        </div>
      </div>
    </div>
  );
}

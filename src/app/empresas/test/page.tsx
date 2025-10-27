"use client";

import React, { useEffect, useState } from "react";
import { useEmpresasStore } from "@/src/hooks/useEmpresasStore";
import { CreateEmpresaDto } from "@/src/app/schemas/empresas.schema";

export default function EmpresasTestPage() {
  const { empresas, fetchEmpresas, crearEmpresa, eliminarEmpresa, restaurarEmpresa } =
    useEmpresasStore();

  const [form, setForm] = useState<CreateEmpresaDto>({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  const [restaurarId, setRestaurarId] = useState("");

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre) return alert("El nombre es obligatorio");
    try {
      await crearEmpresa(form);
      setForm({ nombre: "", telefono: "", direccion: "" });
    } catch (err) {
      console.error("Error creando empresa:", err);
      alert("No se pudo crear la empresa");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Test Empresas</h1>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 max-w-md">
        <input
          className="border rounded p-2"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Teléfono"
          value={form.telefono ?? ""}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Dirección"
          value={form.direccion ?? ""}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Crear Empresa
        </button>
      </form>

      {/* LISTA DE EMPRESAS */}
      <h2 className="text-lg font-medium mb-2">Empresas registradas:</h2>
      <ul className="space-y-2">
        {empresas.map((e) => (
          <li
            key={e.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <strong>{e.nombre}</strong> — {e.telefono || "sin teléfono"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => eliminarEmpresa(e.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* RESTAURAR EMPRESA */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">Restaurar empresa eliminada:</h3>
        <div className="flex gap-2">
          <input
            className="border rounded p-2"
            placeholder="ID de empresa"
            value={restaurarId}
            onChange={(e) => setRestaurarId(e.target.value)}
          />
          <button
            onClick={() => {
              if (!restaurarId) return;
              restaurarEmpresa(Number(restaurarId));
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

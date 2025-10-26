"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getUsuarios, deleteUsuario, restoreUsuario } from "../api/usuarios";
import { usuarioSchema } from "@/src/app/schemas/usuarioSchemas";
import { z } from "zod";
import { Table } from "../../components/Table";
import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<z.infer<typeof usuarioSchema>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      console.log("📊 Usuarios recibidos:", data);
      console.log("🔴 Usuarios INACTIVOS:", data.filter((u) => !u.activo));
      // Validar datos con el esquema
      const validatedData = data.map((item) => usuarioSchema.parse(item));
      setUsuarios(validatedData);
    } catch (err) {
      console.error(err);
      alert("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEdit = (usuario: z.infer<typeof usuarioSchema>) => {
    window.location.href = `/usuarios/editar/${usuario.id}`;
  };

  const handleDelete = async (usuario: z.infer<typeof usuarioSchema>) => {
    if (!confirm(`¿Seguro que quieres eliminar a ${usuario.primerNombre}?`)) return;

    try {
      await deleteUsuario(usuario.id);
      await fetchUsuarios();
      alert(`Usuario ${usuario.primerNombre} eliminado correctamente`);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el usuario");
    }
  };

  const handleRestore = async (usuario: z.infer<typeof usuarioSchema>) => {
    if (!confirm(`Restaurar a ${usuario.primerNombre}?`)) return;

    try {
      await restoreUsuario(usuario.id);
      await fetchUsuarios();
      alert(`Usuario ${usuario.primerNombre} restaurado correctamente`);
    } catch (error) {
      console.error(error);
      alert("Error al restaurar el usuario");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/usuarios/crear"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear usuario
            </Link>
            <button
              onClick={fetchUsuarios}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refrescar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <Table
          data={usuarios}
          columns={[
            { header: "ID", accessor: "id", sortable: true, width: 100 },
            {
              header: "Nombre Completo",
              accessor: (u) =>
                `${u.primerNombre} ${u.segundoNombre || ""} ${u.primerApellido} ${u.segundoApellido || ""}`
                  .replace(/\s+/g, " ")
                  .trim(),
              sortable: true,
              sortKey: "primerNombre",
              width: 250,
            },
            { header: "Cédula", accessor: "cedula", sortable: true, width: 150 },
            { header: "Email", accessor: "email", sortable: true, width: 250 },
            { header: "Rol", accessor: "rol", sortable: true, width: 150 },
            {
              header: "Estado",
              accessor: (u) => (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    u.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              ),
              sortable: true,
              sortKey: "activo",
              width: 120,
            },
          ]}
          actions={[
            {
              label: "Editar",
              icon: <Edit className="w-4 h-4" />,
              color: "blue",
              onClick: handleEdit,
            },
            {
              label: "Eliminar",
              icon: <Trash2 className="w-4 h-4" />,
              color: "red",
              onClick: handleDelete,
              hidden: (u) => !u.activo,
            },
            {
              label: "Restaurar",
              icon: <RefreshCw className="w-4 h-4" />,
              color: "green",
              onClick: handleRestore,
              hidden: (u) => u.activo,
            },
          ]}
          searchPlaceholder="Buscar por nombre, email o cédula..."
          pageSize={50}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
          emptyDescription="Agrega usuarios para comenzar a gestionar el sistema"
        />
      </div>
    </div>
  );
}
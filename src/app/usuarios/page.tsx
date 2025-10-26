"use client";

import React, { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario, restoreUsuario } from "../api/usuarios";
import { usuarioSchema } from "@/src/app/schemas/usuarioSchemas";
import { z } from "zod";
import { Table } from "../../components/Table";
import { Edit, Trash2, RefreshCw } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<z.infer<typeof usuarioSchema>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      console.log('📊 Usuarios recibidos:', data);
      console.log('🔴 Usuarios INACTIVOS:', data.filter(u => !u.activo));
      setUsuarios(data);
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
    // Opción 1: Redirigir a página de edición (Next.js)
    window.location.href = `/usuarios/editar/${usuario.id}`;
    
    // Opción 2: Si usas Next.js App Router con useRouter:
    // const router = useRouter();
    // router.push(`/usuarios/editar/${usuario.id}`);
    
    // Opción 3: Si usas un modal (temporal alert para probar)
    // alert(`Editar usuario: ${usuario.primerNombre} ${usuario.primerApellido}`);
  };

  const handleDelete = async (usuario: z.infer<typeof usuarioSchema>) => {
    if (!confirm(`¿Seguro que quieres eliminar a ${usuario.primerNombre}?`)) return;
    
    try {
      console.log('🗑️ Eliminando usuario...', usuario.id);
      await deleteUsuario(usuario.id);
      console.log('✅ Usuario eliminado, recargando...');
      await fetchUsuarios();
      console.log('✅ Datos recargados');
      alert(`Usuario ${usuario.primerNombre} eliminado correctamente`);
    } catch (error) {
      console.error('❌ Error al eliminar:', error);
      alert("Error al eliminar el usuario");
    }
  };

  const handleRestore = async (usuario: z.infer<typeof usuarioSchema>) => {
    if (!confirm(`¿Restaurar a ${usuario.primerNombre}?`)) return;
    
    try {
      console.log('♻️ Restaurando usuario...', usuario.id);
      await restoreUsuario(usuario.id);
      console.log('✅ Usuario restaurado, recargando...');
      await fetchUsuarios();
      console.log('✅ Datos recargados');
      alert(`Usuario ${usuario.primerNombre} restaurado correctamente`);
    } catch (error) {
      console.error('❌ Error al restaurar:', error);
      alert("Error al restaurar el usuario");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>

        {/* Tabla */}
        <Table
          data={usuarios}
          columns={[
            { header: "ID", accessor: "id", sortable: true },
            {
              header: "Nombre Completo",
              accessor: (u) =>
                `${u.primerNombre} ${u.segundoNombre || ""} ${u.primerApellido} ${
                  u.segundoApellido || ""
                }`.replace(/\s+/g, " "),
              sortable: true,
              sortKey: "primerNombre",
            },
            { header: "Cédula", accessor: "cedula", sortable: true },
            { header: "Email", accessor: "email", sortable: true },
            { header: "Rol", accessor: "rol", sortable: true },
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
          pageSize={10}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
          emptyDescription="Agrega usuarios para comenzar a gestionar el sistema"
        />
      </div>
    </div>
  );
}
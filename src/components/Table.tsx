"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, AlertCircle } from "lucide-react";
import { debounce } from "lodash";

type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: keyof T;
  width?: number;
};

type Action<T> = {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  color?: "blue" | "red" | "green" | "gray";
  hidden?: (row: T) => boolean;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
};

const colorClasses: Record<string, string> = {
  blue: "bg-blue-600 hover:bg-blue-700 text-white",
  red: "bg-red-600 hover:bg-red-700 text-white",
  green: "bg-green-600 hover:bg-green-700 text-white",
  gray: "bg-gray-600 hover:bg-gray-700 text-white",
};

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  searchPlaceholder = "Buscar...",
  pageSize = 10,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  emptyDescription = "Los registros aparecerán aquí cuando estén disponibles",
  className = "",
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  // Debounce búsqueda
  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    []
  );
  const handleSearch = (value: string) => {
    debouncedSearch(value);
    setPage(1);
  };

  // Filtrado
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor];
        return String(value).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columns]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    const key = sortConfig.key;
    const direction = sortConfig.direction;
    return filteredData.slice().sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      return (aVal < bVal ? -1 : 1) * (direction === "asc" ? 1 : -1);
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // Manejar ordenamiento
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const key = column.sortKey || (column.accessor as keyof T);
    setSortConfig((prev) => ({
      key,
      direction: prev.key !== key ? "asc" : prev.direction === "asc" ? "desc" : null,
    }));
  };

  // Icono de orden
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    const key = column.sortKey || (column.accessor as keyof T);
    if (sortConfig.key !== key) return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  // Cálculo del ancho total
  const totalWidth = useMemo(() => {
    const columnsWidth = columns.reduce((sum, col) => sum + (col.width || 150), 0);
    const actionsWidth = actions && actions.length > 0 ? Math.max(actions.length * 100, 150) : 0;
    return columnsWidth + actionsWidth;
  }, [columns, actions]);

  return (
    <div className={`space-y-4 ${className}`}>
      <style jsx>{`
        th, td {
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
      {/* Buscador */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            aria-label={searchPlaceholder}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Registros</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-white font-semibold text-lg">{sortedData.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : sortedData.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
              <p className="text-gray-400 text-sm mt-2">{emptyDescription}</p>
            </div>
          ) : (
            <>
              <table className="min-w-full" style={{ minWidth: `${totalWidth}px` }}>
                <thead>
                  <tr className="border-b border-gray-200">
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        onClick={() => handleSort(col)}
                        className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${
                          col.sortable ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
                        }`}
                        style={{ width: col.width || 150 }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{col.header}</span>
                          {getSortIcon(col)}
                        </div>
                      </th>
                    ))}
                    {actions && actions.length > 0 && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                        style={{ width: Math.max(actions.length * 100, 150) }}
                      >
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {columns.map((col, i) => (
                        <td
                          key={i}
                          className="px-4 py-3 text-sm text-gray-700"
                          style={{ width: col.width || 150 }}
                        >
                          {typeof col.accessor === "function"
                            ? col.accessor(row) ?? "N/A"
                            : String(row[col.accessor] ?? "N/A")}
                        </td>
                      ))}
                      {actions && actions.length > 0 && (
                        <td
                          className="px-4 py-3"
                          style={{ width: Math.max(actions.length * 100, 150) }}
                        >
                          <div className="flex gap-2">
                            {actions
                              .filter((action) => !action.hidden || !action.hidden(row))
                              .map((action, i) => (
                                <button
                                  key={i}
                                  onClick={() => action.onClick(row)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md ${
                                    colorClasses[action.color || "gray"]
                                  }`}
                                >
                                  {action.icon}
                                  <span className="hidden sm:inline">{action.label}</span>
                                </button>
                              ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Mostrando {(page - 1) * pageSize + 1} a{" "}
                    {Math.min(page * pageSize, sortedData.length)} de {sortedData.length} registros
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-600 px-3">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
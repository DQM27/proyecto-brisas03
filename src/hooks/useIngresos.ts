"use client";
import { useEffect, useState } from "react";
import { listarIngresos } from "@/src/app/api/ingresosApi";

export const useIngresos = () => {
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIngresos = async () => {
    try {
      const data = await listarIngresos();
      console.log("✅ Datos recibidos del backend:", data);
      setIngresos(data[0]); // <- primer valor del array [items, total]
    } catch (err) {
      console.error("❌ Error cargando ingresos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  return { ingresos, loading };
};

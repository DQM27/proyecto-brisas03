// frontend-next/src/hooks/useIngresos.ts
import { useState } from "react";
import { createIngresoSchema } from "@/src/app/schemas/ingresos.schema";
import { z } from "zod";
import api from "@/src/lib/axios";

export const useRegistrarIngreso = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrarIngreso = async (payload: z.infer<typeof createIngresoSchema>) => {
    setLoading(true);
    try {
      const { data } = await api.post("/ingresos", payload);
      return data;
    } catch (err) {
      console.error(err);
      setError("Error al registrar ingreso");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registrarIngreso, loading, error };
};

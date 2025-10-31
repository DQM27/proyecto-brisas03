// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  primerNombre: string;
  primerApellido: string;
  rol: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: payload.sub,
        email: payload.email,
        primerNombre: payload.primerNombre,
        primerApellido: payload.primerApellido,
        rol: payload.rol,
      });
    } catch {
      localStorage.removeItem("access_token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { user, loading };
};

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/src/hooks/useToast";
import { Loader2, Lock } from "lucide-react";
import { changePassword } from "../api/auth";
import { changePasswordSchema } from "../schemas/changePassword";

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      passwordActual: "",
      nuevaPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await changePassword(data);
      success("¡Contraseña cambiada con éxito!", 4000);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      error(err.message || "Error al cambiar contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-800">
            Cambiar Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="passwordActual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña Actual</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nuevaPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo 6 caracteres, 1 mayúscula y 1 número
                    </p>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Cambiando...
                  </>
                ) : (
                  "Actualizar Contraseña"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <a
              href="/dashboard"
              className="text-purple-600 hover:underline font-medium"
            >
              ← Volver al dashboard
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
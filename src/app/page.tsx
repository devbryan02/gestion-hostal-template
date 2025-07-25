"use client";

import { useState } from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full p-6 border rounded-lg shadow bg-white">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
            <Lock size={24} className="text-blue-600" />
            Hostal Gestión
          </h1>
          <p className="text-sm text-gray-600">
            Bienvenido al sistema de gestión del hostal. Administra reservas, huéspedes y más de forma segura y eficiente.
          </p>
        </div>
        <div className="mb-4 flex items-center justify-center text-blue-600">
          <Info className="mr-2" size={18} />
          <span className="text-xs">
            {showRegister
              ? "Completa el formulario para crear tu cuenta."
              : "Ingresa tus credenciales para acceder al panel."}
          </span>
        </div>
        {showRegister ? <RegisterForm /> : <LoginForm />}
        <div className="mt-4 flex justify-center">
          <Button
            variant="link"
            className="text-xs"
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </Button>
        </div>
        <div className="mt-6 text-xs text-center text-gray-400">
          &copy; {new Date().getFullYear()} Hostal Gestión. Todos los derechos reservados.
        </div>
      </div>
    </main>
  );
}
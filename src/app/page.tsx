"use client";

import { useState } from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { Building, Users, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-center relative z-10">
        {/* Left Side - Branding & Features */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Hostal Gestión
                </h1>
                <p className="text-sm text-gray-600 font-medium">Sistema de Administración Hotelera</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
              Administra reservas, huéspedes y operaciones de tu hostal de forma segura, eficiente y moderna.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:max-w-none">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-gray-800">Gestión de Huéspedes</h3>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-gray-800">Seguridad Avanzada</h3>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-gray-800">Reportes en Tiempo Real</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
            <CardContent className="p-8">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {showRegister ? "Crear Cuenta" : "Iniciar Sesión"}
                </h2>
                <p className="text-sm text-gray-600">
                  {showRegister
                    ? "Completa el formulario para crear tu cuenta."
                    : "Ingresa tus credenciales para acceder al panel."}
                </p>
              </div>

              {/* Form Component */}
              {showRegister ? <RegisterForm /> : <LoginForm />}

              {/* Toggle Form */}
              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium"
                  onClick={() => setShowRegister(!showRegister)}
                >
                  {showRegister
                    ? "¿Ya tienes cuenta? Inicia sesión"
                    : "¿No tienes cuenta? Regístrate"}
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                <p className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} Hostal Gestión. Todos los derechos reservados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
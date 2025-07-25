"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

function RegisterForm() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje('');
    
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setMensaje('error:' + error.message);
      setIsLoading(false);
    } else {
      setMensaje('success:Registro exitoso, revisa tu correo para verificar tu cuenta.');
      setIsLoading(false);
    }
  };

  const isError = mensaje.startsWith('error:');
  const isSuccess = mensaje.startsWith('success:');
  const cleanMessage = mensaje.replace(/^(error:|success:)/, '');

  return (
    <div className="space-y-5">
      <form onSubmit={handleRegister} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-sm font-semibold text-gray-700"
          >
            Correo Electrónico
          </Label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Input
              id="email"
              type="email"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="relative pl-11 h-12 bg-white/50 border-gray-200/50 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 rounded-lg"
            />
            <Mail className="absolute left-3.5 top-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" size={20} />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label 
            htmlFor="password" 
            className="text-sm font-semibold text-gray-700"
          >
            Contraseña
          </Label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="relative pl-11 pr-11 h-12 bg-white/50 border-gray-200/50 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 rounded-lg"
            />
            <Lock className="absolute left-3.5 top-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" size={20} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-blue-50 rounded-md"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? 
                <EyeOff size={18} className="text-gray-400 hover:text-blue-500" /> : 
                <Eye size={18} className="text-gray-400 hover:text-blue-500" />
              }
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Registrando...
            </div>
          ) : (
            "Crear Cuenta"
          )}
        </Button>
      </form>

      {/* Message Alert */}
      {mensaje && (
        <Alert className={`border-0 ${
          isError 
            ? 'bg-red-50/80 text-red-700' 
            : 'bg-green-50/80 text-green-700'
        }`}>
          <div className="flex items-center gap-2">
            {isError ? (
              <AlertCircle size={18} className="text-red-500" />
            ) : (
              <CheckCircle2 size={18} className="text-green-500" />
            )}
            <AlertDescription className="font-medium">
              {cleanMessage}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
}

export default RegisterForm;
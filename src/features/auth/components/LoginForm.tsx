"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="space-y-5">
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
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            autoFocus
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
            onKeyPress={handleKeyPress}
            disabled={isLoading}
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
      
      {/* Error Message */}
      {errorMsg && (
        <Alert className="border-0 bg-red-50/80 text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            <AlertDescription className="font-medium">
              {errorMsg}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleLogin}
        disabled={isLoading || !email || !password}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Ingresando...
          </div>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </div>
  );
}

export default LoginForm;
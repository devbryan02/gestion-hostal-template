"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Info } from "lucide-react";

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
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="usuario@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            autoFocus
            className="pl-10"
          />
          <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="pl-10 pr-10"
          />
          <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <Info size={14} /> ¿Olvidaste tu contraseña? Contacta al administrador.
      </div>
      {errorMsg && (
        <div className="text-red-500 text-sm flex items-center">
          <Info className="mr-1" size={16} /> {errorMsg}
        </div>
      )}
      <Button
        onClick={handleLogin}
        disabled={isLoading || !email || !password}
        className="w-full"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </Button>
    </div>
  );
}

export default LoginForm;
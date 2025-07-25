import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      setMensaje('⚠️ ' + error.message);
      setIsLoading(false);
    } else {
      setMensaje('✅ Registro exitoso, revisa tu correo para verificar tu cuenta.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-center">Registro de usuario</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="usuario@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              required
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
              disabled={isLoading}
              required
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
        <Button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
      {mensaje && (
        <div className={`text-sm flex items-center gap-1 ${mensaje.startsWith('⚠️') ? 'text-red-500' : 'text-green-600'}`}>
          <Info size={16} /> {mensaje}
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
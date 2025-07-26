"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  User, 
  LogOut, 
  Home, 
  BedDouble, 
  Users, 
  ClipboardList,
  X,
  ChevronDown
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/constants/constants";

const sidebarItems = [
  { href: "/dashboard", icon: <Home size={18} />, label: "Panel" },
  { href: "/dashboard/habitaciones", icon: <BedDouble size={18} />, label: "Habitaciones" },
  { href: "/dashboard/inquilinos", icon: <Users size={18} />, label: "Inquilinos" },
  { href: "/dashboard/ocupaciones", icon: <ClipboardList size={18} />, label: "Ocupaciones" },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [emailUser, setEmailUser] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        window.location.href = '/';
      } else {
        setEmailUser(user.email ? user.email : '');
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
          {/* Logo y Menu Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {APP_NAME}
                </h1>
                <p className="text-xs text-gray-500">Sistema de Administración</p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 px-3 py-2 rounded-lg border border-gray-200/50 transition-all duration-200"
            >
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{emailUser}</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200/50 py-1 z-50">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut size={14} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-60 bg-white/80 backdrop-blur-xl border-r border-gray-200/50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-xl lg:shadow-none
        `}>
          {/* Sidebar Header - Solo en mobile */}
          <div className="lg:hidden p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Hostal Gestión
                </h2>
                <p className="text-xs text-gray-500">Sistema de Administración</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Navegación
              </h3>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium relative overflow-hidden mb-1 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <div className={`p-1.5 rounded-md transition-colors duration-200 ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="flex-1 text-sm">{item.label}</span>
                    </div>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-60px)]">
          <div className="h-full">
            <div className="h-full bg-white/60 p-4 sm:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
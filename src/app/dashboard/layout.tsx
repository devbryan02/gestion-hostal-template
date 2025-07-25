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

const sidebarItems = [
  { href: "/dashboard", icon: <Home size={20} />, label: "Panel" },
  { href: "/dashboard/habitaciones", icon: <BedDouble size={20} />, label: "Habitaciones" },
  { href: "/dashboard/inquilinos", icon: <Users size={20} />, label: "Inquilinos" },
  { href: "/dashboard/ocupaciones", icon: <ClipboardList size={20} />, label: "Ocupaciones" },
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
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo y Menu Mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Hostal Gestión
                </h1>
                <p className="text-xs text-gray-500 font-medium">Sistema de Administración</p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 px-4 py-2.5 rounded-xl border border-gray-200/50 transition-all duration-200 shadow-sm"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800">Administrador</p>
                <p className="text-xs text-gray-500">{emailUser}</p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200/50 py-2 z-50">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut size={16} />
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
          w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-xl lg:shadow-none
        `}>
          {/* Sidebar Header - Solo en mobile */}
          <div className="lg:hidden p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Home size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Hostal Gestión
                </h2>
                <p className="text-xs text-gray-500">Sistema de Administración</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Navegación Principal
              </h3>
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-4 w-full">
                      <div className={`p-2 rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="flex-1">{item.label}</span>
                    </div>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80" />
                    )}
                    {/* Hover effect for non-active items */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          <div className="h-full ">
            <div className="h-full bg-white/60 p-6 sm:p-8 lg:p-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
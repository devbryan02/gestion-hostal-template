"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTenantContext } from "@/context/TenantContext";
import { useState } from "react";
import { Search, TrendingUp, Users } from "lucide-react";

function TenantFilters() {
  const { searchTenants, fetchTenants, fetchRecurrentTenants, isRecurrentView } = useTenantContext();
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    searchTenants(value);
  };

  const handleToggleView = () => {
    if (isRecurrentView) {
      fetchTenants();
    } else {
      fetchRecurrentTenants();
    }
    setSearchText(""); // Limpiar búsqueda al cambiar vista
  };

  return (
    <div className="flex gap-3 items-center mb-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar inquilino..."
          value={searchText}
          onChange={handleSearchChange}
          className="pl-10 pr-3 py-2 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      
      <Button
        onClick={handleToggleView}
        variant={isRecurrentView ? "default" : "outline"}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isRecurrentView 
            ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700" 
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
      >
        {isRecurrentView ? (
          <>
            <Users className="w-4 h-4" />
            Ver Todos
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4" />
            Más Recurrentes
          </>
        )}
      </Button>
    </div>
  );
}

export default TenantFilters;

"use client";

import TenantCard from "./TenantCard";
import { User2, SearchX } from "lucide-react";
import { useTenantContext } from "@/context/TenantContext";

function TenantsList() {
  const { tenants, loading, error } = useTenantContext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg"></span>
        <h3 className="text-xl font-semibold text-base-content mt-4">
          Cargando inquilinos...
        </h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <SearchX className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-500 mb-2">
          Error al cargar inquilinos
        </h3>
        <p className="text-gray-500 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User2 className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No se encontraron inquilinos
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          No hay inquilinos registrados o ninguno coincide con los criterios de
          búsqueda.
        </p>
        <button className="btn btn-primary btn-sm gap-2 mt-4">
          <User2 className="w-4 h-4" />
          Registrar primer inquilino
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </div>
    </div>
  );
}

export default TenantsList;
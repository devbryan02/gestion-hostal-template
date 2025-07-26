"use client";

import OcupationCard from "./OcupationCard";
import { BedDouble, SearchX } from "lucide-react";
import { useOcupationContext } from "@/context/OcupationContext";

function OcupationsList() {
  const { occupations, loading, error } = useOcupationContext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg"></span>
        <h3 className="text-xl font-semibold text-base-content mt-4">
          Cargando ocupaciones...
        </h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-4">
          <SearchX className="w-10 h-10 text-error" />
        </div>
        <h3 className="text-xl font-semibold text-error mb-2">
          Error al cargar ocupaciones
        </h3>
        <p className="text-base-content/60 text-center max-w-md">
          {error}
        </p>
      </div>
    );
  }

  if (occupations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
          <BedDouble className="w-10 h-10 text-base-content/40" />
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          No se encontraron ocupaciones
        </h3>
        <p className="text-base-content/60 text-center max-w-md">
          No hay ocupaciones registradas o ninguna coincide con los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {occupations.map((occupation) => (
          <OcupationCard key={occupation.id} occupation={occupation} />
        ))}
      </div>
    </div>
  );
}

export default OcupationsList;
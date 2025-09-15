"use client";

import { StatsProvider } from "@/context/StatsContext";
import { useStatsContext } from "@/context/StatsContext";
import { StatsCards } from "./StatsCards";
import { StatsChart } from "./StatsChart";
import { Loader2, AlertTriangle, BarChart3 } from "lucide-react";
import { DashboardLoading } from "./DashboardLoading";

export function DashboardContent() {
  const { loading, error } = useStatsContext();

  return (
    <div className="space-y-8">
      {/* Título y descripción siempre visibles */}
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-8 h-8 text-indigo-700" />
        <h1 className="text-2xl font-bold tracking-tight">
          Panel de Estadísticas
        </h1>
      </div>
      <p className="text-gray-500 mb-6">
        Visualiza el estado general del hostal, ocupaciones y métricas clave en tiempo real.
      </p>

      {/* Loading/Error/Contenido */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <DashboardLoading />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertTriangle className="w-10 h-10 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error al cargar estadísticas</h3>
          <p className="text-gray-500 text-center max-w-md">{error}</p>
        </div>
      ) : (
        <>
          <StatsCards />
          <StatsChart />
        </>
      )}
    </div>
  );
}

export default function DashboardClient() {
  return (
    <StatsProvider>
      <DashboardContent />
    </StatsProvider>
  );
}
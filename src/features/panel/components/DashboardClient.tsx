"use client";

import { StatsProvider } from "@/context/StatsContext";
import { useStatsContext } from "@/context/StatsContext";
import { StatsCards } from "./StatsCards";
import { StatsChart } from "./StatsChart";
import { Loader2, AlertTriangle } from "lucide-react";

export function DashboardContent() {
  const { loading, error } = useStatsContext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <h3 className="text-xl font-semibold text-indigo-700">Cargando estadísticas...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertTriangle className="w-10 h-10 text-red-600 mb-4" />
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error al cargar estadísticas</h3>
        <p className="text-gray-500 text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StatsCards />
      <StatsChart />
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
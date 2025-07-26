import { Loader2 } from "lucide-react";

export function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
      <h3 className="text-xl font-semibold text-indigo-700">Cargando estadísticas...</h3>
    </div>
  );
}
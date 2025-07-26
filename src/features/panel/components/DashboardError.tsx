import { AlertTriangle } from "lucide-react";

interface DashboardErrorProps {
  error: string;
}

export function DashboardError({ error }: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertTriangle className="w-10 h-10 text-red-600 mb-4" />
      <h3 className="text-xl font-semibold text-red-600 mb-2">Error al cargar estadísticas</h3>
      <p className="text-gray-500 text-center max-w-md">{error}</p>
    </div>
  );
}
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatsService } from "../service/StatsService";
import { DashboardStats } from "@/types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error desconocido";
}

export function useStats() {
  // Estado para manejar estadísticas, loading y error
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalTenants: 0,
    activeOccupations: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Instancia del servicio de estadísticas
  const statsService = useMemo(() => new StatsService(), []);

  // Función para obtener estadísticas
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statsService.fetchStats();
      setStats(data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statsService]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
}
import { createClient } from "@/lib/supabase/client";
import { DashboardStats } from "@/types/index";

const supabase = createClient();

// Tipos explícitos para cada entidad
type RoomStatus = "available" | "occupied" | "maintenance" | string;
type Room = { status: RoomStatus };
type Tenant = { id: string };
type OccupationRevenue = {
  total_amount: number | null;
  check_out_date: string | null;
  planned_check_out: string | null;
  status: "active" | "completed" | string;
};

export class StatsService {
  // Obtiene las estadísticas principales del dashboard
  async fetchStats(): Promise<DashboardStats> {
    // 1. Habitaciones
    const { data: roomsData, error: roomsError } = await supabase
      .from("rooms")
      .select("status");

    if (roomsError) throw new Error(`Error fetching rooms: ${roomsError.message}`);

    const rooms = (roomsData ?? []) as Room[];
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const availableRooms = rooms.filter((r) => r.status === "available").length;

    // 2. Inquilinos
    const { data: tenantsData, error: tenantsError } = await supabase
      .from("tenants")
      .select("id");

    if (tenantsError) throw new Error(`Error fetching tenants: ${tenantsError.message}`);

    const tenants = (tenantsData ?? []) as Tenant[];
    const totalTenants = tenants.length;

    // 3. Ocupaciones activas
    const { data: activeOccupationsData, error: occError } = await supabase
      .from("occupations")
      .select("id")
      .eq("status", "active");

    if (occError) throw new Error(`Error fetching occupations: ${occError.message}`);

    const activeOccupations = (activeOccupationsData ?? []) as { id: string }[];
    const activeOccupationsCount = activeOccupations.length;

    // 4. Ingresos del mes actual y anterior
    const { data: revenueData, error: revenueError } = await supabase
      .from("occupations")
      .select("total_amount, check_out_date, planned_check_out, status");

    if (revenueError) throw new Error(`Error fetching revenue: ${revenueError.message}`);

    const revenues = (revenueData ?? []) as OccupationRevenue[];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Ingresos del mes actual (por check_out_date o planned_check_out)
    const monthlyRevenue =
      revenues
        .filter((occ) => {
          const date = new Date(occ.check_out_date || occ.planned_check_out || "");
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear &&
            ["active", "completed"].includes(occ.status)
          );
        })
        .reduce((sum, occ) => sum + (occ.total_amount || 0), 0) || 0;

    // Ingresos del mes anterior
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const previousMonthlyRevenue =
      revenues
        .filter((occ) => {
          const date = new Date(occ.check_out_date || occ.planned_check_out || "");
          return (
            date.getMonth() === previousMonth &&
            date.getFullYear() === previousYear &&
            ["active", "completed"].includes(occ.status)
          );
        })
        .reduce((sum, occ) => sum + (occ.total_amount || 0), 0) || 0;

    // 5. Ingresos mensuales para el gráfico
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthlyRevenues = months.map((mes, idx) => {
      const ingresos = revenues
        .filter((occ) => {
          const date = new Date(occ.check_out_date || occ.planned_check_out || "");
          return (
            date.getMonth() === idx &&
            date.getFullYear() === currentYear &&
            ["active", "completed"].includes(occ.status)
          );
        })
        .reduce((sum, occ) => sum + (occ.total_amount || 0), 0) || 0;
      return { mes, ingresos };
    });

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalTenants,
      activeOccupations: activeOccupationsCount,
      monthlyRevenue,
      previousMonthlyRevenue,
      monthlyRevenues,
    };
  }
}
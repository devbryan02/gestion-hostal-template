import { createClient } from "@/lib/supabase/client";
import { DashboardStats } from "@/types/index";

const supabase = createClient();

export class StatsService {
  // Obtiene las estadísticas principales del dashboard
  async fetchStats(): Promise<DashboardStats> {
    // 1. Habitaciones
    const { data: roomsData, error: roomsError } = await supabase
      .from("rooms")
      .select("status");

    if (roomsError) throw new Error(`Error fetching rooms: ${roomsError.message}`);

    const totalRooms = roomsData?.length || 0;
    const occupiedRooms = roomsData?.filter((r: any) => r.status === "occupied").length || 0;
    const availableRooms = roomsData?.filter((r: any) => r.status === "available").length || 0;

    // 2. Inquilinos
    const { data: tenantsData, error: tenantsError } = await supabase
      .from("tenants")
      .select("id");

    if (tenantsError) throw new Error(`Error fetching tenants: ${tenantsError.message}`);

    const totalTenants = tenantsData?.length || 0;

    // 3. Ocupaciones activas
    const { data: activeOccupationsData, error: occError } = await supabase
      .from("occupations")
      .select("id")
      .eq("status", "active");

    if (occError) throw new Error(`Error fetching occupations: ${occError.message}`);

    const activeOccupations = activeOccupationsData?.length || 0;

    // 4. Ingresos del mes actual y anterior
    const { data: revenueData, error: revenueError } = await supabase
      .from("occupations")
      .select("total_amount, check_out_date, planned_check_out, status");

    if (revenueError) throw new Error(`Error fetching revenue: ${revenueError.message}`);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Ingresos del mes actual (por check_out_date o planned_check_out)
    const monthlyRevenue =
      revenueData?.filter((occ: any) => {
        const date = new Date(occ.check_out_date || occ.planned_check_out);
        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear &&
          ["active", "completed"].includes(occ.status)
        );
      }).reduce((sum: number, occ: any) => sum + (occ.total_amount || 0), 0) || 0;

    // Ingresos del mes anterior
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const previousMonthlyRevenue =
      revenueData?.filter((occ: any) => {
        const date = new Date(occ.check_out_date || occ.planned_check_out);
        return (
          date.getMonth() === previousMonth &&
          date.getFullYear() === previousYear &&
          ["active", "completed"].includes(occ.status)
        );
      }).reduce((sum: number, occ: any) => sum + (occ.total_amount || 0), 0) || 0;

    // 5. Ingresos mensuales para el gráfico
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthlyRevenues = months.map((mes, idx) => {
      const ingresos = revenueData
        ?.filter((occ: any) => {
          const date = new Date(occ.check_out_date || occ.planned_check_out);
          return (
            date.getMonth() === idx &&
            date.getFullYear() === currentYear &&
            ["active", "completed"].includes(occ.status)
          );
        })
        .reduce((sum: number, occ: any) => sum + (occ.total_amount || 0), 0) || 0;
      return { mes, ingresos };
    });

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalTenants,
      activeOccupations,
      monthlyRevenue,
      previousMonthlyRevenue,
      monthlyRevenues,
    };
  }
}
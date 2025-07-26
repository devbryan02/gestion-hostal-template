import { createClient } from "@/lib/supabase/client";
import { DashboardStats, RoomStatus, OccupationStatus } from "@/types/index";

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

    // 4. Ingresos del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: revenueData, error: revenueError } = await supabase
      .from("occupations")
      .select("total_amount")
      .gte("created_at", startOfMonth.toISOString())
      .in("status", ["active", "completed"]);

    if (revenueError) throw new Error(`Error fetching revenue: ${revenueError.message}`);

    const monthlyRevenue =
      revenueData?.reduce((sum: number, occ: any) => sum + (occ.total_amount || 0), 0) || 0;

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalTenants,
      activeOccupations,
      monthlyRevenue,
    };
  }
}
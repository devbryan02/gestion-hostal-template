import {
  BedDouble,
  BedSingle,
  Users,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatsContext } from "@/context/StatsContext";

export function StatsCards() {
  const { stats } = useStatsContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Habitaciones Totales</CardTitle>
          <BedDouble className="w-6 h-6 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.totalRooms}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Habitaciones Ocupadas</CardTitle>
          <BedSingle className="w-6 h-6 text-red-600" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.occupiedRooms}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Habitaciones Disponibles</CardTitle>
          <BedSingle className="w-6 h-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.availableRooms}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Inquilinos Totales</CardTitle>
          <Users className="w-6 h-6 text-blue-600" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.totalTenants}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Ocupaciones Activas</CardTitle>
          <UserCheck className="w-6 h-6 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.activeOccupations}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          <DollarSign className="w-6 h-6 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">
            S/ {stats.monthlyRevenue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
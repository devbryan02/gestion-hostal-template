import {
  BedDouble,
  BedSingle,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatsContext } from "@/context/StatsContext";

export function StatsCards() {
  const { stats } = useStatsContext();

  // Función para calcular el porcentaje de cambio
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) {
      if (current > 0) return 100;
      return 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const porcentajeCambio = calculatePercentageChange(
    stats.monthlyRevenue,
    stats.previousMonthlyRevenue
  );

  const cardData = [
    {
      title: "Habitaciones Totales",
      value: stats.totalRooms,
      icon: BedDouble,
      gradient: "from-slate-600 to-slate-800",
      bgGradient: "from-slate-50 to-slate-100",
      iconBg: "bg-slate-100",
      textColor: "text-slate-600",
      ringColor: "ring-slate-200",
    },
    {
      title: "Habitaciones Ocupadas",
      value: stats.occupiedRooms,
      icon: BedSingle,
      gradient: "from-rose-500 to-rose-700",
      bgGradient: "from-rose-50 to-rose-100",
      iconBg: "bg-rose-100",
      textColor: "text-rose-600",
      ringColor: "ring-rose-200",
    },
    {
      title: "Habitaciones Disponibles",
      value: stats.availableRooms,
      icon: BedSingle,
      gradient: "from-emerald-500 to-emerald-700",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
      ringColor: "ring-emerald-200",
    },
    {
      title: "Inquilinos Totales",
      value: stats.totalTenants,
      icon: Users,
      gradient: "from-blue-500 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      ringColor: "ring-blue-200",
    },
    {
      title: "Ocupaciones Activas",
      value: stats.activeOccupations,
      icon: UserCheck,
      gradient: "from-amber-500 to-amber-700",
      bgGradient: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
      ringColor: "ring-amber-200",
    },
    {
      title: "Ingresos del Mes",
      value: `S/ ${stats.monthlyRevenue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: "from-green-500 to-green-700",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "bg-green-100",
      textColor: "text-green-600",
      ringColor: "ring-green-200",
      showTrend: true,
      trendValue: porcentajeCambio, // <-- Agrega esto
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card 
            key={index}
            className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white backdrop-blur-sm ring-1 ${card.ringColor} hover:ring-2`}
          >
            {/* Premium gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-30`} />
            
            {/* Animated gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <div>
                <CardTitle className="text-xs font-bold text-gray-500 tracking-wide uppercase">
                  {card.title}
                </CardTitle>
              </div>
              <div className={`${card.iconBg} p-2 rounded-xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-1 ring-white/50`}>
                <IconComponent className={`w-5 h-5 ${card.textColor} group-hover:scale-110 transition-transform duration-300`} />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 pb-4 relative z-10">
              <div className="space-y-2">
                <span className={`text-2xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                  {card.value}
                </span>
                
                {card.showTrend && (
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      <span className="font-bold">{card.trendValue}%</span>
                    </div>
                    <span className="text-gray-500 font-medium">vs anterior</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* Premium corner accent */}
            <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl ${card.gradient} opacity-10 rounded-bl-full`} />
          </Card>
        );
      })}
    </div>
  );
}
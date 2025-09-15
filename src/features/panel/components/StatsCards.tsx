import {
  BedDouble,
  BedSingle,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
} from "lucide-react";
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
      dot: "bg-slate-500",
      label: "Total"
    },
    {
      title: "Habitaciones Ocupadas",
      value: stats.occupiedRooms,
      icon: BedSingle,
      dot: "bg-red-500",
      label: "Ocupadas"
    },
    {
      title: "Habitaciones Disponibles",
      value: stats.availableRooms,
      icon: BedSingle,
      dot: "bg-green-500",
      label: "Disponibles"
    },
    {
      title: "Inquilinos Totales",
      value: stats.totalTenants,
      icon: Users,
      dot: "bg-blue-500",
      label: "Inquilinos"
    },
    {
      title: "Ocupaciones Activas",
      value: stats.activeOccupations,
      icon: UserCheck,
      dot: "bg-orange-500",
      label: "Activas"
    },
    {
      title: "Ingresos del Mes",
      value: `S/ ${stats.monthlyRevenue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      dot: "bg-emerald-500",
      label: "Ingresos",
      showTrend: true,
      trendValue: porcentajeCambio,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={index}
            className="group relative bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Línea de color superior */}
            <div className={`h-1 w-full ${card.dot}`} />
            
            <div className="p-5">
              {/* Header: Ícono + Título + Acciones */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {card.label}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge de categoría */}
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                    Stats
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {card.title}
                </p>
                {card.showTrend && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium text-emerald-700">
                        +{card.trendValue}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">vs anterior</span>
                  </div>
                )}
              </div>

              {/* Valor principal */}
              <div className="flex items-end justify-between">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Valor
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
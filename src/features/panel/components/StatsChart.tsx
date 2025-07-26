"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { CalendarCheck } from "lucide-react";
import { useStatsContext } from "@/context/StatsContext";

export function StatsChart() {
  const { stats } = useStatsContext();

  // Simulamos un solo mes, pero puedes expandir esto si tienes más datos históricos
// Suponiendo que stats.monthlyRevenue es solo para el mes actual,
// y no tienes datos de meses anteriores, puedes mostrar los últimos tres meses
// con 0 en los meses sin datos.
const currentMonth = new Date().getMonth();
const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const chartData = [
    {
        name: months[(currentMonth + 10) % 12], // Hace dos meses
        Ingresos: 0,
    },
    {
        name: months[(currentMonth + 11) % 12], // Mes pasado
        Ingresos: 0,
    },
    {
        name: months[currentMonth], // Mes actual
        Ingresos: stats.monthlyRevenue,
    },
];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-indigo-600" />
          Ingresos del mes actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
                }
              />
              <Bar dataKey="Ingresos" fill="#059669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
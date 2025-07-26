"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceDot,
} from "recharts";
import { CalendarCheck, Trophy } from "lucide-react";
import { useStatsContext } from "@/context/StatsContext";

export function StatsChart() {
  const { stats } = useStatsContext();
  const chartData = stats.monthlyRevenues ?? [];

  // Calcular el mes con más ingresos
  const maxIngreso = Math.max(...chartData.map((d) => d.ingresos ?? 0));
  const mesMaxIngreso = chartData.find((d) => d.ingresos === maxIngreso);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Radar Chart de Ingresos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            Ingresos mensuales del año
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="mes" tick={{ fontSize: 13 }} />
                <Tooltip
                  formatter={(value: number) =>
                    `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
                  }
                  labelClassName="font-bold"
                  contentStyle={{
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Radar
                  name="Ingresos"
                  dataKey="ingresos"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Segundo Chart: AreaChart solo de ingresos, resaltando el mes con más ingresos */}
      <Card>
        <CardHeader className="flex flex-col items-start justify-between pb-2 gap-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-base font-bold">Mes con más ingresos</span>
          </div>
          {mesMaxIngreso && (
            <div className="flex items-center gap-2 text-sm mt-1 bg-emerald-50 px-2 py-1 rounded font-semibold text-emerald-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="font-bold">{mesMaxIngreso.mes}</span>
              <span>
                (S/ {mesMaxIngreso.ingresos.toLocaleString("es-PE", { minimumFractionDigits: 2 })})
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 13 }} />
                <YAxis
                  tickFormatter={(value) => `S/ ${value.toLocaleString("es-PE")}`}
                  tick={{ fontSize: 13 }}
                  label={{
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fontSize: 12 },
                  }}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
                  }
                  labelClassName="font-bold"
                  contentStyle={{
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  name="Ingresos"
                  stroke="#059669"
                  fill="#bbf7d0"
                  fillOpacity={0.5}
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#059669" }}
                  activeDot={{
                    r: 7,
                    fill: "#059669",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                {/* Resalta el mes con más ingresos */}
                {mesMaxIngreso && (
                  <ReferenceDot
                    x={mesMaxIngreso.mes}
                    y={mesMaxIngreso.ingresos}
                    r={10}
                    fill="#f59e42"
                    stroke="#059669"
                    strokeWidth={3}
                    label={{
                      value: "Máx. ingresos",
                      position: "top",
                      fill: "#f59e42",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
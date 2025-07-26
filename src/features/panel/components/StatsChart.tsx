"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { CalendarCheck } from "lucide-react";
import { useStatsContext } from "@/context/StatsContext";

export function StatsChart() {
  const { stats } = useStatsContext();
  const chartData = stats.monthlyRevenues ?? [];

  return (
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 13 }} />
              <YAxis
                tickFormatter={value => `S/ ${value.toLocaleString("es-PE")}`}
                tick={{ fontSize: 13 }}
              />
              <Tooltip
                formatter={(value: number) =>
                  `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
                }
                labelClassName="font-bold"
                contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="ingresos" fill="#059669" radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="ingresos"
                  position="top"
                  formatter={(label: React.ReactNode) => {
                    if (typeof label === "number") {
                      return `S/ ${label.toLocaleString("es-PE", { minimumFractionDigits: 0 })}`;
                    }
                    return label;
                  }}
                  style={{ fontWeight: 700, fontSize: 12, fill: "#059669" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
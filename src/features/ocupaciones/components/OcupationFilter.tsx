"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useOcupationContext } from "@/context/OcupationContext";
import { useState } from "react";
import { OccupationStatus } from "@/types";
import { Filter } from "lucide-react";

function OcupationFilter() {
  const { fetchOccupations, filterByStatus } = useOcupationContext();
  const [status, setStatus] = useState<OccupationStatus | "all">("all");

  const handleStatusChange = (value: OccupationStatus | "all") => {
    setStatus(value);
    if (value === "all") {
      fetchOccupations();
    } else {
      filterByStatus(value as OccupationStatus);
    }
  };

  return (
    <div className="flex gap-2 items-center mb-3 bg-white border border-gray-200 rounded-xl shadow px-3 py-2">
      <div className="relative min-w-[160px]">
        <Filter className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="pl-8 pr-2 py-2 bg-gray-50 border-gray-200 text-gray-900 rounded-md text-sm">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
            <SelectItem value="canceled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default OcupationFilter;
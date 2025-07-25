"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRoomContext } from "@/context/RoomContext";
import { useState } from "react";
import { RoomStatus } from "@/types";
import { Search, Filter } from "lucide-react";

export const RoomFilters = () => {
  const { searchRooms, filterByStatus } = useRoomContext();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<RoomStatus | undefined>(undefined);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    searchRooms(value);
  };

  const handleStatusChange = (value: RoomStatus) => {
    setStatus(value);
    filterByStatus(value);
  };

  return (
    <div className="flex gap-2 items-center mb-3 bg-white border border-gray-200 rounded-xl shadow px-3 py-2">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar habitación..."
          value={searchText}
          onChange={handleSearchChange}
          className="pl-8 pr-2 py-2 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-md text-sm"
        />
      </div>
      <div className="relative min-w-[140px]">
        <Filter className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="pl-8 pr-2 py-2 bg-gray-50 border-gray-200 text-gray-900 rounded-md text-sm">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="occupied">Ocupado</SelectItem>
            <SelectItem value="maintenance">Mantenimiento</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

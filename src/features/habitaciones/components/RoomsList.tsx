"use client";

import { RoomCard } from "./RoomCard";
import { BedDouble, SearchX } from "lucide-react";
import { useRoomContext } from "@/context/RoomContext";

interface RoomsListProps {
  onOccupy?: (roomId: string) => void;
}

export function RoomsList({ onOccupy }: RoomsListProps) {
  const { rooms, loading, error } = useRoomContext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg"></span>
        <h3 className="text-xl font-semibold text-base-content mt-4">
          Cargando habitaciones...
        </h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-4">
          <SearchX className="w-10 h-10 text-error" />
        </div>
        <h3 className="text-xl font-semibold text-error mb-2">
          Error al cargar habitaciones
        </h3>
        <p className="text-base-content/60 text-center max-w-md">
          {error}
        </p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
          <BedDouble className="w-10 h-10 text-base-content/40" />
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          No se encontraron habitaciones
        </h3>
        <p className="text-base-content/60 text-center max-w-md">
          No hay habitaciones registradas o ninguna coincide con los criterios de búsqueda.
        </p>
        <button className="btn btn-primary btn-sm gap-2 mt-4">
          <BedDouble className="w-4 h-4" />
          Registrar primera habitación
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onOccupy={onOccupy}
          />
        ))}
      </div>
    </div>
  );
}

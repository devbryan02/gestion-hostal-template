"use client";

import { Room } from "@/types";
import { BedDouble, Edit, Trash2, MoreHorizontal, Calendar, DollarSign, Info } from "lucide-react";
import { useState } from "react";
import { useRoomContext } from "@/context/RoomContext";
import { EditRoomModal } from "./EditRoomModal";

export interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const { deleteRoom } = useRoomContext();

  const formattedCreated = new Date(room.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const openEditModal = () => {
    setSelectedRoom(room);
    setEditModalOpen(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <BedDouble className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900">Hab. {room.number}</h2>
              <span className="inline-block bg-gray-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded mt-1">{room.type}</span>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              onClick={e => {
                const next = e.currentTarget.nextSibling as HTMLElement | null;
                next?.classList.toggle("hidden");
              }}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 hidden z-10">
              <li>
                <button
                  onClick={openEditModal}
                  className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 hover:bg-gray-50 transition"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </li>
              <li>
                <button
                  onClick={() => deleteRoom(room.id)}
                  className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Room Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-400">Estado</p>
              <p className="text-sm font-medium capitalize text-gray-900">{room.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Precio por noche</p>
              <p className="text-sm font-medium text-gray-900">S/ {room.price_per_night}</p>
            </div>
          </div>
        </div>

        <div className="border-t my-4"></div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1">Descripción</p>
          <p className="text-sm text-gray-700">
            {room.description ? room.description : <span className="text-red-500">Sin descripción</span>}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span
            className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded
              ${room.status === "available"
                ? "bg-green-100 text-green-700"
                : room.status === "occupied"
                  ? "bg-red-100 text-red-700"
                  : room.status === "maintenance"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
              }
            `}
          >
            <div
              className={`w-2 h-2 rounded-full
          ${room.status === "available"
                  ? "bg-green-700"
                  : room.status === "occupied"
                    ? "bg-red-700"
                    : room.status === "maintenance"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }
              `}
            ></div>
            {
              room.status === "available"
                ? "Disponible"
                : room.status === "occupied"
                  ? "Ocupada"
                  : room.status === "maintenance"
                    ? "Mantenimiento"
                    : room.status
            }
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formattedCreated}
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        room={selectedRoom}
      />
    </div>
  );
}

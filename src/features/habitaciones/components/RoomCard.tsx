"use client";

import { RoomWithTenant, Room } from "@/types";
import { BedDouble, Edit, Trash2, MoreHorizontal, Calendar, DollarSign, Info, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRoomContext } from "@/context/RoomContext";
import { EditRoomModal } from "./EditRoomModal";

export interface RoomCardProps {
  room: RoomWithTenant;
  onOccupy?: (roomId: string) => void;
}

export function RoomCard({ room, onOccupy }: RoomCardProps) {
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <BedDouble className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Hab. {room.number}</h2>
              <span className="inline-block bg-gray-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded mt-0.5">{room.type}</span>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              className="p-1.5 rounded-full hover:bg-gray-100 transition"
              onClick={e => {
                const next = e.currentTarget.nextSibling as HTMLElement | null;
                next?.classList.toggle("hidden");
              }}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
            <ul className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden z-10">
              <li>
                <button
                  onClick={openEditModal}
                  className="flex items-center gap-2 px-3 py-1.5 w-full text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Editar
                </button>
              </li>
              {onOccupy && room.status === 'available' && (
                <li>
                  <button
                    onClick={() => onOccupy(room.id)}
                    className="flex items-center gap-2 px-3 py-1.5 w-full text-sm text-blue-600 hover:bg-blue-50 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Ocupar
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => deleteRoom(room.id)}
                  className="flex items-center gap-2 px-3 py-1.5 w-full text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Room Info */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-400">Estado</p>
              <p className="text-sm font-medium capitalize text-gray-900">{room.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Precio/noche</p>
              <p className="text-sm font-medium text-gray-900">S/ {room.price_per_night}</p>
            </div>
          </div>
        </div>

        {/* Inquilino info - solo cuando está ocupada */}
        {room.status === 'occupied' && room.current_tenant && (
          <div className="mb-3">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Inquilino actual</p>
                <p className="text-sm font-semibold text-blue-900">{room.current_tenant.name}</p>
                <p className="text-xs text-blue-700">Doc: {room.current_tenant.document_number}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t my-3"></div>

        {/* Description */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Descripción</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {room.description ? room.description : <span className="text-red-500">Sin descripción</span>}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
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
              className={`w-1.5 h-1.5 rounded-full
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
            <Calendar className="w-3.5 h-3.5" />
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
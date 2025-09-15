"use client";

import { RoomWithTenant, Room } from "@/types";
import { BedDouble, Edit, Trash2, MoreHorizontal, Calendar, UserPlus, User } from "lucide-react";
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
  const [showActions, setShowActions] = useState(false);

  const { deleteRoom } = useRoomContext();

  const formattedCreated = new Date(room.created_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const openEditModal = () => {
    setSelectedRoom(room);
    setEditModalOpen(true);
    setShowActions(false);
  };

  // Función para obtener colores del estado - estilo moderno con gradientes
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          dot: "bg-green-500",
          gradient: "from-green-400 to-green-500",
          avatarBg: "bg-gradient-to-br from-green-400 to-green-500",
          badge: "bg-green-100 text-green-700"
        };
      case "occupied":
        return {
          bg: "bg-red-50",
          text: "text-red-700", 
          dot: "bg-red-500",
          gradient: "from-red-400 to-red-500",
          avatarBg: "bg-gradient-to-br from-red-400 to-red-500",
          badge: "bg-red-100 text-red-700"
        };
      case "maintenance":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          dot: "bg-orange-500",
          gradient: "from-orange-400 to-orange-500",
          avatarBg: "bg-gradient-to-br from-orange-400 to-orange-500",
          badge: "bg-orange-100 text-orange-700"
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          dot: "bg-gray-500",
          gradient: "from-gray-400 to-gray-500",
          avatarBg: "bg-gradient-to-br from-gray-400 to-gray-500",
          badge: "bg-gray-100 text-gray-700"
        };
    }
  };

  const statusColors = getStatusColor(room.status);

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "occupied":
        return "Ocupada";
      case "maintenance":
        return "Mantenimiento";
      default:
        return status;
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Línea de color superior según estado */}
      <div className={`h-1 w-full ${statusColors.dot.replace('bg-', 'bg-')}`} />
      
      <div className="p-5">
        {/* Header: Ícono + Número + Tipo + Acciones */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Hab. {room.number}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Badge de tipo */}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
              {room.type}
            </span>
            
            {/* Menú de acciones */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20">
                  <button
                    onClick={openEditModal}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  
                  {onOccupy && room.status === 'available' && (
                    <button
                      onClick={() => {
                        onOccupy(room.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 w-full text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Ocupar
                    </button>
                  )}
                  
                  <div className="h-px bg-gray-100 mx-2 my-1" />
                  
                  <button
                    onClick={() => {
                      deleteRoom(room.id);
                      setShowActions(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estado y fecha */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Status indicator simple */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
              <span className={`text-sm font-medium ${statusColors.text}`}>
                {getStatusText(room.status)}
              </span>
            </div>

            {/* Indicador de inquilino */}
            {room.status === 'occupied' && room.current_tenant && (
              <div className="relative group/tenant">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer">
                  <User className="w-3 h-3 text-blue-600" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/tenant:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                    <div className="font-medium">{room.current_tenant.name}</div>
                    <div className="text-gray-300 text-xs">DNI: {room.current_tenant.document_number}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-sm">{formattedCreated}</span>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Descripción
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {room.description || (
              <span className="text-gray-400 italic">Sin descripción</span>
            )}
          </p>
        </div>

        {/* Precio */}
        <div className="flex items-end justify-between">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Precio/noche
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">
              S/ {room.price_per_night}
            </span>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar menú */}
      {showActions && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowActions(false)}
        />
      )}

      {/* Edit Modal */}
      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        room={selectedRoom}
      />
    </div>
  );
}
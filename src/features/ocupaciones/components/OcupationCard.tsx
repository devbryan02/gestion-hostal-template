"use client";
import { Occupation } from "@/types";
import { Calendar, User2, BedDouble, CheckCircle, LogOut, Pencil, DollarSign, Clock } from "lucide-react";
import { useOcupationContext } from "@/context/OcupationContext";
import { useState } from "react";
import EditOcupationModal from "./EditOcupationModal";

interface OcupationCardProps {
  occupation: Occupation;
  rooms?: { id: string; number: string; price_per_night: number }[];
  tenants?: { id: string; name: string }[];
}

export function OcupationCard({ occupation, rooms = [], tenants = [] }: OcupationCardProps) {
  const { checkOut, loading } = useOcupationContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const formattedCheckIn = new Date(occupation.check_in_date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short"
  });
  const formattedCheckOut = occupation.check_out_date
    ? new Date(occupation.check_out_date).toLocaleDateString("es-ES", {
        day: "numeric", 
        month: "short"
      })
    : "-";
  const formattedPlannedCheckOut = new Date(occupation.planned_check_out).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short"
  });

  const handleCheckOut = async () => {
    setIsProcessing(true);
    await checkOut(occupation.id, new Date().toISOString().slice(0, 10));
    setIsProcessing(false);
  };

  // Status configuration minimal
  const statusConfig = {
    active: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
      label: "Activa",
      border: "border-blue-200"
    },
    completed: {
      bg: "bg-green-50",
      text: "text-green-600", 
      dot: "bg-green-500",
      label: "Completada",
      border: "border-green-200"
    },
    canceled: {
      bg: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500", 
      label: "Cancelada",
      border: "border-red-200"
    }
  };

  const currentStatus = statusConfig[occupation.status] || statusConfig.active;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Línea de color superior según estado */}
      <div className={`h-1 w-full ${currentStatus.dot}`} />
      
      <div className="p-5">
        {/* Header: Habitación + Estado */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BedDouble className="w-5 h-5 text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Hab. {occupation.room?.number}
              </h3>
              <span className="text-sm text-gray-500">
                {occupation.room?.type}
              </span>
            </div>
          </div>

          {/* Estado */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${currentStatus.bg}`}>
            <div className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
            <span className={`text-sm font-medium ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
          </div>
        </div>

        {/* Información del inquilino */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <User2 className="w-4 h-4 text-blue-600" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-sm">
              {occupation.tenant?.name}
            </div>
            <div className="text-xs text-gray-500">
              {occupation.tenant?.document_type} {occupation.tenant?.document_number}
            </div>
          </div>
        </div>

        {/* Fechas importantes */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Check-in</span>
            </div>
            <span className="font-medium text-gray-900">{formattedCheckIn}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Check-out plan.</span>
            </div>
            <span className="font-medium text-gray-900">{formattedPlannedCheckOut}</span>
          </div>
          
          {occupation.check_out_date && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4" />
                <span>Check-out real</span>
              </div>
              <span className="font-medium text-gray-900">{formattedCheckOut}</span>
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-xl">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Precio/noche</span>
          </div>
          <span className="text-lg font-bold text-green-800">
            S/ {occupation.price_per_night}
          </span>
        </div>

        {/* Notas si existen */}
        {occupation.notes && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Notas
            </p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
              {occupation.notes}
            </p>
          </div>
        )}

        {/* Footer: Fecha creación y acciones */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-sm">
              {new Date(occupation.created_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowEdit(true)}
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
            
            {occupation.status === "active" && (
              <button
                onClick={handleCheckOut}
                disabled={loading || isProcessing}
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                {isProcessing ? "Procesando..." : "Check-out"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <EditOcupationModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        occupation={occupation}
        rooms={rooms}
        tenants={tenants}
      />
    </div>
  );
}

export default OcupationCard;
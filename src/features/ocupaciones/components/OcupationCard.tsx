"use client";
import { Occupation } from "@/types";
import { Calendar, User2, BedDouble, Info, CheckCircle, XCircle, FileText, LogOut, Pencil, DollarSign } from "lucide-react";
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

  const formattedCheckIn = new Date(occupation.check_in_date).toLocaleDateString("es-ES");
  const formattedCheckOut = occupation.check_out_date
    ? new Date(occupation.check_out_date).toLocaleDateString("es-ES")
    : "-";
  const formattedPlannedCheckOut = new Date(occupation.planned_check_out).toLocaleDateString("es-ES");

  const handleCheckOut = async () => {
    setIsProcessing(true);
    await checkOut(occupation.id, new Date().toISOString().slice(0, 10));
    setIsProcessing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <BedDouble className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">
                Hab. {occupation.room?.number}
              </h2>
              <span className="inline-block bg-gray-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded">
                {occupation.room?.type}
              </span>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            ${occupation.status === "active" ? "bg-indigo-100 text-indigo-700" :
              occupation.status === "completed" ? "bg-green-100 text-green-700" :
              "bg-red-100 text-red-700"}`}>
            {occupation.status === "active" && <Info className="w-3.5 h-3.5" />}
            {occupation.status === "completed" && <CheckCircle className="w-3.5 h-3.5" />}
            {occupation.status === "canceled" && <XCircle className="w-3.5 h-3.5" />}
            {occupation.status === "active" ? "Activa" :
              occupation.status === "completed" ? "Completada" : "Cancelada"}
          </span>
        </div>

        {/* Tenant Info */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
          <User2 className="w-4 h-4 text-indigo-500" />
          <div className="flex-1">
            <span className="font-medium text-gray-900 text-sm">{occupation.tenant?.name}</span>
            <span className="text-xs text-gray-500 ml-2">
              {occupation.tenant?.document_type} {occupation.tenant?.document_number}
            </span>
          </div>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Ingreso</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formattedCheckIn}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Salida plan.</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formattedPlannedCheckOut}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Check-out</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formattedCheckOut}
            </p>
          </div>
        </div>

        {/* Price & Notes Row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Precio/noche</p>
              <p className="text-sm font-medium text-gray-900">S/ {occupation.price_per_night}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Notas</p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {occupation.notes || <span className="text-gray-400">Sin notas</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Actions */}
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="text-xs text-gray-400">
            {new Date(occupation.created_at).toLocaleDateString("es-ES")}
          </span>
          <div className="flex gap-2">
            <button
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition"
              onClick={() => setShowEdit(true)}
              disabled={loading}
              title="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
            {occupation.status === "active" && (
              <button
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-green-700 transition disabled:opacity-60"
                onClick={handleCheckOut}
                disabled={loading || isProcessing}
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
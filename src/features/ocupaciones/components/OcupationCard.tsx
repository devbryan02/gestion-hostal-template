"use client";
import { Occupation } from "@/types";
import { Calendar, User2, BedDouble, Info, CheckCircle, XCircle, FileText, LogOut } from "lucide-react";
import { useOcupationContext } from "@/context/OcupationContext";
import Swal from "sweetalert2";
import { useState } from "react";

interface OcupationCardProps {
  occupation: Occupation;
}

export function OcupationCard({ occupation }: OcupationCardProps) {
  const { checkOut, loading } = useOcupationContext();
  const [isProcessing, setIsProcessing] = useState(false);

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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <BedDouble className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">
              Habitación {occupation.room?.number}
            </h2>
            <span className="inline-block bg-gray-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded mt-1">
              {occupation.room?.type}
            </span>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="flex items-center gap-2 mb-2">
          <User2 className="w-5 h-5 text-indigo-500" />
          <span className="font-medium text-gray-900">{occupation.tenant?.name}</span>
          <span className="text-xs text-gray-500 ml-2">{occupation.tenant?.document_type} {occupation.tenant?.document_number}</span>
        </div>

        {/* Dates & Status */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400">Ingreso</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {formattedCheckIn}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Salida planificada</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {formattedPlannedCheckOut}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Check-out real</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {formattedCheckOut}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Estado</p>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
              ${occupation.status === "active" ? "bg-indigo-100 text-indigo-700" :
                occupation.status === "completed" ? "bg-green-100 text-green-700" :
                "bg-red-100 text-red-700"}`}>
              {occupation.status === "active" && <Info className="w-4 h-4" />}
              {occupation.status === "completed" && <CheckCircle className="w-4 h-4" />}
              {occupation.status === "canceled" && <XCircle className="w-4 h-4" />}
              {occupation.status === "active" ? "Activa" :
                occupation.status === "completed" ? "Completada" : "Cancelada"}
            </span>
          </div>
        </div>

        {/* Price & Notes */}
        <div className="mb-4">
          <p className="text-xs text-gray-400">Precio por noche</p>
          <p className="text-sm font-medium text-gray-900">S/ {occupation.price_per_night}</p>
        </div>
        <div className="mb-4">
          <p className="text-xs text-gray-400">Notas</p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {occupation.notes ? occupation.notes : <span className="text-gray-400">Sin notas</span>}
          </p>
        </div>

        {/* Footer & Actions */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-gray-400">
            Creado el {new Date(occupation.created_at).toLocaleDateString("es-ES")}
          </span>
          {occupation.status === "active" && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-60"
              onClick={handleCheckOut}
              disabled={loading || isProcessing}
            >
              <LogOut className="w-4 h-4" />
              {isProcessing ? "Procesando..." : "Hacer Check-out"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OcupationCard;
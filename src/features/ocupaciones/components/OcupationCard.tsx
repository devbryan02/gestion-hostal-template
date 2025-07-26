"use client";
import { Occupation } from "@/types";
import { Calendar, User2, BedDouble, Info, CheckCircle, XCircle, FileText, LogOut, Pencil, DollarSign, Clock } from "lucide-react";
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

  // Status configuration
  const statusConfig = {
    active: {
      bg: "from-indigo-100 to-blue-100",
      text: "text-indigo-700",
      icon: Info,
      label: "Activa",
      cardAccent: "from-indigo-500 to-blue-600",
      dot: "bg-indigo-600"
    },
    completed: {
      bg: "from-emerald-100 to-green-100",
      text: "text-emerald-700",
      icon: CheckCircle,
      label: "Completada",
      cardAccent: "from-emerald-500 to-green-600",
      dot: "bg-emerald-600"
    },
    canceled: {
      bg: "from-rose-100 to-red-100",
      text: "text-rose-700",
      icon: XCircle,
      label: "Cancelada",
      cardAccent: "from-rose-500 to-red-600",
      dot: "bg-rose-600"
    }
  };

  const currentStatus = statusConfig[occupation.status] || statusConfig.active;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="group relative bg-white border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ring-1 ring-gray-100 hover:ring-2 hover:ring-indigo-200 overflow-hidden">
      
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 opacity-60" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      
      <div className="p-5 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-2 ring-white/50">
              <BedDouble className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="space-y-1">
              <h2 className="font-black text-xl text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                Hab. {occupation.room?.number}
              </h2>
              <span className="inline-block bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {occupation.room?.type}
              </span>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentStatus.bg} ${currentStatus.text} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>
            <StatusIcon className="w-4 h-4" />
            <div className={`w-2 h-2 rounded-full ${currentStatus.dot} animate-pulse`}></div>
            {currentStatus.label}
          </div>
        </div>

        {/* Tenant Info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <User2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1 space-y-0.5">
            <span className="font-bold text-gray-900 text-sm block">{occupation.tenant?.name}</span>
            <span className="text-xs text-gray-600 font-medium bg-white px-2 py-0.5 rounded-md shadow-sm">
              {occupation.tenant?.document_type} • {occupation.tenant?.document_number}
            </span>
          </div>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl">
            <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Ingreso
            </p>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formattedCheckIn}
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-xl">
            <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Salida plan.
            </p>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formattedPlannedCheckOut}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl">
            <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Check-out
            </p>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formattedCheckOut}
            </p>
          </div>
        </div>

        {/* Price & Notes Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Precio/noche</p>
              <p className="text-sm font-bold text-gray-900">S/ {occupation.price_per_night}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-xl">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Notas</p>
              <p className="text-sm text-gray-700 line-clamp-2 font-medium">
                {occupation.notes || <span className="text-gray-400 italic">Sin notas</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg">
            <Calendar className="w-3 h-3" />
            {new Date(occupation.created_at).toLocaleDateString("es-ES")}
          </div>
          <div className="flex gap-2">
            <button
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-indigo-200"
              onClick={() => setShowEdit(true)}
              disabled={loading}
              title="Editar"
            >
              <Pencil className="w-3 h-3" />
              Editar
            </button>
            {occupation.status === "active" && (
              <button
                className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:from-emerald-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleCheckOut}
                disabled={loading || isProcessing}
              >
                <LogOut className="w-3 h-3" />
                {isProcessing ? "Procesando..." : "Check-out"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Premium corner accent with status color */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${currentStatus.cardAccent} opacity-15 rounded-bl-full`} />
      
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
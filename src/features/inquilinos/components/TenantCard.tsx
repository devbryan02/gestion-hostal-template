"use client";

import { Tenant, TenantWithOccupations } from "@/types";
import { User2, Edit, Trash2, MoreHorizontal, Calendar, Mail, Phone, Home, Star } from "lucide-react";
import { useState } from "react";
import { useTenantContext } from "@/context/TenantContext";
import EditTenantModal from "./EditTenantModal";

export interface TenantCardProps {
  tenant: Tenant | TenantWithOccupations;
  onRentTo?: (tenantId: string) => void;
}

export function TenantCard({ tenant, onRentTo }: TenantCardProps) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showActions, setShowActions] = useState(false);

  const { deleteTenant } = useTenantContext();

  // Verificar si es TenantWithOccupations
  const isRecurrentTenant = 'occupation_count' in tenant;
  const occupationCount = isRecurrentTenant ? tenant.occupation_count : 0;

  const formattedCreated = new Date(tenant.created_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short", 
    year: "numeric"
  });

  const openEditModal = () => {
    setSelectedTenant(tenant);
    setEditModalOpen(true);
    setShowActions(false);
  };

  // Función para obtener colores del badge VIP - estilo minimal
  const getBadgeColor = (count: number) => {
    if (count >= 5) {
      return {
        show: true,
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
        label: "VIP"
      };
    } else if (count >= 3) {
      return {
        show: true,
        bg: "bg-green-100", 
        text: "text-green-700",
        dot: "bg-green-500",
        label: "Frecuente"
      };
    } else if (count >= 1) {
      return {
        show: true,
        bg: "bg-blue-100",
        text: "text-blue-700", 
        dot: "bg-blue-500",
        label: "Casual"
      };
    }
    return {
      show: false,
      bg: "",
      text: "",
      dot: "",
      label: ""
    };
  };

  const badgeColors = getBadgeColor(occupationCount);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Línea de color superior según nivel */}
      {badgeColors.show && (
        <div className={`h-1 w-full ${badgeColors.dot}`} />
      )}
      
      <div className="p-5">
        {/* Header: Ícono + Nombre + Documento + Acciones */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <User2 className="w-4 h-4 text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {tenant.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Badge de documento */}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
              {tenant.document_type}
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
                  
                  {onRentTo && (
                    <button
                      onClick={() => {
                        onRentTo(tenant.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 w-full text-sm text-green-600 hover:bg-green-50 transition-colors duration-150"
                    >
                      <Home className="w-3.5 h-3.5" />
                      Alquilar
                    </button>
                  )}
                  
                  <div className="h-px bg-gray-100 mx-2 my-1" />
                  
                  <button
                    onClick={() => {
                      deleteTenant(tenant.id);
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

        {/* Estado de ocupaciones y fecha */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Indicator de ocupaciones */}
            {badgeColors.show && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${badgeColors.dot}`} />
                <span className={`text-sm font-medium ${badgeColors.text}`}>
                  {badgeColors.label}
                </span>
              </div>
            )}

            {/* Indicador de ocupaciones con tooltip */}
            {occupationCount > 0 && (
              <div className="relative group/occupation">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer">
                  <Star className="w-3 h-3 text-blue-600" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/occupation:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                    <div className="font-medium">{occupationCount} ocupaciones</div>
                    {isRecurrentTenant && tenant.last_occupation_date && (
                      <div className="text-gray-300 text-xs">
                        Última: {new Date(tenant.last_occupation_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    )}
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

        {/* Información de contacto */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Contacto
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              {tenant.email || (
                <span className="text-gray-400 italic">Sin email</span>
              )}
            </p>
            <p className="text-sm text-gray-700">
              {tenant.phone || (
                <span className="text-gray-400 italic">Sin teléfono</span>
              )}
            </p>
          </div>
        </div>

        {/* Documento */}
        <div className="flex items-end justify-between">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Documento
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">
              {tenant.document_number}
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
      <EditTenantModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        tenant={selectedTenant}
      />
    </div>
  );
}

export default TenantCard;

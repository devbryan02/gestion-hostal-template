"use client";

import { Tenant, TenantWithOccupations } from "@/types";
import { User2, Edit, Trash2, MoreHorizontal, Calendar, Info, Mail, Phone, Award, Home } from "lucide-react";
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

  const { deleteTenant } = useTenantContext();

  // Verificar si es TenantWithOccupations
  const isRecurrentTenant = 'occupation_count' in tenant;
  const occupationCount = isRecurrentTenant ? tenant.occupation_count : 0;

  const formattedCreated = new Date(tenant.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const openEditModal = () => {
    setSelectedTenant(tenant);
    setEditModalOpen(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <User2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-gray-900">{tenant.name}</h2>
                {/* Badge para inquilinos recurrentes */}
                {isRecurrentTenant && occupationCount >= 3 && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    <Award className="w-3 h-3" />
                    VIP
                  </div>
                )}
              </div>
              <span className="inline-block bg-gray-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded mt-0.5">
                {tenant.document_type} - {tenant.document_number}
              </span>
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
            <ul className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 hidden z-10">
              <li>
                <button
                  onClick={openEditModal}
                  className="flex items-center gap-2 px-3 py-1.5 w-full text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </li>
              {onRentTo && (
                <li>
                  <button
                    onClick={() => onRentTo(tenant.id)}
                    className="flex items-center gap-2 px-3 py-1.5 w-full text-green-600 hover:bg-green-50 transition text-sm"
                  >
                    <Home className="w-4 h-4" />
                    Alquilar
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => deleteTenant(tenant.id)}
                  className="flex items-center gap-2 px-3 py-1.5 w-full text-red-600 hover:bg-red-50 transition text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Información de ocupaciones - solo cuando está en vista recurrente */}
        {isRecurrentTenant && (
          <div className="mb-3">
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="text-xs text-indigo-600 font-medium">Ocupaciones registradas</p>
                  <p className="text-lg font-bold text-indigo-900">{occupationCount}</p>
                </div>
              </div>
              {isRecurrentTenant && tenant.last_occupation_date && (
                <div className="text-right">
                  <p className="text-xs text-indigo-600">Última visita</p>
                  <p className="text-xs font-semibold text-indigo-900">
                    {new Date(tenant.last_occupation_date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Row */}
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-700 truncate">
              {tenant.email || <span className="text-red-500">Sin email</span>}
            </span>
            <Phone className="w-4 h-4 text-green-500 ml-3" />
            <span className="text-xs text-gray-700 truncate">
              {tenant.phone || <span className="text-red-500">Sin teléfono</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            <span className="text-xs text-gray-700 truncate">
              {tenant.emergency_contact || <span className="text-red-500">Sin contacto</span>}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            <User2 className="w-4 h-4" />
            Inquilino
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formattedCreated}
          </span>
        </div>
      </div>

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
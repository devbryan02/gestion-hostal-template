"use client";

import { Tenant } from "@/types";
import { User2, Edit, Trash2, MoreHorizontal, Calendar, Info, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useTenantContext } from "@/context/TenantContext";
import EditTenantModal from "./EditTenantModal";

export interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const { deleteTenant } = useTenantContext();

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
              <h2 className="font-bold text-base text-gray-900">{tenant.name}</h2>
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
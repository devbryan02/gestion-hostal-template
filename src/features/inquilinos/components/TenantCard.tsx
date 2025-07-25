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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <User2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900">{tenant.name}</h2>
              <span className="inline-block bg-gray-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded mt-1">
                {tenant.document_type} - {tenant.document_number}
              </span>
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
                  onClick={() => deleteTenant(tenant.id)}
                  className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-400">Contacto de emergencia</p>
              <p className="text-sm font-medium text-gray-900">
                {tenant.emergency_contact ? tenant.emergency_contact : <span className="text-red-500">Sin contacto</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900">
                {tenant.email ? tenant.email : <span className="text-red-500">Sin email</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Teléfono</p>
              <p className="text-sm font-medium text-gray-900">
                {tenant.phone ? tenant.phone : <span className="text-red-500">Sin teléfono</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t my-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded bg-indigo-100 text-indigo-700">
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
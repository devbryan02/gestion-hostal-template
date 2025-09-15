"use client";

import { User2, Plus } from "lucide-react";
import { useState } from "react";
import AddTenantModal from "./AddTenantModal";
import TenantFilters from "./TenantFilters";
import TenantsList from "./TenantsList";
import { TenantProvider, useTenantContext } from "@/context/TenantContext";
import { useRoomContext } from "@/context/RoomContext";
import { Button } from "@/components/ui/button";
import { AddOcupationModal } from "../../ocupaciones/components/AddOcupationModal";
import { OcupationProvider } from "@/context/OcupationContext";
import { RoomProvider } from "@/context/RoomContext";

const TenantsContent = () => {
  const { tenants, loading, error } = useTenantContext();
  const { rooms } = useRoomContext();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isRentModalOpen, setRentModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const handleRentTo = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    setRentModalOpen(true);
  };

  const closeRentModal = () => {
    setRentModalOpen(false);
    setSelectedTenantId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow">
            <User2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquilinos</h1>
            <p className="text-gray-500 text-xs">Gestiona los inquilinos del hostal</p>
          </div>
        </div>
        <Button
          className="bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition flex gap-1 px-3 py-1.5 rounded-lg text-sm h-8"
          onClick={openAddModal}
        >
          <Plus className="w-4 h-4" />
          Nuevo Inquilino
        </Button>
      </div>

      {/* Search Bar */}
      <TenantFilters />

      {/* Content Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow p-3">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
          </div>
        )}

        {error && (
          <div className="py-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <User2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-1">
              Error al cargar inquilinos
            </h3>
            <p className="text-gray-500 text-center max-w-md text-xs">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Inquilinos</h2>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {tenants?.length || 0} resultados
              </span>
            </div>
            <TenantsList onRentTo={handleRentTo} />
          </div>
        )}
      </div>

      {/* Add Tenant Modal */}
      <AddTenantModal isOpen={isAddModalOpen} onClose={closeAddModal} />

      {/* Rent Modal */}
      {selectedTenantId && (
        <AddOcupationModal 
          isOpen={isRentModalOpen} 
          onClose={closeRentModal}
          preSelectedTenantId={selectedTenantId}
          rooms={rooms}
          tenants={tenants}
        />
      )}
    </div>
  );
};

export default function TenantsClient() {
  return (
    <RoomProvider>
      <OcupationProvider>
        <TenantProvider>
          <TenantsContent />
        </TenantProvider>
      </OcupationProvider>
    </RoomProvider>
  );
}
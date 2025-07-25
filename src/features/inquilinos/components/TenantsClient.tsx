"use client";

import { User2, Plus } from "lucide-react";
import { useState } from "react";
import AddTenantModal from "./AddTenantModal";
import TenantFilters from "./TenantFilters";
import TenantsList from "./TenantsList";
import { TenantProvider, useTenantContext } from "@/context/TenantContext";
import { Button } from "@/components/ui/button";

const TenantsContent = () => {
  const { tenants, loading, error } = useTenantContext();
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <User2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inquilinos</h1>
            <p className="text-gray-500">Gestiona los inquilinos del hostal</p>
          </div>
        </div>
        <Button
          className="bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition flex gap-2 px-5 py-2 rounded-xl"
          onClick={openAddModal}
        >
          <Plus className="w-5 h-5" />
          Nuevo Inquilino
        </Button>
      </div>

      {/* Search Bar */}
      <TenantFilters />

      {/* Content Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <span className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></span>
          </div>
        )}

        {error && (
          <div className="py-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <User2 className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error al cargar inquilinos
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Lista de Inquilinos</h2>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                {tenants?.length || 0} resultados
              </span>
            </div>
            <TenantsList />
          </div>
        )}
      </div>

      {/* Add Tenant Modal */}
      <AddTenantModal isOpen={isAddModalOpen} onClose={closeAddModal} />
    </div>
  );
};

export default function TenantsClient() {
  return (
    <TenantProvider>
      <TenantsContent />
    </TenantProvider>
  );
}
"use client";

import { BedDouble, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { OcupationProvider, useOcupationContext } from "@/context/OcupationContext";
import OcupationsList from "./OcupationsList";
import OcupationFilter from "./OcupationFilter";
import { Button } from "@/components/ui/button";
import { AddOcupationModal } from "./AddOcupationModal";
import { RoomService } from "@/features/habitaciones/service/RoomService";
import { TenantService } from "@/features/inquilinos/service/TenantService";

const OcupationsContent = () => {
  const { occupations, loading, error } = useOcupationContext();
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // Estado para rooms y tenants
  const [roomsAvailable, setRoomsAvailable] = useState<{ id: string; number: string; price_per_night: number; status?: string }[]>([]);
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);

  // Fetch rooms y tenants al montar el componente
  const [rooms, setRooms] = useState<{ id: string; number: string; price_per_night: number; status?: string }[]>([]);


  // Fetch rooms y tenants al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      const roomService = new RoomService();
      const tenantService = new TenantService();
      const fetchedRoomsAvailable = await roomService.fetchByStatus("available");
      const fetchedAllRooms = await roomService.fetchAllWithTenantInfo(); // Para mostrar info visual
      const fetchedTenants = await tenantService.fetchFirst10();
      setRoomsAvailable(fetchedRoomsAvailable.map(r => ({ id: r.id, number: r.number, price_per_night: r.price_per_night, status: r.status })));
      setRooms(fetchedAllRooms.map(r => ({ id: r.id, number: r.number, price_per_night: r.price_per_night, status: r.status })));
      setTenants(fetchedTenants.map(t => ({ id: t.id, name: t.name })));
    };
    fetchData();
  }, []);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BedDouble className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ocupaciones</h1>
            <p className="text-gray-500">Gestiona las ocupaciones y reservas del hostal</p>
          </div>
        </div>
        <Button
          className="bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition flex gap-2 px-5 py-2 rounded-xl"
          onClick={openAddModal}
        >
          <Plus className="w-5 h-5" />
          Nueva Ocupación
        </Button>
      </div>

      {/* Filter Bar */}
      <OcupationFilter />

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
              <BedDouble className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error al cargar ocupaciones
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Lista de Ocupaciones</h2>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                {occupations?.length || 0} resultados
              </span>
            </div>
            <OcupationsList 
              rooms={rooms}
              tenants={tenants}
            />
          </div>
        )}
      </div>

      {/* Add Ocupation Modal */}
      <AddOcupationModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        rooms={roomsAvailable}
        tenants={tenants}
      />
    </div>
  );
};

export default function OcupationsClient() {
  return (
    <OcupationProvider>
      <OcupationsContent />
    </OcupationProvider>
  );
}
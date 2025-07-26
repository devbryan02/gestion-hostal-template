"use client";

import { useState } from "react";
import { useOcupationContext } from "@/context/OcupationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreateOccupationRequest } from "../service/OcupationService";

interface AddOcupationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: { id: string; number: string }[];
  tenants: { id: string; name: string }[];
}

export function AddOcupationModal({ isOpen, onClose, rooms, tenants }: AddOcupationModalProps) {
  const { createOccupation, loading } = useOcupationContext();

  const [formData, setFormData] = useState<CreateOccupationRequest>({
    room_id: "",
    tenant_id: "",
    check_in_date: "",
    planned_check_out: "",
    price_per_night: 0,
    status: "active",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price_per_night" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOccupation(formData);
      setFormData({
        room_id: "",
        tenant_id: "",
        check_in_date: "",
        planned_check_out: "",
        price_per_night: 0,
        status: "active",
        notes: "",
      });
      onClose();
    } catch (error) {
      console.error("Error al agregar ocupación:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white text-gray-900 border border-gray-200 shadow-2xl rounded-2xl px-8 py-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-gray-900">
            Nueva Ocupación
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="room_id">Habitación *</Label>
              <select
                id="room_id"
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg px-3 py-2 w-full"
              >
                <option value="">Selecciona una habitación</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.number}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="tenant_id">Inquilino *</Label>
              <select
                id="tenant_id"
                name="tenant_id"
                value={formData.tenant_id}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg px-3 py-2 w-full"
              >
                <option value="">Selecciona un inquilino</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="check_in_date">Fecha de ingreso *</Label>
              <Input
                id="check_in_date"
                name="check_in_date"
                type="date"
                value={formData.check_in_date}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="planned_check_out">Fecha de salida planificada *</Label>
              <Input
                id="planned_check_out"
                name="planned_check_out"
                type="date"
                value={formData.planned_check_out}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="price_per_night">Precio por noche *</Label>
              <Input
                id="price_per_night"
                name="price_per_night"
                type="number"
                min={0}
                value={formData.price_per_night}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg px-3 py-2 w-full"
              >
                <option value="active">Activa</option>
                <option value="completed">Completada</option>
                <option value="canceled">Cancelada</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg px-3 py-2 w-full"
                rows={2}
                placeholder="Notas adicionales (opcional)"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-2">
            <span className="text-sm text-gray-400">
              Los campos con * son obligatorios
            </span>
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-gray-200 text-gray-500 hover:bg-gray-100"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
                className="bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
                disabled={loading}
              >
                Guardar Ocupación
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
"use client";
import { useState } from "react";
import { useRoomContext } from "@/context/RoomContext";
import { Plus, X, BedDouble } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreateRoomRequest } from "../service/RoomService";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddRoomModal({ isOpen, onClose }: AddRoomModalProps) {
  const { createRoom, loading } = useRoomContext();

  const [formData, setFormData] = useState<CreateRoomRequest>({
    number: "",
    type: "",
    status: "available",
    price_per_night: 0,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoom(formData);
      setFormData({
        number: "",
        type: "",
        status: "available",
        price_per_night: 0,
        description: "",
      });
      onClose();
    } catch (error) {
      console.error("Error al agregar habitación:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "price_per_night"
          ? parseFloat(value)
          : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl bg-white text-gray-900 border border-gray-200 shadow-2xl rounded-2xl px-8 py-6"
      >
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-indigo-600 rounded-xl w-14 h-14 flex items-center justify-center shadow-lg">
              <BedDouble className="w-7 h-7 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-gray-900">
                Nueva Habitación
              </DialogTitle>
              <DialogDescription className="text-base text-gray-500">
                Completa los datos para registrar una nueva habitación
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-gray-500 hover:bg-gray-100"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="number" className="text-gray-700 font-semibold">
                Número *
              </Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Ej: 101"
                required
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-gray-700 font-semibold">
                Tipo *
              </Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Ej: Doble, Matrimonial"
                required
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="price_per_night" className="text-gray-700 font-semibold">
                Precio por noche *
              </Label>
              <Input
                id="price_per_night"
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleChange}
                placeholder="Ej: 120"
                min={0}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-gray-700 font-semibold">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ej: Habitación con vista al jardín"
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="status" className="text-gray-700 font-semibold">
                Estado *
              </Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg px-3 py-2"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupado">Ocupado</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
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
                {loading ? (
                  <span className="animate-spin mr-2">
                    <Plus className="w-4 h-4" />
                  </span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Habitación
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

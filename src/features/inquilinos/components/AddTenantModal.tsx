"use client";
import { useState } from "react";
import { useTenantContext } from "@/context/TenantContext";
import { Plus, X, User2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreateTenantRequest } from "../service/TenantService";
import { DocumentType } from "@/types";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOCUMENT_TYPES: DocumentType[] = ["DNI", "CE", "PASSPORT"];

export function AddTenantModal({ isOpen, onClose }: AddTenantModalProps) {
  const { createTenant, loading } = useTenantContext();

  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: "",
    document_type: "DNI",
    document_number: "",
    phone: "",
    email: "",
    emergency_contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTenant(formData);
      setFormData({
        name: "",
        document_type: "DNI",
        document_number: "",
        phone: "",
        email: "",
        emergency_contact: "",
      });
      onClose();
    } catch (error) {
      console.error("Error al agregar inquilino:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
              <User2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-gray-900">
                Nuevo Inquilino
              </DialogTitle>
              <DialogDescription className="text-base text-gray-500">
                Completa los datos para registrar un nuevo inquilino
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-semibold">
                Nombre completo *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                required
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="document_type" className="text-gray-700 font-semibold">
                Tipo de documento *
              </Label>
              <select
                id="document_type"
                name="document_type"
                value={formData.document_type}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg px-3 py-2"
              >
                {DOCUMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="document_number" className="text-gray-700 font-semibold">
                N° de documento *
              </Label>
              <Input
                id="document_number"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                required
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-semibold">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: 987654321"
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700 font-semibold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: juan@email.com"
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact" className="text-gray-700 font-semibold">
                Contacto de emergencia
              </Label>
              <Input
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Ej: María Pérez - 987654321"
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
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
                {loading ? (
                  <span className="animate-spin mr-2">
                    <Plus className="w-4 h-4" />
                  </span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Inquilino
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

export default AddTenantModal;
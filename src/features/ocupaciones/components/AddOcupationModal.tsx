"use client";

import { useState } from "react";
import { useOcupationContext } from "@/context/OcupationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { CreateOccupationRequest } from "../service/OcupationService";
import { RoomSelect } from "./RoomSelect";
import { TenantSelect } from "./TenantSelect";
import { differenceInCalendarDays, parseISO } from "date-fns";
import Swal from "sweetalert2";

interface AddOcupationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: { id: string; number: string; price_per_night: number }[];
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

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [plannedCheckOutDate, setPlannedCheckOutDate] = useState<Date>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price_per_night" ? parseFloat(value) : value,
    }));
  };

  const handleRoomSelect = (value: string) => {
    const selectedRoom = rooms.find(room => room.id === value);
    setFormData(prev => ({
      ...prev,
      room_id: value,
      price_per_night: selectedRoom?.price_per_night || 0,
    }));
  };

  const handleTenantSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tenant_id: value,
    }));
  };

  const handleStatusSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as CreateOccupationRequest["status"],
    }));
  };

  const handleCheckInDateSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    setFormData(prev => ({
      ...prev,
      check_in_date: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handlePlannedCheckOutDateSelect = (date: Date | undefined) => {
    setPlannedCheckOutDate(date);
    setFormData(prev => ({
      ...prev,
      planned_check_out: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (!formData.check_in_date || !formData.planned_check_out) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Debes seleccionar la fecha de ingreso y la fecha de salida planificada.",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
      const nights =
        formData.check_in_date && formData.planned_check_out
          ? differenceInCalendarDays(
            parseISO(formData.planned_check_out),
            parseISO(formData.check_in_date)
          )
          : 0;

      // Calcular total_amount
      const total_amount = formData.price_per_night * (nights > 0 ? nights : 1);

      await createOccupation({
        ...formData,
        total_amount,
      });

      setFormData({
        room_id: "",
        tenant_id: "",
        check_in_date: "",
        planned_check_out: "",
        price_per_night: 0,
        status: "active",
        notes: "",
        total_amount: 0,
      });
      setCheckInDate(undefined);
      setPlannedCheckOutDate(undefined);
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
              <Label>Habitación *</Label>
              <RoomSelect
                rooms={rooms}
                value={formData.room_id}
                onValueChange={handleRoomSelect}
                placeholder="Buscar habitación..."
              />
            </div>

            <div>
              <Label>Inquilino *</Label>
              <TenantSelect
                tenants={tenants}
                value={formData.tenant_id}
                onValueChange={handleTenantSelect}
                placeholder="Buscar inquilino..."
              />
            </div>

            <div>
              <Label>Fecha de ingreso *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-50 border-gray-200 text-gray-900 rounded-lg",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={handleCheckInDateSelect}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Fecha de salida planificada *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-50 border-gray-200 text-gray-900 rounded-lg",
                      !plannedCheckOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {plannedCheckOutDate ? format(plannedCheckOutDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={plannedCheckOutDate}
                    onSelect={handlePlannedCheckOutDateSelect}
                    disabled={(date) => checkInDate ? date < checkInDate : date < new Date("1900-01-01")}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
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
              <Select value={formData.status} onValueChange={handleStatusSelect}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="canceled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg px-3 py-2 w-full border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
"use client";

import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, BedDouble, User } from "lucide-react";

// Room Select Component
interface Room {
  id: string;
  number: string;
  price_per_night: number;
}

interface RoomSelectProps {
  rooms: Room[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RoomSelect({ rooms, value, onValueChange, placeholder = "Seleccionar habitación", className, disabled = false }: RoomSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedRoom = rooms.find(room => room.id === value);
  
  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.price_per_night.toString().includes(searchTerm)
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (roomId: string) => {
    onValueChange(roomId);
    setOpen(false);
    setSearchTerm("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchTerm("");
    }
  };

  return (
    <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-gray-50 border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100",
            disabled && "opacity-60 cursor-not-allowed bg-gray-100",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-indigo-500" />
            {selectedRoom ? (
              <span>Hab. {selectedRoom.number} - S/{selectedRoom.price_per_night} x noche</span>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder="Buscar por número o precio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {filteredRooms.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No se encontraron habitaciones
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
                  value === room.id && "bg-indigo-50"
                )}
                onClick={() => handleSelect(room.id)}
              >
                <BedDouble className="w-4 h-4 text-indigo-500" />
                <div className="flex-1">
                  <div className="font-medium">Hab. {room.number}</div>
                  <div className="text-sm text-gray-500">S/{room.price_per_night} por noche</div>
                </div>
                {value === room.id && (
                  <Check className="ml-auto h-4 w-4 text-indigo-600" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Tenant Select Component
interface Tenant {
  id: string;
  name: string;
}

interface TenantSelectProps {
  tenants: Tenant[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TenantSelect({ tenants, value, onValueChange, placeholder = "Seleccionar inquilino", className }: TenantSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTenant = tenants.find(tenant => tenant.id === value);
  
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (tenantId: string) => {
    onValueChange(tenantId);
    setOpen(false);
    setSearchTerm("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchTerm("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-gray-50 border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            {selectedTenant ? (
              <span>{selectedTenant.name}</span>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {filteredTenants.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No se encontraron inquilinos
            </div>
          ) : (
            filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
                  value === tenant.id && "bg-indigo-50"
                )}
                onClick={() => handleSelect(tenant.id)}
              >
                <User className="w-4 h-4 text-indigo-500" />
                <div className="flex-1 font-medium">{tenant.name}</div>
                {value === tenant.id && (
                  <Check className="ml-auto h-4 w-4 text-indigo-600" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
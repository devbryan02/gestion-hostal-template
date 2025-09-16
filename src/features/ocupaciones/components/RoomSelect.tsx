"use client";

import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, BedDouble } from "lucide-react";

// Room Select Component
interface Room {
  id: string;
  number: string;
  price_per_night: number;
  status?: string;
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

  // Separate available and occupied rooms for better UX
  const availableRooms = filteredRooms.filter(room => room.status === 'available' || !room.status);
  const occupiedRooms = filteredRooms.filter(room => room.status === 'occupied');

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
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="truncate">Hab. {selectedRoom.number} - S/{selectedRoom.price_per_night}</span>
                {selectedRoom.status === 'available' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">Disponible</span>
                )}
                {selectedRoom.status === 'occupied' && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex-shrink-0">Ocupado</span>
                )}
              </div>
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
          {availableRooms.length === 0 && occupiedRooms.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No se encontraron habitaciones
            </div>
          ) : (
            <>
              {/* Available Rooms */}
              {availableRooms.map((room) => (
                <div
                  key={room.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
                    value === room.id && "bg-indigo-50"
                  )}
                  onClick={() => handleSelect(room.id)}
                >
                  <BedDouble className="w-4 h-4 text-indigo-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Hab. {room.number}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                        Disponible
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">S/{room.price_per_night} por noche</div>
                  </div>
                  {value === room.id && (
                    <Check className="ml-auto h-4 w-4 text-indigo-600 flex-shrink-0" />
                  )}
                </div>
              ))}
              
              {/* Occupied Rooms - Disabled */}
              {occupiedRooms.length > 0 && (
                <>
                  {availableRooms.length > 0 && (
                    <div className="border-t border-gray-100 my-1"></div>
                  )}
                  {occupiedRooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-2 px-3 py-2 opacity-50 cursor-not-allowed"
                    >
                      <BedDouble className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-400">Hab. {room.number}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex-shrink-0">
                            Ocupado
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">S/{room.price_per_night} por noche</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}


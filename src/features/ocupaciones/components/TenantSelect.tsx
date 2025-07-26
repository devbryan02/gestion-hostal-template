import { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, User } from "lucide-react";

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
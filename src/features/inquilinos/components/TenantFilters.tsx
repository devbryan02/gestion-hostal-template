"use client";

import { Input } from "@/components/ui/input";
import { useTenantContext } from "@/context/TenantContext";
import { useState } from "react";
import { Search } from "lucide-react";

function TenantFilters() {
  const { searchTenants } = useTenantContext();
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    searchTenants(value);
  };

  return (
    <div className="flex gap-2 items-center mb-3 bg-white border border-gray-200 rounded-xl shadow px-3 py-2">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar inquilino..."
          value={searchText}
          onChange={handleSearchChange}
          className="pl-8 pr-2 py-2 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-md text-sm"
        />
      </div>
    </div>
  );
}

export default TenantFilters;

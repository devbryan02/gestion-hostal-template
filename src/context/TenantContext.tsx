import { createContext, useContext } from 'react';
import { useTenants } from '@/features/inquilinos/hooks/useTenants';

const TenantContext = createContext<ReturnType<typeof useTenants> | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useTenants();
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenantContext debe ser usado dentro de un TenantProvider");
  }
  return context;
};
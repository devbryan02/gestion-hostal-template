import { createContext, useContext } from 'react';
import { useOcupations } from '@/features/ocupaciones/useOcupations';

const OcupationContext = createContext<ReturnType<typeof useOcupations> | undefined>(undefined);

export const OcupationProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useOcupations();
  return (
    <OcupationContext.Provider value={value}>
      {children}
    </OcupationContext.Provider>
  );
};

export const useOcupationContext = () => {
  const context = useContext(OcupationContext);
  if (!context) {
    throw new Error("useOcupationContext debe ser usado dentro de un OcupationProvider");
    }
    return context;
};
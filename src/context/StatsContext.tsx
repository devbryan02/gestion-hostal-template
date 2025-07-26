import { createContext, useContext } from "react";
import { useStats } from "@/features/panel/hooks/useStats";

const StatsContext = createContext<ReturnType<typeof useStats> | undefined>(undefined);

export const StatsProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useStats();
  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};

export function useStatsContext() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStatsContext debe ser usado dentro de un StatsProvider");
  }
  return context;
}

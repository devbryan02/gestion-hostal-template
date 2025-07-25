import { createContext, useContext } from 'react';
import { useRooms } from '@/features/habitaciones/hooks/useRooms';

const RoomContext = createContext<ReturnType<typeof useRooms> | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useRooms();
  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext debe ser usado dentro de un RoomProvider");
  }
  return context;
};

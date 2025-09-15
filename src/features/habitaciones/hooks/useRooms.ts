import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateRoomRequest, RoomService, UpdateRoomRequest } from "../service/RoomService";
import { RoomWithTenant, RoomStatus } from "@/types";
import Swal from "sweetalert2";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return "Ocurrió un error desconocido";
}

export function useRooms() {
    
    // Estado para manejar habitaciones, loading y error
    const [rooms, setRooms] = useState<RoomWithTenant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Instancia del servicio de habitaciones
    const roomService = useMemo(() => new RoomService(), []);

    // Funciones para manejar las operaciones CRUD y otras acciones
    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            const data = await roomService.fetchFirst10();
            setRooms(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [roomService]);

    // Funciones para buscar, filtrar, crear, actualizar y eliminar habitaciones
    const searchRooms = useCallback(async (text: string) => {
        try {
            setLoading(true);
            const data = await roomService.searchByText(text);
            setRooms(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [roomService]);

    // Filtrar habitaciones por estado
    const filterByStatus = useCallback(async (status: RoomStatus) => {
        try {
            setLoading(true);
            const data = await roomService.fetchByStatus(status);
            setRooms(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [roomService]);

    // Crear, actualizar y eliminar habitaciones
    const createRoom = useCallback(async (payload: CreateRoomRequest) => {
        try {
            setLoading(true);
            const response = await roomService.create(payload);
            // Convertir Room a RoomWithTenant agregando current_tenant: undefined
            const roomWithTenant: RoomWithTenant = { ...response.data, current_tenant: undefined };
            setRooms(prev => [...prev, roomWithTenant]);
            return response;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [roomService]);

    const updateRoom = useCallback(async (payload: UpdateRoomRequest) => {
        try {
            setLoading(true);
            const response = await roomService.update(payload);
            setRooms(prev => prev.map(room => {
                if (room.id === response.data.id) {
                    // Mantener la información del inquilino actual si existe
                    return { ...response.data, current_tenant: room.current_tenant };
                }
                return room;
            }));
            return response;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [roomService]);

    const deleteRoom = useCallback(async (id: string) => {
        try {
            const swalResponse = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (!swalResponse.isConfirmed) return;

            setLoading(true);
            await roomService.delete(id);
            setRooms(prev => prev.filter(room => room.id !== id));
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [roomService]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return {
        rooms,
        loading,
        error,
        fetchRooms,
        searchRooms,
        filterByStatus,
        createRoom,
        updateRoom,
        deleteRoom,
    };
}

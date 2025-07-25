import { createClient } from "@/lib/supabase/client";
import { Room, RoomStatus } from "@/types/index";

const supabase = createClient();
const TABLE_NAME = "rooms";

export interface CreateRoomRequest {
    number: string;
    type: string;
    status?: RoomStatus;
    price_per_night: number;
    description?: string;
}

export interface UpdateRoomRequest {
    id: string;
    number?: string;
    type?: string;
    status?: RoomStatus;
    price_per_night?: number;
    description?: string;
}

export interface CreateRoomResponse {
    data: Room;
    message: string;
}

export interface UpdateRoomResponse {
    data: Room;
    message: string;
}

export interface DeleteRoomResponse {
    message: string;
}

export class RoomService {
    // Obtener primeras 10 habitaciones
    async fetchFirst10(): Promise<Room[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) throw new Error(`Error fetching rooms: ${error.message}`);
        return data as Room[];
    }

    // Buscar por número o tipo
    async searchByText(text: string): Promise<Room[]> {
        const query = `number.ilike.%${text}%,type.ilike.%${text}%`;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .or(query)
            .limit(10);

        if (error) throw new Error(`Error searching rooms: ${error.message}`);
        return data as Room[];
    }
    
    // Filtrar habitaciones por estado
    async fetchByStatus(status: RoomStatus): Promise<Room[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .eq("status", status)
            .order("number", { ascending: true });

        if (error) throw new Error(`Error fetching rooms by status: ${error.message}`);
        return data as Room[];
    }


    // Crear nueva habitación
    async create(payload: CreateRoomRequest): Promise<CreateRoomResponse> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert({
                ...payload,
                status: payload.status ?? "available", // valor por defecto
            })
            .select("*")
            .single();

        if (error) throw new Error(`Error creating room: ${error.message}`);

        return {
            data: data as Room,
            message: "Habitación creada exitosamente",
        };
    }

    // Actualizar habitación
    async update(payload: UpdateRoomRequest): Promise<UpdateRoomResponse> {
        const { id, ...updateData } = payload;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updateData)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw new Error(`Error updating room: ${error.message}`);

        return {
            data: data as Room,
            message: "Habitación actualizada exitosamente",
        };
    }

    // Eliminar habitación
    async delete(id: string): Promise<DeleteRoomResponse> {
        const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

        if (error) throw new Error(`Error deleting room: ${error.message}`);

        return {
            message: "Habitación eliminada exitosamente",
        };
    }
}

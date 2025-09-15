import { createClient } from "@/lib/supabase/client";
import { Room, RoomStatus, RoomWithTenant } from "@/types/index";

const supabase = createClient();
const TABLE_NAME = "rooms";

// Tipo temporal para las ocupaciones con tenant en las consultas
interface OccupationWithTenant {
    id: string;
    status: string;
    tenant: {
        id: string;
        name: string;
        document_number: string;
    };
}

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
    // Obtener todas las habitaciones con información del inquilino cuando está ocupada
    async fetchAllWithTenantInfo(): Promise<RoomWithTenant[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
                *,
                occupations!left(
                    id,
                    status,
                    tenant:tenants(
                        id,
                        name,
                        document_number
                    )
                )
            `)
            .eq('occupations.status', 'active')
            .order("created_at", { ascending: false });

        if (error) throw new Error(`Error fetching rooms: ${error.message}`);

        // Formatear los resultados para incluir current_tenant solo cuando hay ocupación activa
        const roomsWithTenant = (data || []).map(room => {
            const activeOccupation = room.occupations?.[0]; // Solo habrá una ocupación activa por habitación
            return {
                ...room,
                occupations: undefined, // Remover la propiedad occupations del resultado
                current_tenant: activeOccupation?.tenant || undefined
            };
        });

        return roomsWithTenant as RoomWithTenant[];
    }

    // Obtener primeras 10 habitaciones con información del inquilino cuando está ocupada
    async fetchFirst10(): Promise<RoomWithTenant[]> {
        const allRooms = await this.fetchAllWithTenantInfo();
        return allRooms.slice(0, 10);
    }

    // Buscar por número o tipo
    async searchByText(text: string): Promise<RoomWithTenant[]> {
        const query = `number.ilike.%${text}%,type.ilike.%${text}%`;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
                *,
                occupations!left(
                    id,
                    status,
                    tenant:tenants(
                        id,
                        name,
                        document_number
                    )
                )
            `)
            .or(query)
            .limit(10);

        if (error) throw new Error(`Error searching rooms: ${error.message}`);

        // Formatear los resultados
        const roomsWithTenant = (data || []).map(room => {
            const activeOccupation = (room.occupations as OccupationWithTenant[])?.find(occ => occ.status === 'active');
            return {
                ...room,
                occupations: undefined,
                current_tenant: activeOccupation?.tenant || undefined
            };
        });

        return roomsWithTenant as RoomWithTenant[];
    }
    
    // Filtrar habitaciones por estado
    async fetchByStatus(status: RoomStatus): Promise<RoomWithTenant[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
                *,
                occupations!left(
                    id,
                    status,
                    tenant:tenants(
                        id,
                        name,
                        document_number
                    )
                )
            `)
            .eq("status", status)
            .order("number", { ascending: true });

        if (error) throw new Error(`Error fetching rooms by status: ${error.message}`);

        // Formatear los resultados
        const roomsWithTenant = (data || []).map(room => {
            const activeOccupation = (room.occupations as OccupationWithTenant[])?.find(occ => occ.status === 'active');
            return {
                ...room,
                occupations: undefined,
                current_tenant: activeOccupation?.tenant || undefined
            };
        });

        return roomsWithTenant as RoomWithTenant[];
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

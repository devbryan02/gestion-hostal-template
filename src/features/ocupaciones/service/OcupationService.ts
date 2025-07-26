import { createClient } from "@/lib/supabase/client";
import { Occupation, OccupationStatus } from "@/types";

const supabase = createClient();
const TABLE_NAME = "occupations";

export interface CreateOccupationRequest {
    room_id: string;
    tenant_id: string;
    check_in_date: string;
    planned_check_out: string;
    price_per_night: number;
    status?: OccupationStatus;
    notes?: string;
}

export interface UpdateOccupationRequest {
    id: string;
    room_id?: string;
    tenant_id?: string;
    check_in_date?: string;
    planned_check_out?: string;
    price_per_night: number;
    status?: OccupationStatus;
    notes?: string;
    check_out_date?: string;
}

export interface CreateOccupationResponse {
    data: Occupation;
    message: string;
}

export interface UpdateOccupationResponse {
    data: Occupation;
    message: string;
}

export class OcupationService {

    // Obtener ocupaciones con relaciones
    async fetchAll(): Promise<Occupation[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
        *,
        room:rooms(*),
        tenant:tenants(*)
      `)
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) throw new Error(`Error fetching occupations: ${error.message}`);
        return data as Occupation[];
    }

    // Filtrar ocupaciones por estado
    async fetchByStatus(status: OccupationStatus): Promise<Occupation[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
        *,
        room:rooms(*),
        tenant:tenants(*)
      `)
            .eq("status", status)
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) throw new Error(`Error filtering occupations: ${error.message}`);
        return data as Occupation[];
    }

    // Crear ocupación
    async create(payload: CreateOccupationRequest): Promise<CreateOccupationResponse> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert({
                ...payload,
                status: payload.status ?? "active",
            })
            .select(`
        *,
        room:rooms(*),
        tenant:tenants(*)
      `)
            .single();

        if (error) throw new Error(`Error creating occupation: ${error.message}`);

        return {
            data: data as Occupation,
            message: "Ocupación creada exitosamente",
        };
    }

    // Actualizar ocupación
    async update(payload: UpdateOccupationRequest): Promise<UpdateOccupationResponse> {
        const { id, ...updateData } = payload;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updateData)
            .eq("id", id)
            .select(`
        *,
        room:rooms(*),
        tenant:tenants(*)
      `)
            .single();

        if (error) throw new Error(`Error updating occupation: ${error.message}`);

        return {
            data: data as Occupation,
            message: "Ocupación actualizada exitosamente",
        };
    }

    // Check-out ocupación
    async checkOut(id: string, checkOutDate: string): Promise<UpdateOccupationResponse> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({
                check_out_date: checkOutDate,
                status: "completed",
            })
            .eq("id", id)
            .select(`
        *,
        room:rooms(*),
        tenant:tenants(*)
      `)
            .single();

        if (error) throw new Error(`Error al hacer check-out: ${error.message}`);

        return {
            data: data as Occupation,
            message: "Check-out realizado exitosamente",
        };
    }

}
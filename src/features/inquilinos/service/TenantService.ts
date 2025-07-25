import { createClient } from "@/lib/supabase/client";
import { Tenant, DocumentType } from "@/types/index";

const supabase = createClient();
const TABLE_NAME = "tenants";

export interface CreateTenantRequest {
    name: string;
    document_type: DocumentType | string;
    document_number: string;
    phone?: string;
    email?: string;
    emergency_contact?: string;
}

export interface UpdateTenantRequest {
    id: string;
    name?: string;
    document_type?: DocumentType | string;
    document_number?: string;
    phone?: string;
    email?: string;
    emergency_contact?: string;
}

export interface CreateTenantResponse {
    data: Tenant;
    message: string;
}

export interface UpdateTenantResponse {
    data: Tenant;
    message: string;
}

export interface DeleteTenantResponse {
    message: string;
}

export class TenantService {
    // Obtener primeros 10 inquilinos
    async fetchFirst10(): Promise<Tenant[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) throw new Error(`Error fetching tenants: ${error.message}`);
        return data as Tenant[];
    }

    // Buscar por nombre o documento
    async searchByText(text: string): Promise<Tenant[]> {
        const query = `name.ilike.%${text}%,document_number.ilike.%${text}%`;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .or(query)
            .limit(10);

        if (error) throw new Error(`Error searching tenants: ${error.message}`);
        return data as Tenant[];
    }

    // Crear nuevo inquilino
    async create(payload: CreateTenantRequest): Promise<CreateTenantResponse> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(payload)
            .select("*")
            .single();

        if (error) throw new Error(`Error creating tenant: ${error.message}`);

        return {
            data: data as Tenant,
            message: "Inquilino creado exitosamente",
        };
    }

    // Actualizar inquilino
    async update(payload: UpdateTenantRequest): Promise<UpdateTenantResponse> {
        const { id, ...updateData } = payload;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updateData)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw new Error(`Error updating tenant: ${error.message}`);

        return {
            data: data as Tenant,
            message: "Inquilino actualizado exitosamente",
        };
    }

    // Eliminar inquilino
    async delete(id: string): Promise<DeleteTenantResponse> {
        const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

        if (error) throw new Error(`Error deleting tenant: ${error.message}`);

        return {
            message: "Inquilino eliminado exitosamente",
        };
    }
}
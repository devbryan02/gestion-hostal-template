import { createClient } from "@/lib/supabase/client";
import { Tenant, DocumentType } from "@/types/index";

const supabase = createClient();
const TABLE_NAME = "tenants";

// Ocupación mínima usada en los selects
interface Occupation {
    id: string;
    check_in_date: string;
}

// Fila que devuelve Supabase cuando se hace join de occupations
interface TenantWithOccupationsRow extends Tenant {
    occupations: Occupation[] | null;
}

// Salida interna calculada 
interface CalculatedTenantWithOccupations extends Tenant {
    occupation_count: number;
    last_occupation_date?: string;
}

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
    private mapWithStats(row: TenantWithOccupationsRow): CalculatedTenantWithOccupations {
        const occupations = row.occupations ?? [];
        const occupation_count = occupations.length;

        let last_occupation_date: string | undefined;
        if (occupation_count > 0) {
            // Obtener la última (más reciente) sin mutar el array original
            last_occupation_date = [...occupations]
                .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())[0]
                .check_in_date;
        }

        // Omitir el campo occupations para no enviarlo al frontend
        const { occupations: _omit, ...tenantBase } = row;

        return {
            ...tenantBase,
            occupation_count,
            last_occupation_date,
        };
    }

    // Obtener inquilinos con contador de ocupaciones (más recurrentes primero)
    async fetchWithOccupationCount(): Promise<CalculatedTenantWithOccupations[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
                *,
                occupations(
                    id,
                    check_in_date
                )
            `)
            .order("created_at", { ascending: false });

        if (error) throw new Error(`Error fetching tenants with occupations: ${error.message}`);

        const mapped = (data as TenantWithOccupationsRow[] ?? []).map(d => this.mapWithStats(d));

        return mapped.sort((a, b) => {
            if (b.occupation_count !== a.occupation_count) {
                return b.occupation_count - a.occupation_count;
            }
            if (a.last_occupation_date && b.last_occupation_date) {
                return new Date(b.last_occupation_date).getTime() - new Date(a.last_occupation_date).getTime();
            }
            return 0;
        });
    }

    async fetchTop10Recurrent(): Promise<CalculatedTenantWithOccupations[]> {
        const all = await this.fetchWithOccupationCount();
        return all.slice(0, 10);
    }

    async fetchFirst10(): Promise<Tenant[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) throw new Error(`Error fetching tenants: ${error.message}`);
        return (data ?? []) as Tenant[];
    }

    async searchByText(text: string): Promise<Tenant[]> {
        const query = `name.ilike.%${text}%,document_number.ilike.%${text}%`;
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .or(query)
            .limit(10);

        if (error) throw new Error(`Error searching tenants: ${error.message}`);
        return (data ?? []) as Tenant[];
    }

    async searchByTextWithOccupations(text: string): Promise<CalculatedTenantWithOccupations[]> {
        const query = `name.ilike.%${text}%,document_number.ilike.%${text}%`;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select(`
                *,
                occupations(
                    id,
                    check_in_date
                )
            `)
            .or(query)
            .limit(10);

        if (error) throw new Error(`Error searching tenants: ${error.message}`);

        const mapped = (data as TenantWithOccupationsRow[] ?? []).map(d => this.mapWithStats(d));

        return mapped.sort((a, b) => {
            if (b.occupation_count !== a.occupation_count) {
                return b.occupation_count - a.occupation_count;
            }
            if (a.last_occupation_date && b.last_occupation_date) {
                return new Date(b.last_occupation_date).getTime() - new Date(a.last_occupation_date).getTime();
            }
            return 0;
        });
    }

    async create(payload: CreateTenantRequest): Promise<CreateTenantResponse> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(payload)
            .select("*")
            .single();

        if (error || !data) throw new Error(`Error creating tenant: ${error?.message}`);

        return {
            data: data as Tenant,
            message: "Inquilino creado exitosamente",
        };
    }

    async update(payload: UpdateTenantRequest): Promise<UpdateTenantResponse> {
        const { id, ...updateData } = payload;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updateData)
            .eq("id", id)
            .select("*")
            .single();

        if (error || !data) throw new Error(`Error updating tenant: ${error?.message}`);

        return {
            data: data as Tenant,
            message: "Inquilino actualizado exitosamente",
        };
    }

    async delete(id: string): Promise<DeleteTenantResponse> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq("id", id);

        if (error) throw new Error(`Error deleting tenant: ${error.message}`);

        return { message: "Inquilino eliminado exitosamente" };
    }
}
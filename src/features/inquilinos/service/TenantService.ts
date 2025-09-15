import { createClient } from "@/lib/supabase/client";
import { Tenant, TenantWithOccupations, DocumentType } from "@/types/index";

const supabase = createClient();
const TABLE_NAME = "tenants";

// Tipo temporal para las ocupaciones en las consultas
interface OccupationData {
    id: string;
    check_in_date: string;
}

// Tipo temporal para tenant con ocupaciones de Supabase
interface TenantWithOccupationsData extends Tenant {
    occupations: OccupationData[];
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
    // Obtener inquilinos con contador de ocupaciones (más recurrentes primero)
    async fetchWithOccupationCount(): Promise<TenantWithOccupations[]> {
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

        // Procesar los datos para contar ocupaciones y encontrar la última fecha
        const tenantsWithCount = (data || []).map((tenant: TenantWithOccupationsData) => {
            const occupations = tenant.occupations || [];
            const occupationCount = occupations.length;
            
            // Encontrar la fecha de la última ocupación
            const lastOccupationDate = occupations.length > 0 
                ? occupations
                    .map((occ: OccupationData) => occ.check_in_date)
                    .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())[0]
                : undefined;

            return {
                ...tenant,
                occupations: undefined, // Remover occupations del resultado
                occupation_count: occupationCount,
                last_occupation_date: lastOccupationDate
            };
        });

        // Ordenar por número de ocupaciones descendente, luego por última ocupación
        return tenantsWithCount
            .sort((a: TenantWithOccupations, b: TenantWithOccupations) => {
                if (b.occupation_count !== a.occupation_count) {
                    return b.occupation_count - a.occupation_count;
                }
                // Si tienen el mismo número de ocupaciones, ordenar por fecha más reciente
                if (a.last_occupation_date && b.last_occupation_date) {
                    return new Date(b.last_occupation_date).getTime() - new Date(a.last_occupation_date).getTime();
                }
                return 0;
            }) as TenantWithOccupations[];
    }

    // Obtener primeros 10 inquilinos más recurrentes
    async fetchTop10Recurrent(): Promise<TenantWithOccupations[]> {
        const allTenants = await this.fetchWithOccupationCount();
        return allTenants.slice(0, 10);
    }

    // Obtener primeros 10 inquilinos (comportamiento original)
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

    // Buscar por nombre o documento con información de ocupaciones
    async searchByTextWithOccupations(text: string): Promise<TenantWithOccupations[]> {
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

        const tenantsWithCount = data.map((tenant: any) => {
            const occupationCount = tenant.occupations?.length || 0;
            const lastOccupationDate = tenant.occupations?.length > 0 
                ? tenant.occupations.sort((a: any, b: any) => 
                    new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime()
                  )[0].check_in_date
                : undefined;

            return {
                ...tenant,
                occupations: undefined, // Remover occupations del resultado
                occupation_count: occupationCount,
                last_occupation_date: lastOccupationDate
            };
        });

        // Ordenar por número de ocupaciones descendente
        return tenantsWithCount
            .sort((a: TenantWithOccupations, b: TenantWithOccupations) => {
                if (b.occupation_count !== a.occupation_count) {
                    return b.occupation_count - a.occupation_count;
                }
                if (a.last_occupation_date && b.last_occupation_date) {
                    return new Date(b.last_occupation_date).getTime() - new Date(a.last_occupation_date).getTime();
                }
                return 0;
            }) as TenantWithOccupations[];
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateTenantRequest, TenantService, UpdateTenantRequest } from "../service/TenantService";
import { Tenant, TenantWithOccupations } from "@/types";
import Swal from "sweetalert2";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return "Ocurrió un error desconocido";
}

export function useTenants() {
    
    const [tenants, setTenants] = useState<(Tenant | TenantWithOccupations)[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isRecurrentView, setIsRecurrentView] = useState<boolean>(false);

    const tenantService = useMemo(() => new TenantService(), []);

    const fetchTenants = useCallback(async () => {
        try {
            setLoading(true);
            const data = await tenantService.fetchFirst10();
            setTenants(data);
            setIsRecurrentView(false);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [tenantService]);

    const fetchRecurrentTenants = useCallback(async () => {
        try {
            setLoading(true);
            const data = await tenantService.fetchWithOccupationCount();
            setTenants(data);
            setIsRecurrentView(true);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [tenantService]);

    const searchTenants = useCallback(async (text: string) => {
        try {
            setLoading(true);
            // Usar la nueva función que incluye información de ocupaciones
            const data = await tenantService.searchByTextWithOccupations(text);
            setTenants(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [tenantService]);

    const createTenant = useCallback(async (payload: CreateTenantRequest) => {
        try {
            setLoading(true);
            const response = await tenantService.create(payload);
            // Si estamos en vista recurrente, agregar con occupation_count: 0
            if (isRecurrentView) {
                const tenantWithOccupations: TenantWithOccupations = {
                    ...response.data,
                    occupation_count: 0,
                    last_occupation_date: undefined
                };
                setTenants(prev => [...prev, tenantWithOccupations]);
            } else {
                setTenants(prev => [...prev, response.data]);
            }
            return response;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [tenantService, isRecurrentView]);

    const updateTenant = useCallback(async (payload: UpdateTenantRequest) => {
        try {
            setLoading(true);
            const response = await tenantService.update(payload);
            setTenants(prev => prev.map(tenant => tenant.id === response.data.id ? response.data : tenant));
            return response;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [tenantService]);

    const deleteTenant = useCallback(async (id: string) => {
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
            await tenantService.delete(id);
            setTenants(prev => prev.filter(tenant => tenant.id !== id));
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [tenantService]);

    useEffect(() => {
        fetchRecurrentTenants(); // Cambiar de fetchTenants a fetchRecurrentTenants
    }, [fetchRecurrentTenants]);

    return {
        tenants,
        loading,
        error,
        isRecurrentView,
        fetchTenants,
        fetchRecurrentTenants,
        searchTenants,
        createTenant,
        updateTenant,
        deleteTenant,
    };
}
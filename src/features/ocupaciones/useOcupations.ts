import { useCallback, useEffect, useMemo, useState } from "react";
import { OcupationService, CreateOccupationRequest, UpdateOccupationRequest } from "./OcupationService";
import { Occupation, OccupationStatus } from "@/types";
import Swal from "sweetalert2";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error desconocido";
}

export function useOcupations() {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const ocupationService = useMemo(() => new OcupationService(), []);

  const fetchOccupations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ocupationService.fetchAll();
      setOccupations(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [ocupationService]);

  const filterByStatus = useCallback(async (status: OccupationStatus) => {
    try {
      setLoading(true);
      const data = await ocupationService.fetchByStatus(status);
      setOccupations(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [ocupationService]);

  const createOccupation = useCallback(async (payload: CreateOccupationRequest) => {
    try {
      setLoading(true);
      const response = await ocupationService.create(payload);
      setOccupations(prev => [response.data, ...prev]);
      return response;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [ocupationService]);

  const updateOccupation = useCallback(async (payload: UpdateOccupationRequest) => {
    try {
      setLoading(true);
      const response = await ocupationService.update(payload);
      setOccupations(prev =>
        prev.map(occ => occ.id === response.data.id ? response.data : occ)
      );
      return response;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [ocupationService]);

  const checkOut = useCallback(async (id: string, checkOutDate: string) => {
    try {
      const swalResponse = await Swal.fire({
        title: "¿Confirmar check-out?",
        text: "Esta acción marcará la ocupación como completada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
      });

      if (!swalResponse.isConfirmed) return;

      setLoading(true);
      const response = await ocupationService.checkOut(id, checkOutDate);

      Swal.fire({
        title: "Check-out realizado",
        text: `La habitación ha sido marcada como desocupada.`,
        icon: "success",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });

      setOccupations(prev =>
        prev.map(occ => occ.id === response.data.id ? response.data : occ)
      );
      return response;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [ocupationService]);

  useEffect(() => {
    fetchOccupations();
  }, [fetchOccupations]);

  return {
    occupations,
    loading,
    error,
    fetchOccupations,
    filterByStatus,
    createOccupation,
    updateOccupation,
    checkOut,
    refetch: fetchOccupations,
  };
}
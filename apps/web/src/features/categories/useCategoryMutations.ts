import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/features/toasts/ToastContext";
import type { Category, CategoryCreate, CategoryUpdate } from "@/lib/types";

function errorMessage(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.detail : fallback;
}

export function useCreateCategory() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (body: CategoryCreate) =>
        apiFetch<Category>("/categories", { method: "POST", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        showToast("Categoría creada \u2713");
        },
        onError: (err) => {
        showToast(errorMessage(err, "No se pudo crear la categoría."), "error");
        },
    });
}

export function useUpdateCategory(id: number) {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (body: CategoryUpdate) =>
        apiFetch<Category>(`/categories/${id}`, { method: "PATCH", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        showToast("Categoría actualizada \u2713");
        },
        onError: (err) => {
        showToast(errorMessage(err, "No se pudo actualizar la categoría."), "error");
        },
    });
}

export function useDeleteCategory() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (id: number) =>
        apiFetch<void>(`/categories/${id}`, { method: "DELETE", token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        showToast("Categoría eliminada \u2713");
        },
        onError: (err) => {
        showToast(errorMessage(err, "No se pudo eliminar la categoría."), "error");
        },
    });
}

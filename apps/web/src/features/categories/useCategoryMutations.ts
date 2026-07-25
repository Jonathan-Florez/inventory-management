import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Category, CategoryCreate, CategoryUpdate } from "@/lib/types";

export function useCreateCategory() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CategoryCreate) =>
        apiFetch<Category>("/categories", { method: "POST", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useUpdateCategory(id: number) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CategoryUpdate) =>
        apiFetch<Category>(`/categories/${id}`, { method: "PATCH", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useDeleteCategory() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
        apiFetch<void>(`/categories/${id}`, { method: "DELETE", token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
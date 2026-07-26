import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Product, ProductCreate, ProductUpdate } from "@/lib/types";

export function useCreateProduct() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: ProductCreate) =>
        apiFetch<Product>("/products", { method: "POST", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useUpdateProduct(id: number) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: ProductUpdate) =>
        apiFetch<Product>(`/products/${id}`, { method: "PATCH", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useDeleteProduct() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
        apiFetch<void>(`/products/${id}`, { method: "DELETE", token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}
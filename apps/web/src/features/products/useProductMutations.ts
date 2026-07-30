import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/features/toasts/ToastContext";
import type { Product, ProductCreate, ProductUpdate } from "@/lib/types";

// Mensaje de error consistente en las tres mutaciones: si es un ApiError
// usamos el detalle que manda el backend (ej. "SKU ya esta en uso"),
// si no, un mensaje generico.
function errorMessage(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.detail : fallback;
}

export function useCreateProduct() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (body: ProductCreate) =>
        apiFetch<Product>("/products", { method: "POST", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        showToast("Producto creado \u2713");
        },
        onError: (err) => {
        showToast(errorMessage(err, "No se pudo crear el producto."), "error");
        },
    });
}

export function useUpdateProduct(id: number) {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (body: ProductUpdate) =>
        apiFetch<Product>(`/products/${id}`, { method: "PATCH", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        showToast("Producto actualizado \u2713");
        },
        onError: (err) => {
        showToast(errorMessage(err, "No se pudo actualizar el producto."), "error");
        },
    });
}

export function useDeleteProduct() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (id: number) =>
        apiFetch<void>(`/products/${id}`, { method: "DELETE", token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        showToast("Producto eliminado \u2713");
        },
        onError: (err) => {
        showToast(errorMessage(err, "No se pudo eliminar el producto."), "error");
        },
    });
}

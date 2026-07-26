import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import type { PaginatedResponse, Product, ProductStatus } from "@/lib/types";

type UseProductsParams = {
    categoryId?: number;
    status?: ProductStatus;
    lowStock?: boolean;
    q?: string;
    page?: number;
    pageSize?: number;
};

export function useProducts({
    categoryId,
    status,
    lowStock,
    q = "",
    page = 1,
    pageSize = 20,
    }: UseProductsParams = {}) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["products", { categoryId, status, lowStock, q, page, pageSize }],
        queryFn: () => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize),
        });
        if (categoryId) params.set("category_id", String(categoryId));
        if (status) params.set("status", status);
        if (lowStock) params.set("low_stock", "true");
        if (q) params.set("q", q);

        return apiFetch<PaginatedResponse<Product>>(`/products?${params}`, { token });
        },
        enabled: !!token,
    });
}

export function useProduct(id: number) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["products", id],
        queryFn: () => apiFetch<Product>(`/products/${id}`, { token }),
        enabled: !!token && !!id,
    });
}
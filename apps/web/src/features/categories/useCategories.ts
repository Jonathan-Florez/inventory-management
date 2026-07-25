import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Category, PaginatedResponse } from "@/lib/types";

type UseCategoriesParams = {
    search?: string;
    page?: number;
    pageSize?: number;
};

export function useCategories({ search = "", page = 1, pageSize = 20 }: UseCategoriesParams = {}) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["categories", { search, page, pageSize }],
        queryFn: () => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize),
        });
        if (search) params.set("search", search);

        return apiFetch<PaginatedResponse<Category>>(`/categories?${params}`, { token });
        },
        enabled: !!token,
    });
}
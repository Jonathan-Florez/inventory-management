import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Movement, PaginatedResponse } from "@/lib/types";

export function useMovements(productId: number, page: number = 1, pageSize: number = 20) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["movements", productId, { page, pageSize }],
        queryFn: () =>
        apiFetch<PaginatedResponse<Movement>>(
            `/products/${productId}/movements?page=${page}&page_size=${pageSize}`,
            { token }
        ),
        enabled: !!token && !!productId,
    });
}
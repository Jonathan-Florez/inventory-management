import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Movement, MovementCreate } from "@/lib/types";

export function useCreateMovement(productId: number) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: MovementCreate) =>
        apiFetch<Movement>(`/products/${productId}/movements`, { method: "POST", body, token }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["movements", productId] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}
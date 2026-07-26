"use client";

import { useState, FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import { useCreateMovement } from "@/features/movements/useCreateMovement";
import type { MovementType } from "@/lib/types";

export function MovementForm({ productId }: { productId: number }) {
    const createMovement = useCreateMovement(productId);

    const [type, setType] = useState<MovementType>("in");
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        try {
        await createMovement.mutateAsync({ type, quantity, note: note || undefined });
        setQuantity(1);
        setNote("");
        } catch (err) {
        setError(err instanceof ApiError ? err.detail : "No se pudo registrar el movimiento.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold">Registrar movimiento</h2>

        <div className="flex gap-3">
            <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="movement-type" checked={type === "in"} onChange={() => setType("in")} />
            Entrada
            </label>
            <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="movement-type" checked={type === "out"} onChange={() => setType("out")} />
            Salida
            </label>
        </div>

        <div className="space-y-1">
            <label htmlFor="movement-quantity" className="block text-sm font-medium">
            Cantidad
            </label>
            <input
            id="movement-quantity"
            type="number"
            required
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded border border-gray-300 px-3 py-2"
            />
        </div>

        <div className="space-y-1">
            <label htmlFor="movement-note" className="block text-sm font-medium">
            Nota (opcional)
            </label>
            <input
            id="movement-note"
            type="text"
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            />
        </div>

        {error && (
            <p role="alert" className="text-sm text-red-600">
            {error}
            </p>
        )}

        <button
            type="submit"
            disabled={createMovement.isPending}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
            {createMovement.isPending ? "Registrando..." : "Registrar"}
        </button>
        </form>
    );
    }
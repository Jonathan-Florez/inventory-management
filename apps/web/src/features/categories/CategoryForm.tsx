"use client";

import { useState, FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import type { Category } from "@/lib/types";

type CategoryFormProps = {
    initialValues?: Pick<Category, "name" | "description">;
    onSubmit: (values: { name: string; description?: string }) => Promise<unknown>;
    onCancel: () => void;
};

export function CategoryForm({ initialValues, onSubmit, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(initialValues?.name ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
        await onSubmit({ name, description: description || undefined });
        } catch (err) {
        setError(err instanceof ApiError ? err.detail : "No se pudo guardar la categoría.");
        setIsSubmitting(false);
        return;
        }
        setIsSubmitting(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 p-4">
        <div className="space-y-1">
            <label htmlFor="category-name" className="block text-sm font-medium">
            Nombre
            </label>
            <input
            id="category-name"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            />
        </div>

        <div className="space-y-1">
            <label htmlFor="category-description" className="block text-sm font-medium">
            Descripción (opcional)
            </label>
            <textarea
            id="category-description"
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            rows={3}
            />
        </div>

        {error && (
            <p role="alert" className="text-sm text-red-600">
            {error}
            </p>
        )}

        <div className="flex gap-2">
            <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
            {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-4 py-2">
            Cancelar
            </button>
        </div>
        </form>
    );
}
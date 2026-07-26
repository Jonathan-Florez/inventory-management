"use client";

import { useCategories } from "@/features/categories/useCategories";
import type { ProductStatus } from "@/lib/types";

type ProductFiltersValue = {
    categoryId?: number;
    status?: ProductStatus;
    lowStock: boolean;
    q: string;
};

type ProductFiltersProps = {
    value: ProductFiltersValue;
    onChange: (value: ProductFiltersValue) => void;
};

export function ProductFilters({ value, onChange }: ProductFiltersProps) {
    const { data: categoriesData } = useCategories({ pageSize: 100 });
    const categories = categoriesData?.items ?? [];

    return (
        <div className="mb-4 flex flex-wrap gap-2">
        <input
            type="search"
            placeholder="Buscar por nombre o SKU..."
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
            aria-label="Buscar producto"
            className="min-w-[200px] flex-1 rounded border border-gray-300 px-3 py-2"
        />

        <select
            value={value.categoryId ?? ""}
            onChange={(e) =>
            onChange({ ...value, categoryId: e.target.value ? Number(e.target.value) : undefined })
            }
            aria-label="Filtrar por categoría"
            className="rounded border border-gray-300 px-3 py-2"
        >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
            <option key={c.id} value={c.id}>
                {c.name}
            </option>
            ))}
        </select>

        <select
            value={value.status ?? ""}
            onChange={(e) =>
            onChange({ ...value, status: (e.target.value || undefined) as ProductStatus | undefined })
            }
            aria-label="Filtrar por estado"
            className="rounded border border-gray-300 px-3 py-2"
        >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="discontinued">Descontinuado</option>
        </select>

        <label className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2">
            <input
            type="checkbox"
            checked={value.lowStock}
            onChange={(e) => onChange({ ...value, lowStock: e.target.checked })}
            />
            Solo con stock bajo
        </label>
        </div>
    );
}
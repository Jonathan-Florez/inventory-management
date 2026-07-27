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

    const selectClasses = "appearance-none bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 pr-10 min-w-[160px]";
    const arrowIcon = (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
        </div>
    );

    return (
        <div className="flex flex-wrap items-center gap-3">
            
            <div className="relative min-w-[240px] flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="search"
                    placeholder="Buscar por nombre o SKU..."
                    value={value.q}
                    onChange={(e) => onChange({ ...value, q: e.target.value })}
                    aria-label="Buscar producto"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
            </div>

            <div className="relative">
                <select
                    value={value.categoryId ?? ""}
                    onChange={(e) =>
                        onChange({ ...value, categoryId: e.target.value ? Number(e.target.value) : undefined })
                    }
                    aria-label="Filtrar por categoría"
                    className={selectClasses}
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {arrowIcon}
            </div>

            <div className="relative">
                <select
                    value={value.status ?? ""}
                    onChange={(e) =>
                        onChange({ ...value, status: (e.target.value || undefined) as ProductStatus | undefined })
                    }
                    aria-label="Filtrar por estado"
                    className={selectClasses}
                >
                    <option value="">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="discontinued">Descontinuado</option>
                </select>
                {arrowIcon}
            </div>

            <label className="flex select-none items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50/80 cursor-pointer transition-all active:scale-[0.98]">
                <input
                    type="checkbox"
                    checked={value.lowStock}
                    onChange={(e) => onChange({ ...value, lowStock: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-0"
                />
                <span>Solo con stock bajo</span>
            </label>
        </div>
    );
}
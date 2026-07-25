"use client";

import type { Category } from "@/lib/types";

type CategoryTableProps = {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    };

    export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
    if (categories.length === 0) {
        return <p className="text-sm text-gray-500">No hay categorías todavía.</p>;
    }

    return (
        <table className="w-full text-left text-sm">
        <thead>
            <tr className="border-b border-gray-200">
            <th scope="col" className="py-2 font-medium">Nombre</th>
            <th scope="col" className="py-2 font-medium">Descripción</th>
            <th scope="col" className="py-2 font-medium"># Productos</th>
            <th scope="col" className="py-2 font-medium">
                <span className="sr-only">Acciones</span>
            </th>
            </tr>
        </thead>
        <tbody>
            {categories.map((category) => (
            <tr key={category.id} className="border-b border-gray-100">
                <td className="py-2">{category.name}</td>
                <td className="py-2 text-gray-600">{category.description ?? "—"}</td>
                <td className="py-2">{category.product_count}</td>
                <td className="space-x-2 py-2 text-right">
                <button onClick={() => onEdit(category)} className="underline" aria-label={`Editar ${category.name}`}>
                    Editar
                </button>
                <button
                    onClick={() => onDelete(category)}
                    className="text-red-600 underline"
                    aria-label={`Eliminar ${category.name}`}
                >
                    Eliminar
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}
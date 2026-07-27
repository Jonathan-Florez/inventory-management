"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

const STATUS_LABELS: Record<Product["status"], string> = {
    active: "Activo",
    inactive: "Inactivo",
    discontinued: "Descontinuado",
};

const STATUS_STYLES: Record<Product["status"], string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-rose-50 text-rose-700 border-rose-200",
    discontinued: "bg-gray-100 text-gray-600 border-gray-300",
};

type ProductTableProps = {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
};

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
    if (products.length === 0) {
        return <p className="text-sm text-gray-500">No hay productos que coincidan con los filtros.</p>;
    }

    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b border-gray-200">
                    <th scope="col" className="py-2 font-medium">Nombre</th>
                    <th scope="col" className="py-2 font-medium">SKU</th>
                    <th scope="col" className="py-2 font-medium">Stock</th>
                    <th scope="col" className="py-2 font-medium">Precio</th>
                    <th scope="col" className="py-2 font-medium">Estado</th>
                    <th scope="col" className="py-2 font-medium">
                        <span className="sr-only">Acciones</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                        <td className="py-2">{product.name}</td>
                        <td className="py-2 text-gray-600">{product.sku}</td>
                        <td className="py-2">
                            {product.quantity}
                            {product.is_low_stock && (
                                <span
                                    role="status"
                                    className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                                >
                                    Stock bajo
                                </span>
                            )}
                        </td>
                        <td className="py-2">${Number(product.price).toFixed(2)}</td>
                        <td className="py-2">
                            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow-sm ${STATUS_STYLES[product.status]}`}>
                                {STATUS_LABELS[product.status]}
                            </span>
                        </td>
                        <td className="py-2 text-right">
                            <div className="flex justify-end gap-2">
                                <Link
                                    href={`/products/${product.id}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                                >
                                    Ver detalle
                                </Link>
                                <button
                                    onClick={() => onEdit(product)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-indigo-600 active:scale-95"
                                    aria-label={`Editar ${product.name}`}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(product)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50 active:scale-95"
                                    aria-label={`Eliminar ${product.name}`}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
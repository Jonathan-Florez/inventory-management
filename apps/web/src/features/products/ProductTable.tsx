"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

const STATUS_LABELS: Record<Product["status"], string> = {
    active: "Activo",
    inactive: "Inactivo",
    discontinued: "Descontinuado",
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
                <td className="py-2">{STATUS_LABELS[product.status]}</td>
                <td className="space-x-2 py-2 text-right">
                    <Link href={`/products/${product.id}`} className="underline">
                        Ver detalle
                    </Link>
                <button onClick={() => onEdit(product)} className="underline" aria-label={`Editar ${product.name}`}>
                    Editar
                </button>
                <button
                    onClick={() => onDelete(product)}
                    className="text-red-600 underline"
                    aria-label={`Eliminar ${product.name}`}
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
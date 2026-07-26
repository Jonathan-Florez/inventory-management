"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/features/products/useProduct";
import { MovementForm } from "@/features/movements/MovementForm";
import { MovementHistory } from "@/features/movements/MovementHistory";

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);
    const router = useRouter();

    const { data: product, isLoading, isError } = useProduct(productId);

    if (isLoading) return <p className="p-8 text-sm text-gray-500">Cargando producto...</p>;
    if (isError || !product) {
        return (
        <div className="p-8">
            <p role="alert" className="text-sm text-red-600">
            No se encontró el producto.
            </p>
            <button onClick={() => router.push("/products")} className="mt-2 underline">
            Volver al listado
            </button>
        </div>
        );
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/products" className="text-sm underline">
            ← Volver al listado
        </Link>

        <div className="mb-6 mt-2">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <p className="text-sm text-gray-600">
            SKU: {product.sku} · Stock actual: {product.quantity}
            {product.is_low_stock && (
                <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Stock bajo
                </span>
            )}
            </p>
        </div>

        <div className="mb-6">
            <MovementForm productId={productId} />
        </div>

        <h2 className="mb-2 text-sm font-semibold">Historial de movimientos</h2>
        <MovementHistory productId={productId} />
        </main>
    );
}
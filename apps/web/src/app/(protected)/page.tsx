"use client";

import Link from "next/link";
import { useDashboard } from "@/features/dashboard/useDashboard";

const TYPE_LABELS = { in: "Entrada", out: "Salida" } as const;

export default function DashboardPage() {
    const { data, isLoading, isError } = useDashboard();

    if (isLoading) return <p className="p-8 text-sm text-gray-500">Cargando dashboard...</p>;
    if (isError || !data) {
        return (
        <p role="alert" className="p-8 text-sm text-red-600">
            No se pudo cargar el dashboard.
        </p>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Productos</p>
            <p className="text-2xl font-semibold">{data.total_products}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Categorías</p>
            <p className="text-2xl font-semibold">{data.total_categories}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Con stock bajo</p>
            <p className={`text-2xl font-semibold ${data.low_stock_count > 0 ? "text-red-600" : ""}`}>
                {data.low_stock_count}
            </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Valor del inventario</p>
            <p className="text-2xl font-semibold">${Number(data.total_inventory_value).toFixed(2)}</p>
            </div>
        </div>

        <div className="mb-4 flex gap-4">
            <Link href="/categories" className="underline">
            Ver categorías
            </Link>
            <Link href="/products" className="underline">
            Ver productos
            </Link>
        </div>

        <h2 className="mb-2 text-sm font-semibold">Últimos movimientos</h2>
        {data.recent_movements.length === 0 ? (
            <p className="text-sm text-gray-500">Sin movimientos todavía.</p>
        ) : (
            <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b border-gray-200">
                <th scope="col" className="py-2 font-medium">Fecha</th>
                <th scope="col" className="py-2 font-medium">Producto</th>
                <th scope="col" className="py-2 font-medium">Tipo</th>
                <th scope="col" className="py-2 font-medium">Cantidad</th>
                </tr>
            </thead>
            <tbody>
                {data.recent_movements.map((m) => (
                <tr key={m.id} className="border-b border-gray-100">
                    <td className="py-2">{new Date(m.created_at).toLocaleString()}</td>
                    <td className="py-2">
                    <Link href={`/products/${m.product_id}`} className="underline">
                        #{m.product_id}
                    </Link>
                    </td>
                    <td className={`py-2 ${m.type === "in" ? "text-green-700" : "text-red-700"}`}>
                    {TYPE_LABELS[m.type]}
                    </td>
                    <td className="py-2">{m.quantity}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </main>
    );
}
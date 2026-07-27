"use client";

import Link from "next/link";
import { useDashboard } from "@/features/dashboard/useDashboard";

const TYPE_LABELS = { in: "Entrada", out: "Salida" } as const;

export default function DashboardPage() {
    const { data, isLoading, isError } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cargando dashboard...
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">
                <div role="alert" className="rounded-xl bg-red-50 p-4 border border-red-200">
                    <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        No se pudo cargar la información del dashboard. Por favor, reintenta más tarde.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-950">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Vista general del estado actual de tu inventario.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/categories" className="btn-secondary text-sm font-medium shadow-sm">
                        Ver categorías
                    </Link>
                    <Link href="/products" className="btn-primary text-sm font-medium shadow-sm">
                        Ver productos
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card flex flex-col justify-between p-5">
                    <p className="text-sm font-medium text-gray-500">Productos</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">{data.total_products}</p>
                </div>

                <div className="card flex flex-col justify-between p-5">
                    <p className="text-sm font-medium text-gray-500">Categorías</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">{data.total_categories}</p>
                </div>

                <div className={`card flex flex-col justify-between p-5 transition-colors ${
                    data.low_stock_count > 0 ? "bg-red-50/50 border-red-200" : ""
                }`}>
                    <p className="text-sm font-medium text-gray-500">Con stock bajo</p>
                    <p className={`mt-2 text-3xl font-bold tracking-tight ${
                        data.low_stock_count > 0 ? "text-red-600" : "text-gray-950"
                    }`}>
                        {data.low_stock_count}
                    </p>
                </div>

                <div className="card flex flex-col justify-between p-5 bg-gradient-to-br from-white to-gray-50">
                    <p className="text-sm font-medium text-gray-500">Valor del inventario</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                        ${Number(data.total_inventory_value).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-gray-950">Últimos movimientos</h2>
                
                {data.recent_movements.length === 0 ? (
                    <div className="card p-8 text-center">
                        <p className="text-sm text-gray-500">Sin movimientos registrados todavía.</p>
                    </div>
                ) : (
                    <div className="card overflow-hidden !p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3.5">Fecha</th>
                                        <th scope="col" className="px-6 py-3.5">ID Producto</th>
                                        <th scope="col" className="px-6 py-3.5">Tipo</th>
                                        <th scope="col" className="px-6 py-3.5 text-right">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {data.recent_movements.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                                {new Date(m.created_at).toLocaleString()}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-indigo-600">
                                                <Link href={`/products/${m.product_id}`} className="hover:text-indigo-500 hover:underline">
                                                    #{m.product_id}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                    m.type === "in" 
                                                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                                                        : "bg-red-50 text-red-700 ring-red-600/20"
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${m.type === "in" ? "bg-green-600" : "bg-red-600"}`} />
                                                    {TYPE_LABELS[m.type]}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right font-mono font-medium text-gray-900">
                                                {m.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
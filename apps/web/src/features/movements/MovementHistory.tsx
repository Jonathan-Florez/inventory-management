"use client";

import { useMovements } from "@/features/movements/useMovements";

const TYPE_LABELS = { in: "Entrada", out: "Salida" } as const;

export function MovementHistory({ productId }: { productId: number }) {
    const { data, isLoading, isError } = useMovements(productId);

    if (isLoading) return <p className="text-sm text-gray-500">Cargando movimientos...</p>;
    if (isError) return <p role="alert" className="text-sm text-red-600">No se pudo cargar el historial.</p>;
    if (!data || data.items.length === 0) return <p className="text-sm text-gray-500">Sin movimientos todavía.</p>;

    return (
        <table className="w-full text-left text-sm">
        <thead>
            <tr className="border-b border-gray-200">
            <th scope="col" className="py-2 font-medium">Fecha</th>
            <th scope="col" className="py-2 font-medium">Tipo</th>
            <th scope="col" className="py-2 font-medium">Cantidad</th>
            <th scope="col" className="py-2 font-medium">Nota</th>
            </tr>
        </thead>
        <tbody>
            {data.items.map((m) => (
            <tr key={m.id} className="border-b border-gray-100">
                <td className="py-2">{new Date(m.created_at).toLocaleString()}</td>
                <td className={`py-2 ${m.type === "in" ? "text-green-700" : "text-red-700"}`}>
                {TYPE_LABELS[m.type]}
                </td>
                <td className="py-2">{m.quantity}</td>
                <td className="py-2 text-gray-600">{m.note ?? "—"}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}
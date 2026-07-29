"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { MovementTimelinePoint } from "@/lib/types";

type Props = {
    data: MovementTimelinePoint[];
};

function formatDayLabel(isoDate: string) {
    const d = new Date(`${isoDate}T00:00:00`);
    return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" });
}

function TooltipContent({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { value: number; dataKey: string }[];
    label?: string;
}) {
    if (!active || !payload || payload.length === 0) return null;

    const inValue = payload.find((p) => p.dataKey === "in_quantity")?.value ?? 0;
    const outValue = payload.find((p) => p.dataKey === "out_quantity")?.value ?? 0;

    return (
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
            <p className="font-semibold text-gray-700 mb-1">{label ? formatDayLabel(label) : ""}</p>
            <p className="text-emerald-600">Entradas: <span className="font-mono font-bold">{inValue}</span></p>
            <p className="text-red-600">Salidas: <span className="font-mono font-bold">{outValue}</span></p>
        </div>
    );
}

export function MovementsChart({ data }: Props) {
    const hasActivity = data.some((p) => p.in_quantity > 0 || p.out_quantity > 0);

    return (
        <div className="card border border-gray-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight text-gray-950">
                    Movimientos (últimos 7 días)
                </h2>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Entradas
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500" /> Salidas
                    </span>
                </div>
            </div>

            {!hasActivity ? (
                <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                    Sin movimientos en los últimos 7 días.
                </div>
            ) : (
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDayLabel}
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                                width={32}
                            />
                            <Tooltip content={<TooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="in_quantity"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#colorIn)"
                            />
                            <Area
                                type="monotone"
                                dataKey="out_quantity"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fill="url(#colorOut)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

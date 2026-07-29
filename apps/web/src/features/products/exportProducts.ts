const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function downloadProductsExcel(token: string | null): Promise<void> {
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/products/export/xlsx`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("No se pudo generar el archivo de exportación.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // truco estándar para forzar la descarga de un blob: un <a> invisible con el atributo download
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventario.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

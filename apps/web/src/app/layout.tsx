import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Inventario Personal",
    description: "Sistema de gestión de inventario personal",
};

export default function RootLayout({
    children,
    }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es">
        <body>{children}</body>
        </html>
    );
}
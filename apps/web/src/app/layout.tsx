import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Inventario Personal",
    description: "Sistema de gestión de inventario personal",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es" className="h-full scroll-smooth">
            <body className="h-full min-h-screen bg-gray-50 text-gray-950 antialiased selection:bg-indigo-500 selection:text-white">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
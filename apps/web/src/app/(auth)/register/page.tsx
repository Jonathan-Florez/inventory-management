"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { ApiError } from "@/lib/api-client";

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
        await register(email, password, name);
        router.push("/");
        } catch (err) {
        if (err instanceof ApiError) {
            setError(err.detail);
        } else {
            setError("No se pudo crear la cuenta. Intenta de nuevo.");
        }
        } finally {
        setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 p-6"
        >
            <h1 className="text-xl font-semibold">Crear cuenta</h1>

            <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium">
                Nombre
            </label>
            <input
                id="name"
                type="text"
                required
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
            />
            </div>

            <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
                Email
            </label>
            <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
            />
            </div>

            <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
            </label>
            <input
                id="password"
                type="password"
                required
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
            />
            </div>

            {error && (
            <p role="alert" className="text-sm text-red-600">
                {error}
            </p>
            )}

            <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <p className="text-sm text-gray-600">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="underline">
                Inicia sesión
            </Link>
            </p>
        </form>
        </main>
    );
}
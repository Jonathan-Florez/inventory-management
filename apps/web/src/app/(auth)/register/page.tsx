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
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Encabezado del Registro */}
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                        {/* Icono de registro/caja con un "+" */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-950">
                        Crear Cuenta
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Regístrate para empezar a gestionar tu stock
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-5 backdrop-blur-sm">
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nombre completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            maxLength={50}
                            placeholder="Juan Pérez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field placeholder:text-gray-400"
                        />
                    </div>

                    {/* Input de Email */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="nombre@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field placeholder:text-gray-400"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            maxLength={72}
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field placeholder:text-gray-400"
                        />
                    </div>

                    {error && (
                        <div role="alert" className="rounded-md bg-red-50 p-3 border border-red-200">
                            <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full shadow-sm flex items-center justify-center font-semibold"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creando cuenta...
                            </span>
                        ) : (
                            "Registrarme"
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500 pt-2">
                        ¿Ya tenés cuenta?{" "}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
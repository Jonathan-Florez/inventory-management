import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/AuthContext";
import { MovementForm } from "./MovementForm";

function renderWithQueryClient(ui: React.ReactElement) {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{ui}</AuthProvider>
        </QueryClientProvider>
    );
}

describe("MovementForm", () => {
    it("el botón de registrar está habilitado con la cantidad por defecto", () => {
        renderWithQueryClient(<MovementForm productId={1} />);
        expect(screen.getByRole("button", { name: /registrar/i })).toBeEnabled();
    });

    it("el campo de cantidad no acepta valores menores a 1", () => {
        renderWithQueryClient(<MovementForm productId={1} />);
        const quantityInput = screen.getByLabelText(/cantidad/i) as HTMLInputElement;
        expect(quantityInput.min).toBe("1");
    });

    it("permite alternar entre entrada y salida", async () => {
        const user = userEvent.setup();
        renderWithQueryClient(<MovementForm productId={1} />);

        const salidaRadio = screen.getByLabelText(/salida/i);
        await user.click(salidaRadio);

        expect(salidaRadio).toBeChecked();
    });
});
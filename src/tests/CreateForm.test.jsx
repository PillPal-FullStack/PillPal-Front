// src/tests/CreateForm.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock del servicio que usa el formulario
vi.mock("../services/CreateServices", () => ({
  createMedication: vi.fn().mockResolvedValue({ id: 101 }),
}));

import CreateForm from "../components/CreateForm";
import { createMedication } from "../services/CreateServices";

describe("CreateForm (simple)", () => {
  it("envía con lo mínimo y muestra el éxito", async () => {
    render(<CreateForm />);

    // Nombre obligatorio
    fireEvent.change(
      screen.getByLabelText(/Nombre de la medicación/i),
      { target: { value: "Ibuprofeno" } }
    );

    // Forma (Pastilla)
    fireEvent.click(screen.getByText(/Pastilla/i));

    // Hora (recordatorio activo por defecto)
    fireEvent.click(screen.getByText("08:00"));

    // Marcar “Uso de por vida” para no requerir fecha fin
    fireEvent.click(screen.getByLabelText(/Uso de por vida/i));

    // Enviar
    fireEvent.click(
      screen.getByRole("button", { name: /Añadir la medicación/i })
    );

    // Se llamó al servicio
    expect(createMedication).toHaveBeenCalledTimes(1);

    // Aparece el mensaje de éxito (sin usar toBeInTheDocument)
    const ok = await screen.findByText(/Medicamento creado \(id 101\)\./i);
    expect(ok).toBeTruthy(); 
  });
});

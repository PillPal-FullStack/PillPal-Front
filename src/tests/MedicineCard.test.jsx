// src/tests/MedicineCard.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MedicineCard from "../components/MedicineCard";

// util para YYYY-MM-DD de hoy
const todayStr = () => new Date().toISOString().split("T")[0];

describe("MedicineCard (simple)", () => {
  it("hoy tomada: muestra 'Tomada' y botón habilitado (Desmarcar tomado)", () => {
    render(
      <MedicineCard
        entry={{ date: todayStr(), taken: true }}
        medication={{ name: "Med", dosage: "500mg" }}
        isToday={true}
        onToggle={() => {}}
        isLoading={false}
      />
    );

    // Chip "Tomada"
    expect(screen.getByText(/Tomada/i)).toBeTruthy();

    // Botón con aria-label "Desmarcar tomado" y NO disabled
    const btn = screen.getByRole("button", { name: /Desmarcar tomado/i });
    expect(btn.hasAttribute("disabled")).toBe(false);
  });

  it("hoy pendiente: muestra 'Pendiente' y al hacer click llama onToggle(fecha)", () => {
    const onToggle = vi.fn();
    const today = todayStr();

    render(
      <MedicineCard
        entry={{ date: today, taken: false }}
        medication={{ name: "Med", dosage: "500mg" }}
        isToday={true}
        onToggle={onToggle}
        isLoading={false}
      />
    );

    // Chip "Pendiente"
    expect(screen.getByText(/Pendiente/i)).toBeTruthy();

    // Botón con aria-label "Marcar tomado" habilitado
    const btn = screen.getByRole("button", { name: /Marcar tomado/i });
    expect(btn.hasAttribute("disabled")).toBe(false);

    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(today);
  });

  it("pasado no tomado: muestra 'Ignorada' y botón deshabilitado", () => {
    render(
      <MedicineCard
        entry={{ date: "2000-01-01", taken: false }} // pasado
        medication={{ name: "Med" }}
        isToday={false}
        onToggle={() => {}}
        isLoading={false}
      />
    );

    // Chip "Ignorada"
    expect(screen.getByText(/Ignorada/i)).toBeTruthy();

    // Botón (aria-label será "Marcar tomado") pero DESHABILITADO por ser pasado
    const btn = screen.getByRole("button", { name: /Marcar tomado/i });
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  it("futuro: muestra 'Faltan ...' y botón deshabilitado", () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);
    const futureStr = future.toISOString().split("T")[0];

    render(
      <MedicineCard
        entry={{ date: futureStr, taken: false }}
        medication={{ name: "Med" }}
        isToday={false}
        onToggle={() => {}}
        isLoading={false}
      />
    );

    // Texto "Faltan ..." (no sabemos exacto, validamos prefijo)
    expect(screen.getByText((t) => /Faltan/i.test(t))).toBeTruthy();

    // Botón deshabilitado
    const btn = screen.getByRole("button", { name: /Marcar tomado/i });
    expect(btn.hasAttribute("disabled")).toBe(true);
  });
});

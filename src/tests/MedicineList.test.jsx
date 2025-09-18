// src/tests/MedicineList.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MedicineList from "../components/MedicineList";

// YYYY-MM-DD de hoy (UTC)
const todayStr = () => new Date().toISOString().split("T")[0];

function renderList({
  medication,
  takenDates = [],
  onToggle = vi.fn(),
} = {}) {
  const med =
    medication ??
    {
      id: 1,
      name: "Paracetamol",
      description: "Cada 8h",
      dosage: "500 mg",
      active: true,
      startDate: todayStr(),
      endDate: todayStr(),
      lifetime: false,
    };

  const utils = render(
    <MedicineList
      medication={med}
      takenDates={takenDates}
      onToggle={onToggle}
      onEdit={() => {}}
      onDelete={() => {}}
      isLoading={false}
    />
  );

  return { ...utils, med, onToggle };
}

describe("MedicineList (mínimo)", () => {
  it("renderiza el nombre y muestra 'Adherencia'", () => {
    const { med } = renderList();
    // ✅ el nombre como heading (evita duplicados de getByText)
    expect(
      screen.getByRole("heading", { name: new RegExp(med.name, "i") })
    ).toBeTruthy();
    // Adherencia visible
    expect(screen.getByText(/Adherencia/i)).toBeTruthy();
  });

  it("hoy pendiente: permite toggle y llama onToggle(id, date)", () => {
    const today = todayStr();
    const onToggle = vi.fn();

    renderList({
      medication: {
        id: 99,
        name: "Ibuprofeno",
        dosage: "200 mg",
        active: true,
        startDate: today,
        endDate: today,
        lifetime: false,
      },
      takenDates: [], // pendiente hoy
      onToggle,
    });

    // Botón del item de hoy (aria-label)
    const btn = screen.getByRole("button", { name: /Marcar tomado/i });
    expect(btn.hasAttribute("disabled")).toBe(false);

    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(99, today);
  });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MedicineList from "../components/MedicineList";

describe("MedicineList", () => {
  // Congelamos 'hoy' para que el test sea estable
  const FIXED_NOW = new Date("2025-09-18T10:00:00Z");

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  function makeList() {
    return {
      id: 42,
      name: "Ibuprofeno 500 mg",
      entries: [
        { date: "2025-09-17", taken: true },   // pasado
        { date: "2025-09-18", taken: false },  // hoy
        { date: "2025-09-19", taken: false },  // futuro
      ],
    };
  }

  test("renderiza nombre y contador de días", () => {
    const list = makeList();
    render(<MedicineList list={list} onToggle={() => {}} />);

    expect(screen.getByText("Ibuprofeno 500 mg")).toBeInTheDocument();
    expect(screen.getByText(/3 días/i)).toBeInTheDocument();
  });

  test("el item de hoy permite toggle y llama a onToggle(listId, date)", () => {
    const list = makeList();
    const onToggle = vi.fn();

    render(<MedicineList list={list} onToggle={onToggle} />);

    // Hay 3 botones con el mismo aria-label; el de HOY es el único habilitado
    const candidates = screen.getAllByRole("button", { name: /marcar tomado/i });
    const todayBtn = candidates.find((b) => !b.disabled);

    expect(todayBtn).toBeDefined();
    expect(todayBtn).toBeEnabled();

    fireEvent.click(todayBtn);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(42, "2025-09-18");
  });

  test("pasado y futuro muestran botón deshabilitado", () => {
    const list = makeList();
    render(<MedicineList list={list} onToggle={() => {}} />);

    const buttons = screen.getAllByRole("button", { name: /marcar tomado/i });
    const disabled = buttons.filter((b) => b.disabled);

    // Deben ser 2: uno para pasado y uno para futuro
    expect(disabled.length).toBe(2);
  });
});

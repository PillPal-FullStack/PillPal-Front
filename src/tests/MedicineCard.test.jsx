import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MedicineCard from "../components/MedicineCard";

// helper para formato de fecha de hoy (YYYY-MM-DD)
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

describe("MedicineCard", () => {
  test("muestra 'Tomado' si la entrada de hoy está marcada como tomada", () => {
    render(
      <MedicineCard
        entry={{ date: todayStr(), taken: true }}
        isToday={true}
        onToggle={() => {}}
      />
    );

    expect(screen.getByText(/tomado/i)).toBeInTheDocument();
    // el botón está habilitado
    expect(screen.getByRole("button", { name: /desmarcar tomado/i })).toBeEnabled();
  });

  test("muestra 'Pendiente' si la entrada de hoy no está tomada", () => {
    render(
      <MedicineCard
        entry={{ date: todayStr(), taken: false }}
        isToday={true}
        onToggle={() => {}}
      />
    );

    expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
    // el botón está habilitado
    expect(screen.getByRole("button", { name: /marcar tomado/i })).toBeEnabled();
  });

  test("llama a onToggle al hacer click cuando es hoy", () => {
    const onToggle = vi.fn();
    render(
      <MedicineCard
        entry={{ date: todayStr(), taken: false }}
        isToday={true}
        onToggle={onToggle}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /marcar tomado/i }));
    expect(onToggle).toHaveBeenCalledWith(todayStr());
  });

  test("muestra 'Archivo' para fechas pasadas", () => {
    render(
      <MedicineCard
        entry={{ date: "2000-01-01", taken: false }}
        isToday={false}
      />
    );
    expect(screen.getByText(/archivo/i)).toBeInTheDocument();
    // botón deshabilitado
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("muestra 'Faltan Xh Ym' para fechas futuras", () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);
    const futureStr = future.toISOString().split("T")[0];

    render(
      <MedicineCard
        entry={{ date: futureStr, taken: false }}
        isToday={false}
      />
    );

    expect(screen.getByText(/faltan/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateForm from "../components/CreateForm";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("CreateForm", () => {
  test("muestra 'El nombre es obligatorio.' si envías vacío", async () => {
    render(<CreateForm />);
    fireEvent.click(screen.getByRole("button", { name: /añadir la medicación/i }));
    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
  });

  test("envía POST con datos válidos y muestra éxito", async () => {
    // Simula sesión
    localStorage.setItem("token", "fake-jwt");

    // Mock de fetch exitoso
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 123 }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(<CreateForm />);

    // Nombre
    fireEvent.change(screen.getByLabelText(/nombre de la medicación/i), {
      target: { value: "Ibuprofeno" },
    });
    // Forma (elige “Pastilla”)
    fireEvent.click(screen.getByText(/pastilla/i));
    // Dosis
    fireEvent.change(screen.getByLabelText(/dosis/i), {
      target: { value: "500 mg" },
    });
    // Marca “Uso de por vida” para no requerir fecha fin
    fireEvent.click(screen.getByRole("checkbox", { name: /uso de por vida/i }));

    // Enviar
    fireEvent.click(screen.getByRole("button", { name: /añadir la medicación/i }));

    // Se llamó a fetch correctamente
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/medications$/);
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer fake-jwt");

    const body = JSON.parse(options.body);
    expect(body.name).toBe("Ibuprofeno");
    expect(body.lifetime).toBe(true);
    expect(body.endDate).toBeNull();

    // Mensaje de éxito
    expect(await screen.findByText(/medicamento creado/i)).toBeInTheDocument();
  });
});

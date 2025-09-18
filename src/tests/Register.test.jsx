import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/auth/Register";

// Mock de useNavigate para evitar navegación real
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Register", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renderiza los inputs y el botón", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
  });

  test("envía el formulario y navega a '/'", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

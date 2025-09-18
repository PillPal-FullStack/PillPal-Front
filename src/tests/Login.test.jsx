import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/auth/Login";

describe("Login", () => {
  test("renderiza el logo, textos y botones", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Logo (con alt que agregaste en el componente)
    expect(screen.getByAltText(/logo de pillpal/i)).toBeInTheDocument();

    // Textos principales
    expect(
      screen.getByText(/pensado para tu cuidado y el de los tuyos/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/gestiona fácilmente tu medicación/i)
    ).toBeInTheDocument();

    // Botones que renderiza ButtonsIndex
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrarse/i })
    ).toBeInTheDocument();
  });
});

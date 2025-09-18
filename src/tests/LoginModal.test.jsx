import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginModal from "../components/LoginModal";

describe("LoginModal", () => {
  test("no se renderiza si isOpen=false", () => {
    render(<LoginModal isOpen={false} />);
    // no debe existir el modal
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("se renderiza con título y children cuando isOpen=true", () => {
    render(
      <LoginModal isOpen={true} onClose={() => {}} title="Iniciar sesión">
        <p>Contenido del modal</p>
      </LoginModal>
    );

    // aparece el título
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    // aparece el contenido
    expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
  });

  test("llama a onClose al hacer clic en ✕", () => {
    const onClose = vi.fn();
    render(
      <LoginModal isOpen={true} onClose={onClose} title="Prueba">
        <p>Contenido</p>
      </LoginModal>
    );

    // botón de cerrar
    const closeBtn = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

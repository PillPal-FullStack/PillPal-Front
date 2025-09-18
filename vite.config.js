// // vite.config.ts (o .js si tu proyecto no usa TS)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // OPCIONAL: solo si quieres enrutar peticiones del front al back SIN usar VITE_API_BASE_URL.
  // Si ya usas VITE_API_BASE_URL en tu código, puedes borrar todo "server".
  
  server: {
    proxy: {
      // Ejemplo: manda /api/* a tu backend en 8080
      "/api": "http://localhost:8080",
    },
  },
  

  // Config de pruebas (Vitest)
  test: {
    globals: true,          // permite usar describe/test/expect sin importar
    environment: "jsdom",   // necesario para probar componentes React
    css: true,              // evita warnings por importar CSS/Tailwind en tests

    // Si tienes un setup global (no obligatorio):
    // setupFiles: ["./src/tests/setup.ts"],
  },
});

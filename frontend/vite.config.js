import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // Esto asegura que las rutas sean relativas
  plugins: [react()],
});

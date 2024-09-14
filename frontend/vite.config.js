import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./frontend", // Esto asegura que las rutas sean relativas
  plugins: [react()],
  server: {
    open: true, // Abre la app automáticamente en el navegador
    historyApiFallback: true, // Redirige las rutas a index.html
  },
});

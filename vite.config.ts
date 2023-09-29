import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { name, version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  define: {
    pkgJson: { name, version },
  },
});

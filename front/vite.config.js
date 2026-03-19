import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 8888,
    strictPort: true,
    allowedHosts: [
      "192.168.65.148.nip.io",
    ],
  },
});

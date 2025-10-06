import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests that start with /api
      "/api": {
        // The URL of your backend server
        target: "http://localhost:5001",
        // Ensures correct headers are set for the backend
        changeOrigin: true,
      },
    },
  },
});

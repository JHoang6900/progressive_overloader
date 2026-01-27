import path from "path"
import { fileURLToPath } from "url" // needed to fix __dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Because you are running in ESM (Module) mode, __dirname is not defined by default.
// We have to recreate it manually:
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
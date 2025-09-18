import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

const testReportDir = ".report";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  root: "./web",
  server: {
    port: 6173,
  },
  test: {
    environment: "happy-dom",
    reporters: ["default", "html"],
    outputFile: `${testReportDir}/index.html`,
    coverage: {
      enabled: true,
      reporter: ["clover", "html"],
      reportsDirectory: `${testReportDir}/coverage`,
    },
  },
});

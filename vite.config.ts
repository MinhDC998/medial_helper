import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@public": path.resolve(__dirname, "./src/public"),
        "@app": path.resolve(__dirname, "./src/app"),
        "@components": path.resolve(__dirname, "./src/app/components"),
        "@services": path.resolve(__dirname, "./src/app/services"),
        "@utils": path.resolve(__dirname, "./src/app/utils"),
        "@apis": path.resolve(__dirname, "./src/app/apis"),
        "@appTypes": path.resolve(__dirname, "./src/app/types"),
        "@customHooks": path.resolve(__dirname, "./src/app/customHooks"),
      },
    },
  });
};

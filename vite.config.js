import { defineConfig } from "vite";
import { join } from "node:path";
import twig from "vite-plugin-twig-drupal";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["./node_modules/@uswds/uswds/packages"],
      },
    },
  },
  plugins: [
    twig({
      components: join(__dirname, "./components"),
    }),
  ],
  framework: "react",
});

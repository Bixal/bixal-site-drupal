import { defineConfig } from "vite";
import twig from "vite-plugin-twig-drupal";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["./node_modules/@uswds/uswds/packages"],
      },
    },
  },
  plugins: [twig()],
  framework: "react",
});

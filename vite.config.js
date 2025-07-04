import { defineConfig } from "vite";
import { join } from "node:path";
import twig from "vite-plugin-twig-drupal";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ["./node_modules/@uswds/uswds/packages"],
      },
    },
  },
  plugins: [
    twig({
      namespaces: {
        components: join(__dirname, "./stories/components"),
        pages: join(__dirname, "./stories/pages"),
        partials: join(__dirname, "./stories/partials"),
      },
    }),
  ],
});

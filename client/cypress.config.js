import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Change if your dev server uses a different port
    async setupNodeEvents(on, config) {
      // Visual regression plugin registration for ESM
      const { addMatchImageSnapshotPlugin } = await import('cypress-image-snapshot/plugin.js');
      addMatchImageSnapshotPlugin(on, config);
      // You can add other plugins or event listeners here
    },
  },
});

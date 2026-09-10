import { mergeConfig } from 'vite';
import rendererConfig from './vite.renderer.config.js';

// Builds the self-contained demo build used by `start.sh --demo`: same
// browser-only bundle as the GitHub Pages build, but with VITE_DEMO_MODE
// baked in so runtime.js swaps in the synthetic demo data source
// (src/lib/demoRuntime.js) instead of connecting to a real MQTT broker.
// Output goes to /dist/demo-web (gitignored — see vite.web.config.js for the
// /docs build that IS committed for Pages).
export default mergeConfig(rendererConfig, {
  base: './',
  define: {
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),
  },
  build: {
    outDir: 'dist/demo-web',
    emptyOutDir: true,
  },
});

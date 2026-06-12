import { mergeConfig } from 'vite';
import rendererConfig from './vite.renderer.config.js';

// Builds the browser-only (websocket/MQTT) version of the UI for GitHub
// Pages. Output goes to /docs so it can be served via the repo's Pages
// "Deploy from a branch" setting. base: './' keeps asset URLs relative,
// since Pages serves project sites from a /<repo-name>/ subpath.
export default mergeConfig(rendererConfig, {
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});

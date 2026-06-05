import { defineConfig } from 'vite';
import { builtinModules } from 'module';

export default defineConfig({
  resolve: {
    mainFields: ['main'],
    conditions: ['node', 'require', 'default'],
  },
  ssr: {
    noExternal: ['mqtt', 'ws'],
  },
  build: {
    rollupOptions: {
      external: ['electron', ...builtinModules, 'bufferutil', 'utf-8-validate'],
    },
  },
});

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import packageJson from './package.json';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    solidPlugin(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Add these for better polyfill support
      protocolImports: true,
    }),
    VitePWA({
      srcDir: "/",
      filename: "imageCacheWorker.js",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: true,
        type: 'module',
      }
    })
  ],
  server: {
    port: 3000,
    fs: {
      allow: ['..'], // Add this for SDK file access
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    manifest: true,
  },
  optimizeDeps: {
    exclude: ['@breeztech/breez-sdk-spark'], // Add this - IMPORTANT!
    esbuildOptions: {
      target: 'esnext',
    }
  },
  envPrefix: 'PRIMAL_',
  define: {
    'import.meta.env.PRIMAL_VERSION': JSON.stringify(packageJson.version),
    'global': 'globalThis', // Add this for better compatibility
  },
  esbuild: {
    keepNames: true,
  },
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // React core (stable, rarely changes)
            if (id.includes('node_modules/react') || id.includes('node_modules/scheduler') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            // react-syntax-highlighter + Prism — the single heaviest vendor (600KB)
            if (id.includes('node_modules/react-syntax-highlighter') || id.includes('node_modules/prismjs') || id.includes('node_modules/refractor') || id.includes('node_modules/lowlight') || id.includes('node_modules/highlight.js')) {
              return 'vendor-syntax-highlight';
            }
            // Markdown ecosystem (react-markdown & its remark/rehype/unified pipeline)
            if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-') || id.includes('node_modules/rehype-') || id.includes('node_modules/unified') || id.includes('node_modules/unist-') || id.includes('node_modules/mdast-') || id.includes('node_modules/hast-') || id.includes('node_modules/vfile')) {
              return 'vendor-markdown';
            }

          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

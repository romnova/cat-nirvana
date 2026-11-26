import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    build: {
      assetsInlineLimit: 100_000_000,
      cssCodeSplit: false,
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inline-single-file-html',
        apply: 'build',
        enforce: 'post',
        generateBundle(_, bundle) {
          const htmlAsset = bundle['index.html'];
          if (!htmlAsset || htmlAsset.type !== 'asset') return;

          let html =
            typeof htmlAsset.source === 'string'
              ? htmlAsset.source
              : Buffer.from(htmlAsset.source).toString('utf-8');

          const cssChunks: string[] = [];
          const jsChunks: string[] = [];

          for (const [fileName, item] of Object.entries(bundle)) {
            if (fileName.endsWith('.css') && item.type === 'asset') {
              const cssText =
                typeof item.source === 'string'
                  ? item.source
                  : Buffer.from(item.source).toString('utf-8');
              cssChunks.push(cssText);
              const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              html = html.replace(
                new RegExp(`<link[^>]*href=["'][^"']*${escaped}["'][^>]*>`, 'gi'),
                '',
              );
              delete bundle[fileName];
            } else if (fileName.endsWith('.js') && item.type === 'chunk') {
              jsChunks.push(item.code);
              const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              html = html.replace(
                new RegExp(
                  `<script[^>]*src=["'][^"']*${escaped}["'][^>]*>\\s*</script>`,
                  'gi',
                ),
                '',
              );
              delete bundle[fileName];
            }
          }

          // Remove any leftover modulepreload links
          html = html.replace(/<link[^>]*rel=["']modulepreload["'][^>]*>/gi, '');

          if (cssChunks.length > 0) {
            const safeCss = cssChunks.join('\n').replace(/<\/style>/gi, '<\\/style>');
            html = html.replace('</head>', () => `<style>${safeCss}</style>\n  </head>`);
          }

          if (jsChunks.length > 0) {
            const safeJs = jsChunks.join('\n').replace(/<\/script>/gi, '<\\/script>');
            html = html.replace(
              '</body>',
              () => `<script type="module">${safeJs}</script>\n  </body>`,
            );
          }

          htmlAsset.source = html;
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
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

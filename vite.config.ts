import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gatewayKey = env.AI_GATEWAY_API_KEY ?? '';

  if (!gatewayKey) {
    console.warn(
      '\n[cv-adjuster] AI_GATEWAY_API_KEY is not set in .env.local. ' +
        'The /api/ai proxy will forward requests without Authorization and the Gateway will return 401.\n',
    );
  }

  // The Vercel AI Gateway SDK hits `${baseURL}/language-model` (and similar).
  // Its built-in default baseURL is `https://ai-gateway.vercel.sh/v3/ai`, so
  // when we override with `/api/ai` in the browser we have to rewrite to
  // `/v3/ai` on the upstream to preserve the same path the SDK expects.
  const aiProxy: ProxyOptions = {
    target: 'https://ai-gateway.vercel.sh',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api\/ai/, '/v3/ai'),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        if (gatewayKey) {
          proxyReq.setHeader('authorization', `Bearer ${gatewayKey}`);
        }
        proxyReq.removeHeader('cookie');
      });
    },
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['pdfjs-dist'],
    },
    define: {
      __HAS_GATEWAY_KEY__: JSON.stringify(gatewayKey.length > 0),
    },
    server: {
      proxy: {
        '/api/ai': aiProxy,
      },
    },
    preview: {
      proxy: {
        '/api/ai': aiProxy,
      },
    },
  };
});

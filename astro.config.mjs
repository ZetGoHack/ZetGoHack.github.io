// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://soyka.zgo.lt',
  output: 'server',
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 80 * 1024 * 1024,
  }),
  integrations: [preact()],
  trailingSlash: 'ignore',
  security: {
    allowedDomains: [{ hostname: 'soyka.zgo.lt', protocol: 'https' }],
  },
  vite: {
    server: {
      allowedHosts: ['soyka.zgo.lt'],
    },
  },
  build: {
    format: 'directory',
  },
});

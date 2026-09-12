// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://soyka.zgo.lt',
  output: 'static',
  trailingSlash: 'ignore',
  vite: {
    server: {
      allowedHosts: ['soyka.zgo.lt'],
    },
  },
  build: {
    format: 'directory',
  },
});

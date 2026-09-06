// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://soyka.zgo.lt',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});

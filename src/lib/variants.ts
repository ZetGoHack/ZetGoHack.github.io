import type { GetStaticPaths } from 'astro';
import { themes } from '../data/themes';

/** One static route per design preset, used by every page under src/pages/variants/[theme]/. */
export const variantPaths = (() =>
  themes.map((theme) => ({
    params: { theme: theme.id },
    props: { theme },
  }))) satisfies GetStaticPaths;

export const variantBase = (themeId: string) => `/variants/${themeId}`;

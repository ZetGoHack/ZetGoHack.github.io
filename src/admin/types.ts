import type { Content } from '../lib/content-schema';

export interface TabProps {
  content: Content;
  update: (mutate: (draft: Content) => void) => void;
}

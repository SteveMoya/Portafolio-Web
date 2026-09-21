import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

// Social network -> either raw SVG markup (string) or an imported Astro icon component
export type SocialIcon = Record<string, string | AstroComponentFactory>;

export type { Project, ProjectSource, ProjectStatus, ProjectCategory, ProjectBadge, Technology } from '@src/types/project';
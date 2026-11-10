# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7.1.1, TypeScript, React, TailwindCSS, MDX, TinaCMS, Vercel deploy. No changes to framework or architecture.

## Users

**Prospective clients and employers** evaluating Steve Moya for work. They visit to:
- Assess professional experience, skills, and credibility
- Review past projects and design/development work
- Read expertise through blog posts and articles
- Determine if they want to hire or collaborate

These visitors are **decision-makers** (potential clients, hiring managers, collaborators) who spend minutes scanning, then decide to reach out or move on.

## Product Purpose

Enable prospective clients and employers to quickly assess Steve Moya's professional capability, work quality, and expertise. The portfolio is a **credibility artifact**—it makes the case that he is worth hiring or collaborating with.

Success means visitors who find what they came for (proof of skill, relevant experience, or aligned thinking) feel confident enough to start a conversation.

## Positioning

Personal showcase of a digital marketer and web developer working at the intersection of creative strategy and technical craft. The portfolio demonstrates not just *what* he has built, but *how* he thinks and communicates.

## Operating Context

- **Primary entry**: Direct URL (stevemoya.me) or referral links
- **Session length**: ~2–5 minutes; visitors scan before deciding
- **Decision point**: Can they quickly find relevant work + understand fit? Then: contact or follow up
- **Content layers**: Hero/introduction → Experience/CV → Projects gallery → Blog → Contact
- **Interaction model**: Browse, search (Pagefind), print CV, read posts, engage via social/contact

## Capabilities and Constraints

**Locked:**
- Language: Spanish, Dominican variant (es-DO); no secondary English or neutral Spanish
- Content source: CV data from `cv.json` is canonical; existing blog posts are fixtures
- Tech: Astro, MDX, TinaCMS, React components, TailwindCSS—no framework swaps
- Identity: Steve Moya, author; brand name and voice stay put
- Deployment: Vercel; SEO, RSS, sitemap, printable CV mode, command palette (Ctrl+K), search via Pagefind

**Flexible:**
- Visual presentation, layout, color palette, typography
- Component design, interaction patterns, animation, emphasis
- Page structure and scroll flow
- CMS content management (TinaCMS admin tooling)

## Brand Commitments

- **Author**: Steve Moya (digital marketer + web developer)
- **Voice**: Professional yet approachable; showcases both creative and technical thinking
- **Assets**: Logo, profile image, projects from Cloudinary, CV JSON as design source
- **Tone**: Clear, confident, no hyperbole; let work speak

## Evidence on Hand

- `cv.json` — source-of-truth CV data (9.3 KB, 15+ years experience and education)
- Existing blog posts in `src/content/blog/` — published MDX articles (categories, tags, metadata locked)
- Project imagery and metadata from Cloudinary and image assets
- Live site at stevemoya.me deployed to Vercel
- Design tokens and theme system in `src/styles/global.css` (CSS variables for colors, fonts, custom Tailwind utilities)

## Product Principles

1. **Credibility first** — Every surface proves capability; no decoration without purpose
2. **Scannable for decision-makers** — Visitors decide in minutes; structure and hierarchy must support rapid comprehension
3. **Show, not tell** — Work speaks louder than claims; projects, blog, and CV are the evidence
4. **Multilingual capability preserved** — Spanish voice is non-negotiable; technical and creative English in projects/code is supporting context
5. **Performance and polish** — Astro-powered speed, responsive across devices, professional finish that reflects the author's craft

## Accessibility & Inclusion

- WCAG AA minimum for color contrast and interactive elements
- Semantic HTML and ARIA labels for screen readers
- Keyboard navigation and focus management
- Print-friendly CV mode for accessibility and offline use
- Responsive design for all screen sizes and devices


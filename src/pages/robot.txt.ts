import type { APIRoute } from 'astro';

const robotsTxt = `
User-agent: *
Allow: /
Disallow: /terminos-y-condiciones
Disallow: /politicas-de-privacidad
Disallow: /app/
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /404.html
Disallow: /500.html
Disallow: /favicon.ico
Disallow: /registrarse

User-agent: Amazonbot
Disallow: /
User-agent: anthropic-ai
Disallow: /
User-agent: Applebot-Extended
Disallow: /
User-agent: AwarioRssBot
Disallow: /
User-agent: AwarioSmartBot
Disallow: /
User-agent: Bytespider
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: Claude-Web
Disallow: /
User-agent: cohere-ai
Disallow: /
User-agent: DataForSeoBot
Disallow: /
User-agent: Diffbot
Disallow: /
User-agent: FacebookBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: GPTBot
Disallow: /
User-agent: magpie-crawler
Disallow: /
User-agent: NewsNow
Disallow: /
User-agent: news-please
Disallow: /
User-agent: omgili
Disallow: /
User-agent: omgilibot
Disallow: /
User-agent: peer39_crawler
Disallow: /
User-agent: peer39_crawler/1.0
Disallow: /
User-agent: PerplexityBot
Disallow: /
User-agent: Scrapy
Disallow: /
User-agent: TurnitinBot
Disallow: /

Host: ${new URL(import.meta.env.SITE).host}

Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
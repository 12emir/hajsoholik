import type { APIRoute } from 'astro'

export const GET: APIRoute = () => {
  const body = `# Hajsoholik.pl — robots.txt
# Allow AI search & citation crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot).
User-agent: *
Allow: /

# AI search engines — content is public and meant to be cited
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Meta-ExternalAgent
Allow: /
User-agent: Bingbot
Allow: /

# Training-only crawler (no citation value)
User-agent: CCBot
Disallow: /

Sitemap: https://hajsoholik.pl/sitemap-index.xml
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

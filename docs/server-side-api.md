# Server-Side API for Live RSS Updates

For production sites requiring real-time updates, use a serverless API.

## Vercel Serverless Function

Create `api/rss.ts` in your Docusaurus project:

```typescript
// api/rss.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Parser from 'rss-parser';

const parser = new Parser();

// Cache feeds for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { feedUrl } = req.query;

  if (!feedUrl || typeof feedUrl !== 'string') {
    return res.status(400).json({ error: 'feedUrl parameter required' });
  }

  // Check cache
  const cached = cache.get(feedUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    const data = {
      title: feed.title,
      items: feed.items.slice(0, 20)
    };

    // Cache result
    cache.set(feedUrl, { data, timestamp: Date.now() });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
}
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Use in Your Component

```tsx
function LiveFeed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/rss?feedUrl=https://krebsonsecurity.com/feed/')
      .then(res => res.json())
      .then(data => setItems(data.items));
  }, []);

  return <div>{/* Render items */}</div>;
}
```

## Cloudflare Workers

Even more powerful with edge caching:

```typescript
// worker.js
import Parser from 'rss-parser';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const feedUrl = url.searchParams.get('feed');

    if (!feedUrl) {
      return new Response('Missing feed parameter', { status: 400 });
    }

    // Check KV cache
    const cached = await env.RSS_CACHE.get(feedUrl);
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=300'
        }
      });
    }

    // Fetch and parse RSS
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);
    const data = JSON.stringify({ items: feed.items.slice(0, 20) });

    // Cache for 5 minutes
    ctx.waitUntil(env.RSS_CACHE.put(feedUrl, data, { expirationTtl: 300 }));

    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=300'
      }
    });
  }
};
```

## Netlify Functions

```typescript
// netlify/functions/rss.ts
import type { Handler } from '@netlify/functions';
import Parser from 'rss-parser';

const parser = new Parser();

export const handler: Handler = async (event) => {
  const feedUrl = event.queryStringParameters?.feedUrl;

  if (!feedUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'feedUrl required' })
    };
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300'
      },
      body: JSON.stringify({ items: feed.items.slice(0, 20) })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch feed' })
    };
  }
};
```

## Recommendation

For your use case (gl0bal01.com with security feeds):

1. **Keep build-time plugin** for fast initial page load
2. **Add scheduled rebuilds** via GitHub Actions (every 4-6 hours)
3. **Optional**: Add "Refresh" button with client-side fetch via RSS proxy

This gives you:
- ✅ Fast initial load (build-time data)
- ✅ Fresh content several times per day (scheduled rebuilds)
- ✅ Manual refresh option (client-side on-demand)
- ✅ No backend required (if using RSS proxy services)

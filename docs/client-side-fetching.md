# Client-Side RSS Fetching

For real-time RSS updates without rebuilding, fetch feeds on the client side.

## Using RSS Proxy Services

### Option 1: RSS2JSON (Free tier available)

```tsx
import React, { useEffect, useState } from 'react';

function LiveRSSFeed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const feedUrl = 'https://krebsonsecurity.com/feed/';
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

    fetch(proxyUrl)
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {items.map(item => (
        <article key={item.guid}>
          <h2><a href={item.link}>{item.title}</a></h2>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}
```

### Option 2: AllOrigins (Free, no API key)

```tsx
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;

fetch(proxyUrl)
  .then(res => res.json())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, 'text/xml');
    // Parse RSS XML manually
  });
```

### Option 3: Your Own CORS Proxy

Deploy a simple proxy on Vercel/Cloudflare Workers:

```js
// Cloudflare Worker
export default {
  async fetch(request) {
    const url = new URL(request.url).searchParams.get('url');
    const response = await fetch(url);
    const data = await response.text();

    return new Response(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/xml'
      }
    });
  }
}
```

## Hybrid Approach: Build-Time + Client Refresh

Best of both worlds:

```tsx
import React, { useState, useEffect } from 'react';

// Load build-time data (fast initial load)
const buildTimeData = require('@site/.docusaurus/docusaurus-plugin-multi-rss/default/rss-data.json');

function HybridRSSFeed() {
  const [data, setData] = useState(buildTimeData);
  const [loading, setLoading] = useState(false);

  const refreshFeeds = async () => {
    setLoading(true);
    try {
      // Fetch fresh data from proxy
      const response = await fetch('/api/rss-proxy');
      const freshData = await response.json();
      setData(freshData);
    } catch (err) {
      console.error('Failed to refresh feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 10 minutes
    const interval = setInterval(refreshFeeds, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <button onClick={refreshFeeds} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Feeds'}
      </button>
      {/* Render data */}
    </div>
  );
}
```

## Performance Considerations

- **Cache responses**: Use browser cache or localStorage
- **Rate limiting**: Don't hammer RSS feeds
- **Loading states**: Show spinners during fetch
- **Error handling**: Graceful fallbacks

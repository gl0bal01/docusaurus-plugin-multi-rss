# Basic Example

This example demonstrates the basic setup and usage of `docusaurus-plugin-multi-rss`.

## Files Included

- `rss-feeds.config.ts` - Feed configuration with example feeds
- `docusaurus.config.example.ts` - Plugin integration in Docusaurus config
- `news-page.example.tsx` - Example React page component displaying RSS feeds

## Setup Instructions

### 1. Install the Plugin

```bash
npm install docusaurus-plugin-multi-rss
```

### 2. Copy Configuration Files

Copy `rss-feeds.config.ts` to your project root:

```bash
cp examples/basic/rss-feeds.config.ts ./rss-feeds.config.ts
```

### 3. Update docusaurus.config.ts

Add the plugin configuration to your `docusaurus.config.ts`:

```typescript
import { rssFeeds, rssPluginOptions } from './rss-feeds.config';

const config = {
  // ... other config
  plugins: [
    [
      'docusaurus-plugin-multi-rss',
      {
        ...rssPluginOptions,
        feeds: rssFeeds
      }
    ]
  ]
};
```

### 4. Create a News Page

Copy `news-page.example.tsx` to `src/pages/news.tsx`:

```bash
cp examples/basic/news-page.example.tsx src/pages/news.tsx
```

### 5. Build Your Site

```bash
npm run build
# or for development
npm start
```

## Customization

### Add More Feeds

Edit `rss-feeds.config.ts` and add new feeds:

```typescript
export const rssFeeds = {
  // ... existing feeds
  'your-feed-name': {
    url: 'https://example.com/feed.xml',
    category: 'tech',
    title: 'Your Feed Title'
  }
};
```

### Adjust Plugin Settings

Modify plugin options in `rss-feeds.config.ts`:

```typescript
export const rssPluginOptions = {
  maxItemsPerFeed: 30,    // Fetch more items
  concurrency: 3,         // Lower concurrency
  timeout: 20000,         // Longer timeout
};
```

### Create Category-Specific Pages

Create a page for a specific category:

```typescript
// src/pages/cyber-news.tsx
import React from 'react';
import Layout from '@theme/Layout';

const cyberFeeds = require('@site/.docusaurus/docusaurus-plugin-multi-rss/default/category-cyber.json');

export default function CyberNewsPage() {
  return (
    <Layout title="Cybersecurity News">
      <div>
        <h1>Cybersecurity News</h1>
        {cyberFeeds.items.map(item => (
          <article key={item.guid}>
            <h2><a href={item.link}>{item.title}</a></h2>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </Layout>
  );
}
```

## Generated Files

After building, check `.docusaurus/docusaurus-plugin-multi-rss/default/`:

- `rss-data.json` - All RSS data
- `feed-krebs-security.json` - Individual feed data
- `category-cyber.json` - Cyber category items
- `latest-items.json` - Latest 50 items
- `rss-stats.json` - Statistics

## Troubleshooting

### Plugin Not Found

Make sure you've installed the plugin:

```bash
npm install docusaurus-plugin-multi-rss
```

### No RSS Data

1. Clear cache: `npm run clear`
2. Rebuild: `npm run build`
3. Check console for errors

### TypeScript Errors

Add type imports:

```typescript
import type { RSSData, RSSItem } from 'docusaurus-plugin-multi-rss';
```

## Next Steps

- Customize the news page styling
- Add pagination
- Implement more advanced filtering
- Create RSS feed widgets for your sidebar
- Add category badges and icons

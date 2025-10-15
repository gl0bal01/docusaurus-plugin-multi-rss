# docusaurus-plugin-multi-rss


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.0+-green.svg)](https://docusaurus.io/)
[![GitHub](https://img.shields.io/badge/GitHub-gl0bal01-181717?logo=github&logoColor=white)](https://github.com/gl0bal01)


A powerful Docusaurus plugin for aggregating and displaying multiple RSS feeds with category filtering, batch processing, and full TypeScript support.

## Features

- **Multi-Feed Aggregation**: Fetch and combine multiple RSS feeds from different sources
- **Category Organization**: Organize feeds by categories (cyber, osint, ai, tech, etc.)
- **Batch Processing**: Concurrent feed fetching with configurable batch sizes
- **Smart Caching**: Generates optimized JSON files at build time for fast client-side access
- **TypeScript Support**: Full type definitions included
- **Error Handling**: Graceful failure handling with detailed error reporting
- **Customizable**: Flexible configuration options for timeouts, concurrency, and item limits
- **Statistics**: Built-in feed statistics and health monitoring

## Installation

```bash
npm install docusaurus-plugin-multi-rss
# or
yarn add docusaurus-plugin-multi-rss
# or
pnpm add docusaurus-plugin-multi-rss
```

## Quick Start

### 1. Create Feed Configuration

Create a `rss-feeds.config.ts` file in your project root:

```typescript
export interface RSSFeedConfig {
  url: string;
  category: string;
  title: string;
}

export const rssFeeds = {
  'krebs-security': {
    url: 'https://krebsonsecurity.com/feed/',
    category: 'cyber',
    title: 'Krebs on Security'
  },
  'hacker-news': {
    url: 'https://hnrss.org/frontpage',
    category: 'tech',
    title: 'Hacker News'
  },
  // Add more feeds...
};

export const rssPluginOptions = {
  maxItemsPerFeed: 20,
  concurrency: 4,
  enableSeparateFiles: true,
  timeout: 15000,
};
```

### 2. Configure Docusaurus

Add the plugin to your `docusaurus.config.ts`:

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

export default config;
```

### 3. Access RSS Data

The plugin generates several JSON files in `.docusaurus/docusaurus-plugin-multi-rss/default/`:

- `rss-data.json` - Complete RSS data with all feeds
- `feed-{feedKey}.json` - Individual feed data
- `category-{category}.json` - Category-grouped items
- `latest-items.json` - 50 most recent items across all feeds
- `rss-stats.json` - Feed statistics and health status

## Usage in Components

```tsx
import React from 'react';

function MyRSSPage() {
  // Import generated RSS data
  const rssData = require('@site/.docusaurus/docusaurus-plugin-multi-rss/default/rss-data.json');

  return (
    <div>
      <h1>Latest News</h1>
      {rssData.allItems.slice(0, 10).map((item) => (
        <article key={item.guid}>
          <h2><a href={item.link}>{item.title}</a></h2>
          <p>{item.summary}</p>
          <small>
            {item.feedTitle} • {new Date(item.publishedDate).toLocaleDateString()}
          </small>
        </article>
      ))}
    </div>
  );
}

export default MyRSSPage;
```

## Configuration Options

### Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `feeds` | `Record<string, FeedConfig>` | `{}` | RSS feed definitions |
| `maxItemsPerFeed` | `number` | `20` | Maximum items to fetch per feed |
| `concurrency` | `number` | `5` | Number of feeds to fetch concurrently |
| `enableSeparateFiles` | `boolean` | `true` | Generate separate JSON files for feeds/categories |
| `timeout` | `number` | `10000` | Request timeout in milliseconds |

### Feed Configuration

Each feed can be configured with:

```typescript
{
  url: string;        // RSS feed URL (required)
  category?: string;  // Category for organization (default: 'general')
  title?: string;     // Custom title override (defaults to feed's title)
}
```

## Generated Data Structure

### RSSData

```typescript
interface RSSData {
  feeds: Record<string, ProcessedFeed>;      // All feeds by key
  categories: Record<string, RSSItem[]>;      // Items grouped by category
  allItems: RSSItem[];                        // All items sorted by date
  lastUpdated: string;                        // ISO timestamp
  stats: {
    totalFeeds: number;
    successfulFeeds: number;
    failedFeeds: number;
    totalItems: number;
    categoryCounts: Record<string, number>;
  };
}
```

### RSSItem

```typescript
interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  content?: string;
  author?: string;
  categories?: string[];

  // Enhanced fields added by plugin
  feedKey?: string;
  feedTitle?: string;
  category?: string;
  cleanTitle?: string;
  publishedDate?: Date;
  summary?: string;
}
```

## Examples

### Basic Example

See the [examples/basic](./examples/basic) directory for a complete working example.

### Filtering by Category

```tsx
// Load only cyber security feeds
const cyberFeeds = require('@site/.docusaurus/docusaurus-plugin-multi-rss/default/category-cyber.json');

function CyberNews() {
  return (
    <div>
      <h1>Cybersecurity News</h1>
      {cyberFeeds.items.map(item => (
        <article key={item.guid}>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
        </article>
      ))}
    </div>
  );
}
```

### Display Latest Items

```tsx
const latestItems = require('@site/.docusaurus/docusaurus-plugin-multi-rss/default/latest-items.json');

function LatestNews() {
  return (
    <div>
      <h1>Latest from All Feeds</h1>
      {latestItems.map(item => (
        <article key={item.guid}>
          <h2><a href={item.link}>{item.title}</a></h2>
          <small>{item.feedTitle} • {item.category}</small>
        </article>
      ))}
    </div>
  );
}
```

### Feed Statistics

```tsx
const stats = require('@site/.docusaurus/docusaurus-plugin-multi-rss/default/rss-stats.json');

function FeedStats() {
  return (
    <div>
      <h2>Feed Statistics</h2>
      <p>Total Feeds: {stats.totalFeeds}</p>
      <p>Successful: {stats.successfulFeeds}</p>
      <p>Failed: {stats.failedFeeds}</p>
      <p>Total Items: {stats.totalItems}</p>

      <h3>By Category</h3>
      <ul>
        {Object.entries(stats.categoryCounts).map(([cat, count]) => (
          <li key={cat}>{cat}: {count} items</li>
        ))}
      </ul>
    </div>
  );
}
```

## Keeping Feeds Fresh

This plugin fetches RSS feeds at **build time**. To keep content fresh, you have several options:

### Option 1: Scheduled Rebuilds with GitHub Actions (Recommended)

Create `.github/workflows/update-rss-feeds.yml`:

```yaml
name: Update RSS Feeds

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  update-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

**Pros**: Simple, works with GitHub Pages, no backend needed
**Cons**: Limited to hourly updates, uses GitHub Actions minutes

### Option 2: Client-Side Refresh

Add a refresh button using RSS proxy services:

```tsx
const [items, setItems] = useState(buildTimeData);

const refreshFeeds = async () => {
  const proxy = 'https://api.rss2json.com/v1/api.json?rss_url=';
  const response = await fetch(proxy + encodeURIComponent(feedUrl));
  const data = await response.json();
  setItems(data.items);
};
```

See [docs/client-side-fetching.md](./docs/client-side-fetching.md) for more details.

### Option 3: Serverless API

Deploy a serverless function (Vercel/Netlify/Cloudflare) for real-time updates.

See [docs/server-side-api.md](./docs/server-side-api.md) for implementation guide.

## Best Practices

1. **Externalize Feed Configuration**: Keep feeds in a separate config file for easier maintenance
2. **Use Categories**: Organize feeds by topic for better user experience
3. **Adjust Concurrency**: Lower concurrency if you have many feeds to avoid rate limiting
4. **Monitor Stats**: Use the stats file to track feed health and performance
5. **Handle Errors**: Check feed status before rendering to handle failed feeds gracefully
6. **Schedule Rebuilds**: Set up automated rebuilds for fresh content (every 4-6 hours recommended)

## TypeScript

This plugin is written in TypeScript and includes full type definitions. Import types:

```typescript
import type {
  RSSData,
  RSSItem,
  ProcessedFeed,
  FeedConfig,
  PluginOptions
} from 'docusaurus-plugin-multi-rss';
```

## Troubleshooting

### Feeds Not Updating

1. Clear Docusaurus cache: `npm run clear`
2. Rebuild: `npm run build`
3. Check console for feed fetch errors

### CORS Issues

This plugin fetches feeds at **build time**, not in the browser, so CORS is not an issue.

### Timeout Errors

Increase the `timeout` option if feeds are slow to respond:

```typescript
{
  timeout: 30000 // 30 seconds
}
```

### Rate Limiting

Lower the `concurrency` option to fetch fewer feeds simultaneously:

```typescript
{
  concurrency: 2 // Fetch 2 feeds at a time
}
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) file for details

## Demo

- The plugin can be seen in operation on the website: [gl0bal01.com](https://gl0bal01.com)

## Acknowledgments

- Built for the [Docusaurus](https://docusaurus.io) community
- Uses [rss-parser](https://github.com/rbren/rss-parser) for RSS parsing

## Related

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Docusaurus Plugin Guide](https://docusaurus.io/docs/api/plugins)
- [RSS Specification](https://www.rssboard.org/rss-specification)

---

**⭐ Star this repo** if you find it helpful.
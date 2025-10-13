/**
 * Example RSS Feeds Configuration
 *
 * This demonstrates how to configure multiple RSS feeds with categories.
 * Copy this file to your Docusaurus project root and customize as needed.
 */

export interface RSSFeedConfig {
  url: string;
  category: string;
  title: string;
}

export interface RSSFeeds {
  [key: string]: RSSFeedConfig;
}

export interface RSSPluginOptions {
  maxItemsPerFeed?: number;
  concurrency?: number;
  enableSeparateFiles?: boolean;
  timeout?: number;
}

/**
 * RSS Feed Definitions
 * Add your favorite RSS feeds here
 */
export const rssFeeds: RSSFeeds = {
  // Cybersecurity Feeds
  'krebs-security': {
    url: 'https://krebsonsecurity.com/feed/',
    category: 'cyber',
    title: 'Krebs on Security'
  },
  'bleeping-computer': {
    url: 'https://www.bleepingcomputer.com/feed/',
    category: 'cyber',
    title: 'Bleeping Computer'
  },

  // Technology Feeds
  'hacker-news': {
    url: 'https://hnrss.org/frontpage',
    category: 'tech',
    title: 'Hacker News'
  },
  'github-blog': {
    url: 'https://github.blog/feed/',
    category: 'tech',
    title: 'GitHub Blog'
  },

  // AI/ML Feeds
  'openai-blog': {
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai',
    title: 'OpenAI Blog'
  },

  // Add your own feeds here!
};

/**
 * Plugin Options
 * Customize plugin behavior
 */
export const rssPluginOptions: RSSPluginOptions = {
  maxItemsPerFeed: 20,        // Fetch up to 20 items per feed
  concurrency: 4,             // Process 4 feeds at a time
  enableSeparateFiles: true,  // Generate separate JSON files
  timeout: 15000,             // 15 second timeout
};

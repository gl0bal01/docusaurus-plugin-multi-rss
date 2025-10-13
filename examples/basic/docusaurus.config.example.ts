/**
 * Example Docusaurus Configuration
 *
 * This demonstrates how to integrate the multi-RSS plugin into your Docusaurus config.
 * Copy the relevant sections to your actual docusaurus.config.ts
 */

import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { rssFeeds, rssPluginOptions } from './rss-feeds.config';

const config: Config = {
  title: 'My Site',
  tagline: 'My awesome site with RSS feeds',
  url: 'https://example.com',
  baseUrl: '/',

  // ... other config options

  // 🔥 Add the Multi-RSS Plugin
  plugins: [
    [
      'docusaurus-plugin-multi-rss',
      {
        ...rssPluginOptions,
        feeds: rssFeeds
      }
    ]
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'My Site',
      items: [
        {to: '/docs', label: 'Docs', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        // 📰 Add link to RSS news page
        {to: '/news', label: 'News', position: 'left'},
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

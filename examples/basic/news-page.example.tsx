/**
 * Example News Page Component
 *
 * This demonstrates how to create a page that displays RSS feeds.
 * Create this file as src/pages/news.tsx in your Docusaurus project.
 */

import React, { useState } from 'react';
import Layout from '@theme/Layout';
import type { RSSData, RSSItem } from 'docusaurus-plugin-multi-rss';

// Import the generated RSS data
const rssData: RSSData = require('@site/.docusaurus/docusaurus-plugin-multi-rss/default/rss-data.json');

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on category and search
  const filteredItems = rssData.allItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...Object.keys(rssData.categories)];

  return (
    <Layout title="News" description="Latest news from multiple RSS feeds">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1>Latest News</h1>

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Total Feeds</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{rssData.stats.totalFeeds}</p>
          </div>
          <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Total Items</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{rssData.stats.totalItems}</p>
          </div>
          <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Successful</h3>
            <p style={{ fontSize: '2rem', margin: 0, color: 'green' }}>
              {rssData.stats.successfulFeeds}
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Failed</h3>
            <p style={{ fontSize: '2rem', margin: 0, color: 'red' }}>
              {rssData.stats.failedFeeds}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '2rem' }}>
          {/* Category Filter */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Category: </label>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  margin: '0 0.5rem',
                  padding: '0.5rem 1rem',
                  background: selectedCategory === cat ? '#007bff' : '#e0e0e0',
                  color: selectedCategory === cat ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {cat} ({cat === 'all' ? rssData.allItems.length : rssData.stats.categoryCounts[cat] || 0})
              </button>
            ))}
          </div>

          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Results count */}
        <p>Showing {filteredItems.length} items</p>

        {/* News Items */}
        <div>
          {filteredItems.slice(0, 50).map((item: RSSItem) => (
            <article
              key={item.guid || item.link}
              style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                background: '#f9f9f9',
                borderRadius: '8px',
                borderLeft: '4px solid #007bff'
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#007bff' }}
                >
                  {item.title}
                </a>
              </h2>

              <p style={{ color: '#666' }}>{item.summary}</p>

              <div style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                <span><strong>Feed:</strong> {item.feedTitle}</span>
                <span><strong>Category:</strong> {item.category}</span>
                <span><strong>Date:</strong> {new Date(item.publishedDate || '').toLocaleDateString()}</span>
                {item.author && <span><strong>Author:</strong> {item.author}</span>}
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No items found matching your filters.
          </p>
        )}
      </div>
    </Layout>
  );
}

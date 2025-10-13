# Automatic RSS Feed Updates

This guide explains how to keep your RSS feeds fresh with automated rebuilds.

## Problem

The Multi-RSS Plugin fetches feeds at **build time**. This means:
- Feeds only update when you rebuild your site
- Content can become stale between builds
- Manual rebuilds are tedious and easy to forget

## Solution: Scheduled Rebuilds

Use GitHub Actions to automatically rebuild and deploy your site on a schedule.

## Setup Instructions

### 1. Create Workflow File

Create `.github/workflows/update-rss-feeds.yml` in your project:

```yaml
name: Update RSS Feeds

on:
  # Scheduled trigger - every 6 hours
  schedule:
    - cron: '0 */6 * * *'

  # Manual trigger from GitHub Actions tab
  workflow_dispatch:

  # Trigger on config changes
  push:
    branches:
      - main
    paths:
      - 'rss-feeds.config.ts'
      - 'docusaurus.config.ts'

jobs:
  update-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site (fetches fresh RSS feeds)
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: yourdomain.com  # Optional: if using custom domain
```

### 2. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Under **Workflow permissions**, select:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests
4. Click **Save**

### 3. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. Click **Save**

### 4. Test the Workflow

**Manual trigger:**
1. Go to **Actions** tab
2. Select "Update RSS Feeds" workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for completion (2-5 minutes)
5. Check your site for fresh content

**Automatic trigger:**
The workflow will run automatically every 6 hours.

## Customizing Update Frequency

Edit the `cron` schedule in your workflow:

```yaml
schedule:
  # Every 4 hours
  - cron: '0 */4 * * *'

  # Every 12 hours (at midnight and noon UTC)
  - cron: '0 0,12 * * *'

  # Daily at 6 AM UTC
  - cron: '0 6 * * *'

  # Every hour (may hit GitHub Actions limits)
  - cron: '0 * * * *'
```

### Cron Syntax

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

Use [crontab.guru](https://crontab.guru/) to test cron expressions.

## GitHub Actions Limits

**Free tier:**
- 2,000 minutes/month for private repos
- Unlimited for public repos
- 1GB storage

**Typical build:**
- 2-5 minutes per build
- Every 6 hours = 4 builds/day = ~120 builds/month
- Total: ~240-600 minutes/month (well within limits)

## Monitoring

### Check Workflow Status

1. Go to **Actions** tab
2. View recent workflow runs
3. Click a run to see detailed logs
4. Check RSS feed fetch logs

### Email Notifications

GitHub sends email notifications for failed workflows by default.

### Add Discord/Slack Notifications

Add to workflow for custom notifications:

```yaml
- name: Notify Discord on failure
  if: failure()
  run: |
    curl -X POST "${{ secrets.DISCORD_WEBHOOK }}" \
      -H "Content-Type: application/json" \
      -d '{"content": "RSS feed update failed! Check GitHub Actions."}'
```

## Alternative: Netlify/Vercel

### Netlify Build Hooks

1. Go to Netlify dashboard → **Site settings** → **Build & deploy**
2. Create a **Build hook** (gets a webhook URL)
3. Use GitHub Actions to trigger it:

```yaml
- name: Trigger Netlify rebuild
  run: |
    curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```

### Vercel Deploy Hooks

Similar process:
1. Create deploy hook in Vercel dashboard
2. Trigger via cron job or GitHub Actions

## Manual Rebuild Workflow

Create `.github/workflows/manual-deploy.yml`:

```yaml
name: Manual Deploy

on:
  workflow_dispatch:
    inputs:
      reason:
        description: 'Reason for rebuild'
        required: false
        default: 'Manual RSS update'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run clear  # Clear cache
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## Troubleshooting

### Workflow Not Running

**Check:**
1. Workflow file is in `.github/workflows/` directory
2. File has `.yml` or `.yaml` extension
3. YAML syntax is valid (use [yamllint.com](http://yamllint.com/))
4. Actions are enabled in repository settings

### Deploy Fails

**Check:**
1. GitHub Pages is enabled
2. Workflow has write permissions
3. `gh-pages` branch exists
4. Build completes successfully

### Feeds Not Updating

**Check:**
1. Build logs for RSS fetch errors
2. Feed URLs are accessible
3. Increase timeout in `rss-feeds.config.ts`
4. Check feed source is not rate limiting

### Build Takes Too Long

**Optimize:**
1. Lower `maxItemsPerFeed` in config
2. Reduce number of feeds
3. Increase `concurrency` for faster parallel fetching
4. Cache dependencies (`cache: 'npm'` in setup-node action)

## Best Practices

1. **Schedule wisely**: Every 4-6 hours is usually sufficient
2. **Monitor usage**: Check GitHub Actions usage monthly
3. **Cache dependencies**: Speeds up builds significantly
4. **Test locally first**: Run `npm run build` before pushing changes
5. **Use workflow_dispatch**: Always allow manual triggers
6. **Add notifications**: Get alerted if updates fail

## Cost Analysis

| Update Frequency | Builds/Month | Minutes/Month | Cost (Public Repo) |
|------------------|--------------|---------------|-------------------|
| Every 6 hours    | ~120         | 240-600       | FREE              |
| Every 4 hours    | ~180         | 360-900       | FREE              |
| Every 2 hours    | ~360         | 720-1800      | FREE              |
| Every hour       | ~720         | 1440-3600     | FREE (may hit limits) |

Public repositories have unlimited GitHub Actions minutes!

## Next Steps

- Set up monitoring/notifications
- Optimize build time
- Consider client-side refresh for real-time updates
- Explore serverless functions for on-demand fetching

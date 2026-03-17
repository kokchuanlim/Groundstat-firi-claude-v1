# GroundStat FIRI

**Founder Investment Readiness Index** — AI-powered psychological assessment for venture capital due diligence.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/assessment` | 22-question founder assessment |
| `/report` | Sample FIRI investor report |
| `/scoring` | Live AI scoring engine |

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Then edit .env.local and add your Anthropic API key

# 3. Run development server
npm run dev
# → http://localhost:3000
```

## Getting an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key and paste it into `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

> **Security note:** The API key is stored as a server-side environment variable and never exposed to the browser. All Claude API calls are routed through `/api/score`.

---

## Deploy to Vercel

### Option A — Vercel CLI (recommended, ~3 minutes)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy (follow the prompts)
vercel

# 3. Add your API key as an environment variable
vercel env add ANTHROPIC_API_KEY
# Paste your key when prompted, select: Production, Preview, Development

# 4. Redeploy to apply the env var
vercel --prod
```

### Option B — Vercel dashboard (no CLI needed)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create groundstat-firi --public --push
   # or push manually to github.com
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New Project**

3. Import your GitHub repository

4. Under **Environment Variables**, add:
   ```
   Name:  ANTHROPIC_API_KEY
   Value: sk-ant-your-key-here
   ```

5. Click **Deploy**

6. Your site will be live at `https://groundstat-firi.vercel.app` (or your chosen name)

---

## Custom domain

To connect a custom domain (e.g. `groundstat.ai`):

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your domain
3. Update your DNS records as instructed by Vercel
4. SSL is provisioned automatically

---

## Project structure

```
src/
├── pages/
│   ├── _app.tsx          # App wrapper, global CSS
│   ├── _document.tsx     # HTML head, meta tags
│   ├── index.tsx         # Landing page
│   ├── assessment.tsx    # 22-question assessment
│   ├── report.tsx        # Sample FIRI report
│   ├── scoring.tsx       # Live AI scoring engine
│   └── api/
│       └── score.ts      # Server-side Anthropic API proxy
├── components/
│   ├── Nav.tsx           # Shared navigation
│   └── Nav.module.css
└── styles/
    ├── globals.css       # Design tokens + global styles
    ├── Home.module.css
    ├── Assessment.module.css
    ├── Report.module.css
    └── Scoring.module.css
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes (for scoring) | Your Anthropic API key |
| `NEXT_PUBLIC_APP_URL` | No | Public URL of your deployment |

The app runs without an API key — only the `/scoring` page requires it. All other pages are fully static.

---

## Tech stack

- **Next.js 14** — React framework with file-based routing
- **TypeScript** — Type safety throughout
- **CSS Modules** — Scoped, zero-dependency styling
- **Anthropic Claude API** — Scoring engine (`claude-sonnet-4-20250514`)
- **Vercel** — Deployment and serverless API routes

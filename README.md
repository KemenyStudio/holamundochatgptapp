# Hello World Multi-Language App 🌍

A simple OpenAI ChatGPT app that teaches you how to say hello in 20 different languages.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KemenyStudio/holamundochatgptapp)

> ⚡ **Quick Deploy**: Click the button above or see [DEPLOY_NOW.md](./DEPLOY_NOW.md) for one-click deployment!

## Features

- Learn greetings in 20 languages including Spanish, French, Japanese, Mandarin, Arabic, and more
- Get pronunciations for each greeting
- Request random greetings for language learning practice
- View all available greetings at once

## Quick Start

### Installation

```bash
npm install
```

### Run Locally

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## Usage Examples

Once running, you can interact with the app by asking:

- "How do you say hello in Spanish?"
- "Show me all greetings"
- "Give me a random greeting"
- "Hello in Japanese"
- Or mention any supported language!

## Supported Languages

Spanish, French, German, Italian, Portuguese, Japanese, Mandarin Chinese, Korean, Russian, Arabic, Hindi, Greek, Turkish, Dutch, Swedish, Polish, Vietnamese, Thai, Hebrew, and Swahili.

## Deployment

### 🚀 Deploy to Vercel (5 minutes - Recommended!)

**Easiest and fastest deployment method:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Click "Deploy"
4. Connect to ChatGPT with your Vercel URL

👉 **See**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for detailed instructions

### Alternative Deployment Options

- **Render.com**: [QUICKSTART.md](./QUICKSTART.md) - 15 minutes with Docker
- **Complete Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md) - All platforms (Railway, Fly.io, etc.)

### Supported Platforms

- ✅ **Vercel** (⚡ Recommended - 5 min setup, no cold starts, free tier)
- ✅ **Render.com** (Docker-based, free tier available)
- ✅ **Railway** (simple, generous free tier)
- ✅ **Fly.io** (more control, minimal cost)

## Project Structure

```
├── api/                      # Vercel serverless functions
│   ├── health.ts            # Health check endpoint
│   ├── mcp.ts               # Main MCP endpoint
│   └── tools.ts             # Tool discovery endpoint
├── public/                   # Static files
│   └── index.html           # Landing page
├── app.ts                    # Main application logic (CLI)
├── server.ts                 # Node.js server (for non-Vercel deployments)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel configuration
├── Dockerfile                # Container configuration (for Docker deployments)
├── .dockerignore             # Docker ignore rules
├── .gitignore                # Git ignore rules
├── README.md                 # This file
├── VERCEL_DEPLOY.md          # ⚡ 5-minute Vercel deployment guide
├── QUICKSTART.md             # 15-minute Docker deployment guide
├── DEPLOYMENT.md             # Complete deployment documentation
├── chatgpt-manifest.json     # ChatGPT app manifest
└── changelog.md              # Version history
```

## License

MIT

# Quick Start Guide: Deploy in 15 Minutes ⚡

The fastest path from zero to a live ChatGPT app.

## TL;DR

```bash
# 1. Test locally
npm run server

# 2. Push to GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 3. Deploy on Render.com (free)
# - Connect GitHub repo
# - Select "Docker" environment
# - Click "Create Web Service"

# 4. Connect to ChatGPT
# - Copy your Render URL
# - Go to ChatGPT Settings → Apps
# - Add app with URL: https://your-app.onrender.com/mcp
```

Done! 🎉

---

## Detailed Steps

### Step 1: Test Locally (2 minutes)

```bash
# Install dependencies (if not done)
npm install

# Start the MCP server
npm run server
```

You should see:
```
🌍 Multi-Language Greeting App server running on port 3000
📍 Health check: http://localhost:3000/health
🔗 MCP endpoint: http://localhost:3000/mcp
```

**Test it:**
```bash
# In another terminal
curl http://localhost:3000/health
```

### Step 2: Push to GitHub (3 minutes)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Add multi-language greeting app"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render (5 minutes)

1. **Go to** https://render.com
2. **Sign up/Login** (use GitHub for easier integration)
3. **Click "New +"** → **"Web Service"**
4. **Connect your repository** (authorize GitHub if needed)
5. **Configure:**
   - **Name**: `multilang-greeting-app` (or any name you like)
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Plan**: `Free` (or starter for better performance)
6. **Click "Create Web Service"**
7. **Wait for build** (2-5 minutes) - watch the logs
8. **Copy your URL**: `https://multilang-greeting-app.onrender.com`

### Step 4: Connect to ChatGPT (5 minutes)

1. **Open ChatGPT**: https://chatgpt.com
2. **Go to Settings** → Click your profile → **Settings**
3. **Navigate to Apps**: Look for the "Apps" section
4. **Click "Connect New App"** (or similar button)
5. **Enter your endpoint**:
   ```
   https://your-app-name.onrender.com/mcp
   ```
6. **Authorize** and follow prompts

### Step 5: Test in ChatGPT (1 minute)

Open a new chat and try:

```
Use the greeting app to teach me how to say hello in Japanese
```

```
Show me all available greetings
```

```
Give me a random greeting
```

---

## Troubleshooting

### "Server not responding"
- ✅ Check Render dashboard → Logs tab
- ✅ Wait 30 seconds (free tier cold start)
- ✅ Visit health endpoint: `https://your-app.onrender.com/health`

### "Can't connect to GitHub"
- ✅ Make sure repo is public (or Render has access)
- ✅ Verify you pushed to `main` branch

### "Build failed"
- ✅ Check Render build logs
- ✅ Ensure `Dockerfile` is in repo root
- ✅ Verify all files are committed

### "ChatGPT can't find my app"
- ✅ Use HTTPS (not HTTP)
- ✅ Add `/mcp` to the end of your URL
- ✅ Verify endpoint works: `curl https://your-app.onrender.com/health`

---

## Alternative: Deploy to Railway

If Render doesn't work, try Railway:

1. Go to https://railway.app
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repo
4. Railway auto-detects Dockerfile
5. **"Deploy"** → Copy your URL

That's it! Railway auto-configures everything.

---

## Alternative: Deploy to Fly.io

For more control:

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (creates fly.toml)
fly launch

# Deploy
fly deploy

# Get URL
fly status
```

---

## What's Next?

- ✅ **Monitor**: Check Render dashboard for logs and metrics
- ✅ **Iterate**: Make changes, git push, auto-deploys
- ✅ **Upgrade**: Move to paid tier ($7/mo) for no cold starts
- ✅ **Share**: Give your team the ChatGPT app link

---

## Cost Summary

| Platform | Free Tier | Paid | Cold Start |
|----------|-----------|------|------------|
| Render | 750hrs/mo | $7/mo | Yes (~30s) |
| Railway | 500hrs/mo | $5/mo | Yes (~20s) |
| Fly.io | 3 VMs | $1.94/mo | No |

**Recommendation**: Start with Render free tier, upgrade if you use it daily.

---

## Full Documentation

- **Complete Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **App Documentation**: See [README.md](./README.md)
- **Change History**: See [changelog.md](./changelog.md)

---

**Total Time**: ~15-20 minutes
**Difficulty**: ⭐ Beginner-friendly

You've got this! 🚀

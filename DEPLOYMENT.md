# Deployment Guide: Multi-Language Greeting App

This guide walks you through deploying your greeting app to ChatGPT using the OpenAI Apps SDK.

## Prerequisites

- GitHub account (for deployment)
- ChatGPT Plus or Team subscription (required for custom apps)
- Basic familiarity with command line

## Deployment Steps

### Step 1: Prepare Your App for Production

Your app needs to expose an MCP (Model Context Protocol) endpoint that ChatGPT can communicate with.

#### 1.1 Create the MCP Server

Create a new file `server.ts`:

```bash
# Create the server file (we'll add this next)
```

#### 1.2 Create a Dockerfile

Your app will run in a container. Create `Dockerfile` in the project root:

```bash
# We'll create this file (added next)
```

### Step 2: Choose a Deployment Platform

We recommend **Render.com** for its simplicity (free tier available):

**Alternative Options:**
- Fly.io (more control, requires credit card)
- Railway (simple, generous free tier)
- Vercel (serverless, easy GitHub integration)

### Step 3: Deploy to Render.com

#### 3.1 Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Multi-language greeting app"

# Create a new GitHub repository, then:
git remote add origin https://github.com/YOUR_USERNAME/holamundochatgptapp.git
git branch -M main
git push -u origin main
```

#### 3.2 Deploy on Render

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `multilang-greeting-app`
   - **Environment**: `Docker`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Plan**: Free (or paid for better performance)

5. Click **"Create Web Service"**

6. Wait for deployment (2-5 minutes)

7. Copy your app URL (e.g., `https://multilang-greeting-app.onrender.com`)

### Step 4: Connect to ChatGPT

#### 4.1 Create App Manifest

You'll need a manifest that describes your app to ChatGPT.

Create `chatgpt-manifest.json`:

```bash
# We'll create this file
```

#### 4.2 Register Your App with ChatGPT

1. Go to ChatGPT: https://chatgpt.com
2. Click your profile → **Settings** → **Apps**
3. Click **"Connect New App"**
4. Enter your app endpoint:
   ```
   https://YOUR-APP-URL.onrender.com/mcp
   ```
5. Follow the prompts to authorize the app

### Step 5: Test Your App

#### 5.1 Test in ChatGPT

Open a new chat and try:
- "Use the greeting app to teach me Spanish"
- "Show me all available greetings"
- "Give me a random greeting"

#### 5.2 Debug Mode

Enable developer mode in ChatGPT settings to see:
- Tool invocations
- Request/response logs
- Error messages

### Step 6: Monitor and Maintain

#### Check Logs

On Render:
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Monitor for errors or issues

#### Update Your App

```bash
# Make changes locally
git add .
git commit -m "Update: description of changes"
git push

# Render will automatically redeploy
```

## Troubleshooting

### App Not Responding
- Check Render logs for errors
- Verify the `/mcp` endpoint is accessible
- Test directly: `curl https://your-app.onrender.com/mcp`

### ChatGPT Can't Connect
- Ensure your URL uses HTTPS (not HTTP)
- Verify the endpoint returns valid JSON
- Check that CORS headers are properly set

### Deployment Fails
- Review Render build logs
- Ensure Dockerfile syntax is correct
- Check that all dependencies are in package.json

## Cost Considerations

### Free Tier (Render)
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free

### Paid Tier ($7/month)
- Always-on (no cold starts)
- More CPU/memory
- Better for production use

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Rate limiting**: Consider adding rate limits for production
3. **Input validation**: Already implemented in the app
4. **HTTPS only**: Render provides this automatically

## Next Steps

After successful deployment:

1. **Share your app**: Give the app URL to team members
2. **Monitor usage**: Check Render analytics
3. **Iterate**: Add more languages or features
4. **Scale**: Upgrade to paid tier if needed

## Support Resources

- OpenAI Apps SDK Docs: https://developers.openai.com/apps-sdk
- Render Documentation: https://render.com/docs
- GitHub Issues: Create issues in your repo

---

**Estimated Time to Deploy**: 15-20 minutes

**Difficulty Level**: Beginner-friendly

Good luck with your deployment! 🚀

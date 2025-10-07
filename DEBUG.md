# Debug Guide for Vercel Deployment

## Current Setup

We have 4 API endpoints in the `/api` folder:
- `api/index.ts` - Root landing page
- `api/health.ts` - Health check
- `api/mcp.ts` - Main MCP endpoint
- `api/tools.ts` - Tool discovery

## URLs to Test

After deployment, test these URLs in order:

### 1. Direct API Routes (Should Always Work)

```bash
# These use Vercel's automatic /api/* routing
curl https://YOUR-APP.vercel.app/api/index
curl https://YOUR-APP.vercel.app/api/health
curl https://YOUR-APP.vercel.app/api/mcp -X POST -H "Content-Type: application/json" -d '{"params":{"arguments":{"query":"hello"}}}'
curl https://YOUR-APP.vercel.app/api/tools
```

### 2. Custom Rewrite Routes (May Need Configuration)

```bash
# These use vercel.json rewrites
curl https://YOUR-APP.vercel.app/
curl https://YOUR-APP.vercel.app/health
curl https://YOUR-APP.vercel.app/mcp
curl https://YOUR-APP.vercel.app/mcp/tools
```

## Troubleshooting Steps

### Step 1: Check Vercel Build Logs

1. Go to https://vercel.com/dashboard
2. Find your project
3. Click on the latest deployment
4. Check "Build Logs" - look for:
   - ✅ "Build completed successfully"
   - ✅ List of API routes detected
   - ❌ Any errors

### Step 2: Check Function Logs

1. In Vercel dashboard → Your project
2. Click "Functions" tab
3. You should see 4 functions listed
4. Click each one to see logs/errors

### Step 3: Test Direct API Routes First

If `/api/health` works but `/health` doesn't:
- The functions are deployed correctly
- The rewrites in vercel.json might not be working
- **Solution**: Use the `/api/*` paths directly

### Step 4: Check Your Vercel URL

Make sure you're using the correct URL format:
```
https://PROJECT-NAME.vercel.app/api/health
```

NOT:
```
https://PROJECT-NAME-HASH.vercel.app/health  ❌
```

## Common Issues & Fixes

### Issue: "404 NOT_FOUND"

**Possible causes:**
1. Functions haven't deployed yet (wait 1-2 minutes)
2. Wrong URL (check Vercel dashboard for correct URL)
3. Rewrites not working (use `/api/*` paths directly)

**Fix:**
```bash
# Try the direct API path
curl https://YOUR-APP.vercel.app/api/health
```

### Issue: "500 Internal Server Error"

**Possible causes:**
1. TypeScript compilation error
2. Missing dependencies
3. Runtime error in function

**Fix:**
Check function logs in Vercel dashboard

### Issue: "Method Not Allowed"

**Possible cause:**
Using wrong HTTP method

**Fix:**
- `/api/health` → GET
- `/api/mcp` → POST
- `/api/tools` → GET

## For ChatGPT Integration

Once you confirm the endpoints work, use:

```
https://YOUR-APP.vercel.app/api/mcp
```

NOT:
```
https://YOUR-APP.vercel.app/mcp
```

The direct `/api/*` path is more reliable.

## Test Script

Save this as `test-vercel.sh`:

```bash
#!/bin/bash

# Replace with your actual Vercel URL
URL="https://YOUR-APP.vercel.app"

echo "Testing Vercel deployment..."
echo ""

echo "1. Testing /api/health (should return JSON)"
curl -s "$URL/api/health" | jq .
echo ""

echo "2. Testing /api/tools (should return tools list)"
curl -s "$URL/api/tools" | jq .
echo ""

echo "3. Testing /api/mcp (should return greeting)"
curl -s -X POST "$URL/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","params":{"arguments":{"query":"Spanish"}},"id":1}' | jq .
echo ""

echo "4. Testing root / (should return HTML)"
curl -s "$URL/" | head -20
echo ""

echo "Done!"
```

## Next Steps

1. Wait for Vercel to redeploy (1-2 min)
2. Find your deployment URL in Vercel dashboard
3. Test `/api/health` first
4. If that works, test `/api/mcp`
5. Use the working URL for ChatGPT

## Contact

If still having issues, share:
1. Your Vercel deployment URL
2. The exact error message
3. Which endpoint you're trying to access

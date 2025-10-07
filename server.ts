import { createServer } from 'http';
import { handleGreetingRequest } from './app.js';

const PORT = process.env.PORT || 3000;

interface MCPRequest {
  method: string;
  params?: {
    arguments?: {
      query?: string;
    };
  };
}

interface MCPResponse {
  jsonrpc: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
  id: number | string | null;
}

// MCP server implementation
const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      app: 'Multi-Language Greeting App',
      version: '1.0.0',
      languages: 20
    }));
    return;
  }

  // MCP endpoint
  if (req.url === '/mcp' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const request: MCPRequest = JSON.parse(body);
        
        // Handle the greeting request
        const query = request.params?.arguments?.query || '';
        const result = handleGreetingRequest(query);

        const response: MCPResponse = {
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: result
              }
            ]
          },
          id: (request as any).id || null
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (error) {
        const errorResponse: MCPResponse = {
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: error instanceof Error ? error.message : 'Parse error'
          },
          id: null
        };

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(errorResponse));
      }
    });

    return;
  }

  // Tool discovery endpoint
  if (req.url === '/mcp/tools' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      tools: [
        {
          name: 'learn_greeting',
          description: 'Learn how to say hello in different languages. Supports 20 languages with pronunciations.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Ask about a specific language, request a random greeting, or list all greetings'
              }
            },
            required: ['query']
          }
        }
      ]
    }));
    return;
  }

  // 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🌍 Multi-Language Greeting App server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`\nReady to teach greetings in 20 languages!`);
});

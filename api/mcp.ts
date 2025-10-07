import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Greeting {
  language: string;
  hello: string;
  pronunciation?: string;
}

const greetings: Greeting[] = [
  { language: "Spanish", hello: "Hola", pronunciation: "OH-lah" },
  { language: "French", hello: "Bonjour", pronunciation: "bohn-ZHOOR" },
  { language: "German", hello: "Hallo", pronunciation: "HAH-loh" },
  { language: "Italian", hello: "Ciao", pronunciation: "CHOW" },
  { language: "Portuguese", hello: "Olá", pronunciation: "oh-LAH" },
  { language: "Japanese", hello: "こんにちは (Konnichiwa)", pronunciation: "kon-nee-chee-wah" },
  { language: "Mandarin Chinese", hello: "你好 (Nǐ hǎo)", pronunciation: "nee-how" },
  { language: "Korean", hello: "안녕하세요 (Annyeonghaseyo)", pronunciation: "ahn-nyeong-hah-seh-yo" },
  { language: "Russian", hello: "Привет (Privet)", pronunciation: "pree-VYET" },
  { language: "Arabic", hello: "مرحبا (Marhaba)", pronunciation: "mar-HA-bah" },
  { language: "Hindi", hello: "नमस्ते (Namaste)", pronunciation: "nah-mah-STAY" },
  { language: "Greek", hello: "Γεια σου (Yassou)", pronunciation: "YAH-soo" },
  { language: "Turkish", hello: "Merhaba", pronunciation: "mehr-hah-BAH" },
  { language: "Dutch", hello: "Hallo", pronunciation: "HAH-loh" },
  { language: "Swedish", hello: "Hej", pronunciation: "hey" },
  { language: "Polish", hello: "Cześć", pronunciation: "cheshch" },
  { language: "Vietnamese", hello: "Xin chào", pronunciation: "sin chow" },
  { language: "Thai", hello: "สวัสดี (Sawasdee)", pronunciation: "sah-waht-dee" },
  { language: "Hebrew", hello: "שלום (Shalom)", pronunciation: "shah-LOHM" },
  { language: "Swahili", hello: "Jambo", pronunciation: "JAHM-boh" }
];

function handleGreetingRequest(input: string): string {
  const lowerInput = input.toLowerCase();

  const languageMatch = greetings.find(g => 
    lowerInput.includes(g.language.toLowerCase())
  );
  
  if (languageMatch) {
    return `In ${languageMatch.language}, you say: ${languageMatch.hello}${
      languageMatch.pronunciation ? ` (pronounced: ${languageMatch.pronunciation})` : ''
    }`;
  }

  if (lowerInput.includes('random') || lowerInput.includes('surprise')) {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return `Here's a greeting from ${greeting.language}: ${greeting.hello}${
      greeting.pronunciation ? ` (pronounced: ${greeting.pronunciation})` : ''
    }`;
  }

  if (lowerInput.includes('all') || lowerInput.includes('list') || lowerInput.includes('show')) {
    const allGreetings = greetings
      .map(g => `• ${g.language}: ${g.hello}${g.pronunciation ? ` (${g.pronunciation})` : ''}`)
      .join('\n');
    return `Here are greetings in ${greetings.length} languages:\n\n${allGreetings}`;
  }

  return `Welcome to the Multi-Language Greeting App! 🌍\n\nI can teach you how to say hello in ${greetings.length} different languages!\n\nTry asking me:\n• "How do you say hello in Spanish?"\n• "Show me all greetings"\n• "Give me a random greeting"\n• Or just mention any language!\n\nAvailable languages: ${greetings.map(g => g.language).join(', ')}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET - Server metadata
  if (req.method === 'GET') {
    return res.status(200).json({
      type: 'mcp_server',
      name: 'Multi-Language Greeting App',
      description: 'Learn how to say hello in 20 different languages with pronunciations',
      version: '1.0.0',
      capabilities: {
        tools: true
      }
    });
  }

  // Handle POST - MCP requests
  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('Received MCP request:', JSON.stringify(body, null, 2));

      // Handle initialize
      if (body.method === 'initialize') {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: 'Multi-Language Greeting App',
              version: '1.0.0'
            }
          }
        });
      }

      // Handle tools/list
      if (body.method === 'tools/list') {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            tools: [
              {
                name: 'learn_greeting',
                description: 'Learn how to say hello in different languages. Ask about a specific language, request a random greeting, or list all 20 available greetings with pronunciations.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'Your question or request (e.g., "Spanish", "show all", "random")'
                    }
                  },
                  required: ['query']
                }
              }
            ]
          }
        });
      }

      // Handle tools/call
      if (body.method === 'tools/call') {
        const toolName = body.params?.name;
        const args = body.params?.arguments || {};
        
        if (toolName === 'learn_greeting') {
          const query = args.query || '';
          const result = handleGreetingRequest(query);
          
          return res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [
                {
                  type: 'text',
                  text: result
                }
              ]
            }
          });
        }
      }

      // Default error for unknown methods
      return res.status(200).json({
        jsonrpc: '2.0',
        id: body.id || null,
        error: {
          code: -32601,
          message: `Method not found: ${body.method}`
        }
      });

    } catch (error) {
      console.error('MCP Error:', error);
      return res.status(200).json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: error instanceof Error ? error.message : 'Parse error'
        }
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
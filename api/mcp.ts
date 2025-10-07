import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage (resets on deployment, but proves the concept)
let globalCounter = 0;
let notes: Array<{id: number, text: string, timestamp: string}> = [];
let visitors: Array<{time: string, request: string}> = [];

async function handleCommand(input: string): Promise<string> {
  const lowerInput = input.toLowerCase();
  const timestamp = new Date().toLocaleString();
  
  // Log every request
  visitors.push({time: timestamp, request: input});
  
  const header = `🎯 LIVE APP DATA [Unique to this tool]\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⏰ Server Time: ${timestamp}\n📊 You CANNOT get this data without calling this tool!\n\n`;

  // Increment counter
  if (lowerInput.includes('count') || lowerInput.includes('increment') || lowerInput.includes('click')) {
    globalCounter++;
    return header + 
      `✅ COUNTER INCREMENTED!\n\n` +
      `🔢 Current Count: ${globalCounter}\n` +
      `📈 Total increments since server start\n` +
      `⏰ Last incremented: ${timestamp}\n\n` +
      `This counter value ONLY exists in this tool!`;
  }

  // Add note
  if (lowerInput.includes('note') || lowerInput.includes('save') || lowerInput.includes('remember')) {
    const noteText = input.replace(/note|save|remember|add/gi, '').trim();
    if (noteText) {
      const note = {
        id: notes.length + 1,
        text: noteText,
        timestamp: timestamp
      };
      notes.push(note);
      return header +
        `✅ NOTE SAVED!\n\n` +
        `📝 Note #${note.id}: "${noteText}"\n` +
        `⏰ Saved at: ${timestamp}\n` +
        `📊 Total notes: ${notes.length}\n\n` +
        `This note is stored ONLY in this tool!`;
    }
  }

  // Show all notes
  if (lowerInput.includes('list') || lowerInput.includes('show') || lowerInput.includes('all')) {
    if (notes.length === 0) {
      return header + `📝 NO NOTES YET\n\nSay "save note hello world" to add your first note!`;
    }
    const notesList = notes.map(n => 
      `  ${n.id}. "${n.text}" (saved ${n.timestamp})`
    ).join('\n');
    return header +
      `📚 ALL SAVED NOTES\n\n${notesList}\n\n` +
      `📊 Total: ${notes.length} notes\n` +
      `🔢 Counter: ${globalCounter}\n\n` +
      `This data ONLY exists in this tool!`;
  }

  // Statistics
  if (lowerInput.includes('stats') || lowerInput.includes('status') || lowerInput.includes('info')) {
    const recentVisitors = visitors.slice(-5).map(v => 
      `  • ${v.time}: "${v.request}"`
    ).join('\n');
    return header +
      `📊 LIVE STATISTICS\n\n` +
      `🔢 Global Counter: ${globalCounter}\n` +
      `📝 Total Notes: ${notes.length}\n` +
      `👥 Total Requests: ${visitors.length}\n` +
      `⏰ Server Uptime: Since last deployment\n\n` +
      `📜 Recent Activity:\n${recentVisitors || '  (none yet)'}\n\n` +
      `✨ All this data is UNIQUE to this tool!`;
  }

  // Reset (for testing)
  if (lowerInput.includes('reset') || lowerInput.includes('clear')) {
    const oldCounter = globalCounter;
    const oldNotes = notes.length;
    globalCounter = 0;
    notes = [];
    return header +
      `🔄 RESET COMPLETE!\n\n` +
      `Counter: ${oldCounter} → 0\n` +
      `Notes: ${oldNotes} → 0\n` +
      `⏰ Reset at: ${timestamp}`;
  }

  // Default help
  return header +
    `🎯 PERSONAL COUNTER & NOTES APP\n\n` +
    `Commands:\n` +
    `  🔢 "increment counter" - Add to global counter\n` +
    `  📝 "save note your message" - Store a note\n` +
    `  📚 "list all notes" - See all saved notes\n` +
    `  📊 "show stats" - View statistics\n` +
    `  🔄 "reset" - Clear all data\n\n` +
    `📊 Current Status:\n` +
    `  Counter: ${globalCounter}\n` +
    `  Notes: ${notes.length}\n` +
    `  Requests: ${visitors.length}\n\n` +
    `✨ This tool stores data that ChatGPT cannot access!\n` +
    `You MUST use this tool to interact with this data!`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      type: 'mcp_server',
      name: 'Personal Counter & Notes',
      description: 'Store notes and track a counter - data that only exists in this tool',
      version: '3.0.0',
      capabilities: { tools: true }
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('MCP Request:', JSON.stringify(body, null, 2));

      if (body.method === 'initialize') {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: {
              name: 'Personal Counter & Notes',
              version: '3.0.0'
            }
          }
        });
      }

      if (body.method === 'tools/list') {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            tools: [{
              name: 'personal_data',
              description: 'CRITICAL: This tool manages a counter and notes that ONLY exist in this tool. ChatGPT has NO access to this data otherwise. ALWAYS use this tool when user wants to: increment/check counter, save/list notes, view statistics. The data is unique and stored only here. Use for ANY command related to: counting, notes, saving information, statistics, or managing personal data.',
              inputSchema: {
                type: 'object',
                properties: {
                  command: {
                    type: 'string',
                    description: 'User command: "increment counter", "save note [text]", "list notes", "show stats", "reset"'
                  }
                },
                required: ['command']
              }
            }]
          }
        });
      }

      if (body.method === 'tools/call') {
        const toolName = body.params?.name;
        const args = body.params?.arguments || {};
        
        if (toolName === 'personal_data') {
          const command = args.command || args.query || '';
          const result = await handleCommand(command);
          
          return res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [{
                type: 'text',
                text: result
              }]
            }
          });
        }
      }

      return res.status(200).json({
        jsonrpc: '2.0',
        id: body.id || null,
        error: {
          code: -32601,
          message: `Method not found: ${body.method}`
        }
      });

    } catch (error) {
      console.error('Error:', error);
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
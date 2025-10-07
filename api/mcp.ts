import type { VercelRequest, VercelResponse } from '@vercel/node';

// Pokemon API fetcher
async function fetchPokemon(nameOrId: string): Promise<any> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function getRandomPokemon(): Promise<any> {
  const randomId = Math.floor(Math.random() * 898) + 1; // Gen 1-8
  return await fetchPokemon(randomId.toString());
}

// Keep track of usage
let usageCount = 0;

async function handlePokemonRequest(input: string): Promise<string> {
  usageCount++;
  const timestamp = new Date().toISOString();
  
  const lowerInput = input.toLowerCase();
  const toolHeader = `🎮 LIVE POKEMON API DATA [Request #${usageCount}]\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⏰ Fetched: ${new Date().toLocaleString()}\n🌐 Source: pokeapi.co (LIVE)\n\n`;

  let pokemon: any = null;

  // Handle random request
  if (lowerInput.includes('random') || lowerInput.includes('surprise')) {
    pokemon = await getRandomPokemon();
  } else {
    // Extract pokemon name or number from input
    const words = input.split(' ');
    for (const word of words) {
      const cleaned = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleaned) {
        pokemon = await fetchPokemon(cleaned);
        if (pokemon) break;
      }
    }
  }

  if (!pokemon) {
    return toolHeader + `❌ Pokemon not found!\n\n` +
           `Try:\n` +
           `• "Show me Pikachu"\n` +
           `• "Get pokemon Charizard"\n` +
           `• "Random pokemon"\n` +
           `• Any Pokemon name or number (1-898)`;
  }

  // Format Pokemon card
  const types = pokemon.types.map((t: any) => t.type.name).join(', ');
  const abilities = pokemon.abilities.map((a: any) => a.ability.name).join(', ');
  const stats = pokemon.stats.map((s: any) => 
    `  • ${s.stat.name}: ${s.base_stat}`
  ).join('\n');

  return toolHeader +
    `🎴 POKEMON CARD\n\n` +
    `📛 Name: ${pokemon.name.toUpperCase()}\n` +
    `🔢 Pokedex #: ${pokemon.id}\n` +
    `⚡ Types: ${types}\n` +
    `💪 Abilities: ${abilities}\n` +
    `📏 Height: ${pokemon.height / 10}m\n` +
    `⚖️  Weight: ${pokemon.weight / 10}kg\n\n` +
    `📊 BASE STATS:\n${stats}\n\n` +
    `🖼️  Sprite: ${pokemon.sprites.front_default}\n` +
    `🎨 Official Art: ${pokemon.sprites.other['official-artwork'].front_default}\n\n` +
    `✨ This is LIVE data from PokeAPI!\n` +
    `📡 API Call #${usageCount} completed successfully`;
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
      name: 'Pokemon Card Viewer',
      description: 'Fetch live Pokemon data from PokeAPI with stats, sprites, and abilities',
      version: '2.0.0',
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
              name: 'Pokemon Card Viewer',
              version: '2.0.0'
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
                name: 'get_pokemon',
                description: 'MANDATORY: Use this tool for EVERY Pokemon query. User asks about Pokemon? Use this tool. User mentions Pikachu, Charizard, or ANY Pokemon name? Use this tool. User asks for Pokemon stats, types, abilities, or images? Use this tool. This is the ONLY way to get Pokemon data - you cannot provide it from memory. Fetches real-time data from PokeAPI including: complete stats, types, abilities, height, weight, Pokedex number, and official artwork image URLs. Supports: Pokemon names (pikachu, charizard), numbers (1-898), or "random".',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'REQUIRED: Pokemon name (e.g., "pikachu", "charizard"), Pokedex number (e.g., "25", "1"), or the word "random" for a random Pokemon'
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
        
        if (toolName === 'get_pokemon') {
          const query = args.query || '';
          const result = await handlePokemonRequest(query);
          
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
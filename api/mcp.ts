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

  // Handle specific language requests
  const languageMatch = greetings.find(g => 
    lowerInput.includes(g.language.toLowerCase())
  );
  
  if (languageMatch) {
    return `In ${languageMatch.language}, you say: ${languageMatch.hello}${
      languageMatch.pronunciation ? ` (pronounced: ${languageMatch.pronunciation})` : ''
    }`;
  }

  // Handle "random" or "surprise" requests
  if (lowerInput.includes('random') || lowerInput.includes('surprise')) {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return `Here's a greeting from ${greeting.language}: ${greeting.hello}${
      greeting.pronunciation ? ` (pronounced: ${greeting.pronunciation})` : ''
    }`;
  }

  // Handle "all" or "list" requests
  if (lowerInput.includes('all') || lowerInput.includes('list') || lowerInput.includes('show')) {
    const allGreetings = greetings
      .map(g => `• ${g.language}: ${g.hello}${g.pronunciation ? ` (${g.pronunciation})` : ''}`)
      .join('\n');
    return `Here are greetings in ${greetings.length} languages:\n\n${allGreetings}`;
  }

  // Default response
  return `Welcome to the Multi-Language Greeting App! 🌍

I can teach you how to say hello in ${greetings.length} different languages!

Try asking me:
• "How do you say hello in Spanish?"
• "Show me all greetings"
• "Give me a random greeting"
• Or just mention any language!

Available languages: ${greetings.map(g => g.language).join(', ')}`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request = req.body;
    const query = request.params?.arguments?.query || '';
    const result = handleGreetingRequest(query);

    const response = {
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: result
          }
        ]
      },
      id: request.id || null
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: error instanceof Error ? error.message : 'Parse error'
      },
      id: null
    };

    return res.status(400).json(errorResponse);
  }
}

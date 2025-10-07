#!/usr/bin/env node

/**
 * Hello World Multi-Language Greeting App
 * A simple OpenAI ChatGPT app that teaches users how to say hello in different languages
 */

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

function getRandomGreeting(): Greeting {
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function getAllGreetings(): string {
  return greetings
    .map(g => `• ${g.language}: ${g.hello}${g.pronunciation ? ` (${g.pronunciation})` : ''}`)
    .join('\n');
}

function getGreetingByLanguage(language: string): Greeting | undefined {
  return greetings.find(g => 
    g.language.toLowerCase() === language.toLowerCase()
  );
}

// Main function for the app
export function handleGreetingRequest(input: string): string {
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
    const greeting = getRandomGreeting();
    return `Here's a greeting from ${greeting.language}: ${greeting.hello}${
      greeting.pronunciation ? ` (pronounced: ${greeting.pronunciation})` : ''
    }`;
  }

  // Handle "all" or "list" requests
  if (lowerInput.includes('all') || lowerInput.includes('list') || lowerInput.includes('show')) {
    return `Here are greetings in ${greetings.length} languages:\n\n${getAllGreetings()}`;
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

// Simple CLI interface for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Multi-Language Greeting App');
  console.log('Type your question or "exit" to quit\n');

  const askQuestion = () => {
    rl.question('You: ', (answer: string) => {
      if (answer.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      console.log('\n' + handleGreetingRequest(answer) + '\n');
      askQuestion();
    });
  };

  askQuestion();
}

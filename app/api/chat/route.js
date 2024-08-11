import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.5,
  topP: 0.9,
  maxOutputTokens: 100,
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig,
});

let chatSession;

async function initChatSession() {
  chatSession = await model.startChat({
    history: [],
    generationConfig: {
      ...generationConfig,
      maxOutputTokens: 100,
    },
  });
}

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function GET() {
  if (!chatSession) {
    await initChatSession();
  }

  const iterator = makeIterator([]);
  const stream = iteratorToStream(iterator);
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    },
  });
}


export async function POST(request) {
  if (!chatSession) {
    await initChatSession();
  }

  const req = await request.json();
  const newMessage = req.messages[req.messages.length - 1];

  async function* makeIterator() {
    try {
      const result = await chatSession.sendMessageStream(newMessage.content);
      let isFirstChunk = true;
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (isFirstChunk && text.trim() === '') {
          continue; // Skip the first empty chunk
        }
        isFirstChunk = false;
        yield text;
      }
    } catch (error) {
      console.error(error);
      yield "An error occurred. Please try again.";
    }
  }

  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    },
  });
}
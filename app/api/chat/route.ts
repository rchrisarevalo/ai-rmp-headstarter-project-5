import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { ChatMessage } from "@/app/types/types.config";

const systemPrompt = process.env?.SYSTEM_PROMPT as string;

export async function POST(request: NextRequest) {
  const data: ChatMessage[] = await request.json();
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });
  const index = pc.index("rag").namespace("ns1");
  const openai = new OpenAI();

  const text = data[data.length - 2].content;

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  let resultString = "\n\nReturned results from vector DB done automatically: ";
  results.matches.forEach((match) => {
    resultString += `\n
    
    Professor: ${match.id}
    Review: ${match.metadata?.review}
    Subject: ${match.metadata?.subject}
    Stars ${match.metadata?.stars}
    \n\n
    `;
  });

  const lastMessage = data[data.length - 1].content;
  const lastMessageContent = lastMessage + resultString;

  // Pushes recommendations into array containing messages
  // between user and assistant to provide recommended
  // professors when returning the response from the AI
  // to the user.
  data.push({ role: "user", content: lastMessageContent });

  // Include the system prompt so that the AI can make better
  // recommendations based on the instructions it is provided.
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...(data as OpenAI.Chat.Completions.ChatCompletionMessageParam[]),
    ],
    model: "gpt-4o-mini",
  });

  const response = completion.choices[0].message.content;

  // const stream = new ReadableStream({
  //   async start(controller) {
  //     const encoder = new TextEncoder();
  //     try {
  //       for await (const chuck of completion) {
  //         const content = chuck.choices[0]?.delta?.content;
  //         if (content) {
  //           const text = encoder.encode(content);
  //           controller.enqueue(text);
  //         }
  //       }
  //     } catch (error) {
  //       controller.error(error);
  //     } finally {
  //       controller.close();
  //     }
  //   },
  // });

  // console.log("Finished!")

  return NextResponse.json({ role: "assistant", content: response });
}

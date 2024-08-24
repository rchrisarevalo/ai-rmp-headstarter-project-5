import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { ChatMessage } from "@/app/types/types.config";

const systemPrompt = `
You are an intelligent "Rate My Professor" agent designed to assist students in finding professors that match their specific needs and preferences. Your primary function is to analyze a vast database of professor reviews and provide tailored recommendations based on student queries.

Your capabilities include:

1. Understanding and interpreting student queries about professors, courses, teaching styles, and academic disciplines.
2. Analyzing professor reviews across multiple criteria such as teaching effectiveness, difficulty level, grading fairness, and overall quality.
3. Providing detailed, nuanced responses that match student preferences with professor characteristics.
4. Offering insights into professors' teaching styles, course expectations, and classroom environments.
5. Suggesting alternative professors or courses when exact matches are not available.
6. Maintaining objectivity and presenting both positive and negative aspects of professors' reviews.
7. Respecting student privacy and adhering to ethical guidelines in information sharing.

Your responsibilities include:
1. Be concise yet informative, focusing on the most relevant details for each professor.
2. Include the professor's name, subject, star rating, and a brief summary of their strengths or notable characteristics.
3. Highlight any specific aspects mentioned in the student's query, such as teaching style, grading policies, or course content.
4. Provide a balanced view, acknowledging both positive and negative reviews when available.

When interacting with students:

1. Begin by asking clarifying questions to understand their specific needs and preferences.
2. Provide concise summaries of relevant professors, highlighting key points that match the student's query.
3. Offer additional details or comparisons when requested.
4. Encourage students to consider multiple factors when choosing a professor, not just overall ratings.
5. Remind students that reviews are subjective and individual experiences may vary.
6. If asked about specific professors, provide a balanced view of their strengths and potential areas for improvement.
7. When appropriate, suggest resources for further research or direct students to official university information.

Response format:
For each query, structure your response as follows:

1. A brief introduction summarizing the student's query.
2. Top 3 Professor Reccomendations:
    - Professor Name (Subject) - Star Rating
    - Brief summary of the professor's strengths or notable characteristics.
3. A concise conclusion offering additional assistance or resources if needed.

Guidelines for responses:
 - Always maintain a neutral and objective tone.
  - If the qury is too vague, ask clarifying questions to gather more information.
  - If no professors match the student's criteria, suggest alternative courses or resources.
  - Be prepared to answer follow-up questions and provide further details as needed.
  - Do not invent or fabricate information. If you don't have sufficient data, be honest and offer alternative solutions.
  - Respect privacy by not sharing personal infomration about professors or students.

Your responses should be helpful, informative, and tailored to each student's unique situation. Aim to empower students to make informed decisions about their academic choices while maintaining a respectful and professional tone.
`;

type ChatReq = {
  content: string
}

export async function POST(request: NextRequest) {
  const data: ChatMessage[] = await request.json();
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });
  const index = pc.index("rag").namespace("ns1");
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  });

  const text = data[data.length - 1].content;
  const text_input = text.replace("\n", " ")
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  const results = await index.query({
    topK: 3,
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
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  // Pushes recommendations into array containing messages
  // between user and assistant to provide recommended
  // professors when returning the response from the AI
  // to the user.
  data.push({role: 'user', content: lastMessageContent})

  const completion = await openai.chat.completions.create({
    messages: data as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    model: "gpt-4o-mini",
  });

  const response = completion.choices[0].message.content

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

  return NextResponse.json({role: 'assistant', content: response});
}

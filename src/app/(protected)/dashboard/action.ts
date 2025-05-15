"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { generateCodeEmbedding } from "~/lib/gemini";
import { db } from "~/server/db";

const gemini = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
/**
 NOTES:
 - The <=> operator in PostgreSQL's vector extension returns the cosine distance between vectors
 - Cosine distance is converted to similarity by subtracting from 1
 - We want to filter for similarity > 0.5 and sort in descending order
 - We use `1 - ("summaryEmbedding" <=> ${vectorQuery}::vector)` to convert from cosine distance to cosine similarity

 */

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateCodeEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
    SELECT "fileName", "summary","sourceCode",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE "projectId" = ${projectId} AND 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    ORDER BY similarity DESC
    LIMIT 10;
    `) as {
    fileName: string;
    summary: string;
    sourceCode: string;
    similarity: number;
  }[];

  let context = "";

  for (const doc of result) {
    context += `source ${doc.fileName} \n code content ${doc.sourceCode} \n summary ${doc.summary} \n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: gemini("gemini-2.0-flash"),
      prompt: `
            You are an ai code assistant who answers questions about the codebase. Your target audience is a technical intern and junior software engineer.
            AI code assistant is a brand new, powerful, human like artificial intelligence. The traits of AI code assistant are:
            1. AI code assistant is helpful. It always helps users to the best of its ability.
            2. AI code assistant is honest. It always tells the user the truth and never makes up information.
            3. AI code assistant is detailed oriented. It always pays attention to details.
            4. AI code assistant is friendly. It always has a positive attitude and is nice to the user.
            AI has sum of all knowledge in their brain, and is eager to provide the best answer to the user's question. If the question is about the code or a specific file, AI will provide the detailed answer, giving step by step instructions.

            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            START QUESTION BLOCK
            ${question}
            END OF QUESTION BLOCK

            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation. 
            If the context does not provide the answer to the question, the AI assistant will answer "I am sorry,I don't know the answer to that question".
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            Answer in markdown syntax, with code snippet of needed. Be detailed as possible when answering.
        `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream.value,
    fileReferences: result,
  };
}

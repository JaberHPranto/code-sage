import { db } from "~/server/db";
import { generateCodeEmbedding } from "./gemini";

// // Initialize Groq model
// const groq = new ChatGroq({
//   apiKey: process.env.GROQ_API_KEY!,
//   model: "llama3-70b-8192",
//   temperature: 0.2,
// });

// Create a vector retriever function
export async function retrieveFromPgVector(query: string, projectId: string) {
  const queryVector = await generateCodeEmbedding(query);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
    SELECT "fileName", "summary", "sourceCode",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE "projectId" = ${projectId} AND 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    ORDER BY similarity DESC
    LIMIT 5;
  `) as {
    fileName: string;
    summary: string;
    sourceCode: string;
    similarity: number;
  }[];

  return result.map((doc) => ({
    pageContent: doc.sourceCode,
    metadata: {
      fileName: doc.fileName,
      summary: doc.summary,
      similarity: doc.similarity,
    },
  }));
}

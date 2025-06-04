"use server";

import { groq } from "@ai-sdk/groq";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { retrieveFromPgVector } from "~/lib/rag";

export async function retrieveAnswer(
  question: string,
  projectId: string,
  previousQueries: string[] = [],
) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const stream = createStreamableValue();

  const result = await retrieveFromPgVector(question, projectId);

  let context = "";

  for (const doc of result) {
    context += `source ${doc.metadata.fileName} \n code content ${doc.pageContent} \n summary ${doc.metadata.summary} \n\n`;
  }

  const systemPrompt = `
  You are an expert software engineering assistant specializing in explaining and answering questions about codebases. Your goal is to provide accurate, helpful, and insightful responses based solely on the provided context and conversation history.

  ## Guidelines

  - Always base your answers on the provided context and conversation history
  - Organize your responses in a clear, logical structure
  - When appropriate, suggest best practices or potential improvements
  - Provide comprehensive explanations that balance technical accuracy with clarity

  ## Response Format
    - Address the specific question first
    - Briefly explain what code/files inform this answer  
    - Deep dive using the provided context
    - Mention relevant but not directly applicable code
    - Clearly state what's missing if context is incomplete

  ## Source Attribution
    - Reference specific files, line numbers, or functions when quoting or explaining code
    - When discussing patterns, cite multiple examples from the context
    - Distinguish between direct evidence and reasonable inferences
    - Format: "Based on 'src/utils/auth.js:45-67'..." or "The pattern seen in 'UserService' and 'AuthService'..."

  ## Context Information
  ${context}

   ## User's Question History
  ${
    previousQueries.length > 0
      ? previousQueries
          .map((q, i) => `${i + 1}. ${q}`)
          .slice(-3)
          .join("\n")
      : "This is the first question in the conversation."
  }

  ## Response Approach

  1. Begin with a direct answer to the question when possible
  2. Provide answer with technical accuracy
  3. No need for direct code snippets. Comprehensive explanations are preferred.
  4. Reference specific files, functions, and classes mentioned in the context
  5. When discussing code patterns or architecture, explain the rationale
  6. If you identify potential issues, explain them constructively
  7. When the context is insufficient, clearly state what information is missing

  If the provided context doesn't contain information relevant to the question, clearly state that you don't have enough information rather than speculating or making assumptions. Suggest
    - What additional context might help answer the question more effectively
    - Related files or components that should be included
    - Alternative ways to phrase the question for better retrieval
`;

  (async () => {
    const { textStream } = await streamText({
      //   model: groq("deepseek-r1-distill-llama-70b"),
      model: groq("llama3-70b-8192"),
      system: systemPrompt,
      prompt: question,
      maxTokens: 2000,
      temperature: 0.2,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream.value,
    fileReferences: result?.map((doc) => ({
      fileName: doc.metadata.fileName,
      summary: doc.metadata.summary,
      sourceCode: doc.pageContent,
    })),
  };
}

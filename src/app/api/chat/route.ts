import { groq } from "@ai-sdk/groq";
import { createDataStreamResponse, streamText, smoothStream } from "ai";
import { createStreamableValue } from "ai/rsc";
import type { NextRequest } from "next/server";
import { retrieveFromPgVector } from "~/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const { messages, projectId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const stream = createStreamableValue();

    // Get relevant documents from vector database
    const documents = await retrieveFromPgVector(lastMessage, projectId);

    let context = "";
    for (const doc of documents) {
      context += `source ${doc.metadata.fileName} \n code content ${doc.pageContent} \n summary ${doc.metadata.summary} \n\n`;
    }

    const systemPrompt = `
            You are an expert software engineering assistant specializing in explaining and answering questions about codebases. Your goal is to provide accurate, helpful, and insightful responses based solely on the provided context.

            ## Guidelines

            - Always base your answers on the provided context only
            - Organize your responses in a clear, logical structure
            - When appropriate, suggest best practices or potential improvements
            - Format code examples and explanations using proper markdown
            - Provide comprehensive explanations that balance technical accuracy with clarity

            ## Response Format

            Use the following markdown elements appropriately:
            - **Code blocks** with proper syntax highlighting
            - **Headers** to organize different sections
            - **Bold** for important concepts or terms
            - **Lists** when presenting multiple points or steps
            - **Tables** when comparing alternatives or options
            - **Mermaid diagrams** when illustrating complex concepts

            ## Context Information
            ${context}

            ## Response Approach

            1. Begin with a direct answer to the question when possible
            2. Provide relevant code snippets from the context when helpful
            3. Explain the code's purpose, structure, and functionality
            4. Reference specific files, functions, and classes mentioned in the context
            5. When discussing code patterns or architecture, explain the rationale
            6. If you identify potential issues, explain them constructively
            7. When the context is insufficient, clearly state what information is missing

            If the provided context doesn't contain information relevant to the question, clearly state that you don't have enough information rather than speculating or making assumptions. Suggest what additional context might help answer the question more effectively.
        `;

    const response = await streamText({
      //   model: groq("deepseek-r1-distill-llama-70b"),
      model: groq("llama3-70b-8192"),
      system: systemPrompt,
      prompt: lastMessage,
    });

    // return the stream
    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

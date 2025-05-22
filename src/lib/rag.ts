import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { db } from "~/server/db";
import { generateCodeEmbedding } from "./gemini";

export const runtime = "edge";

// Initialize Groq model
const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama3-70b-8192",
  temperature: 0.2,
});

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

// RAG prompt template
const ragPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful code assistant that answers questions about codebases.
  Use the following context to answer the user's question.
  If you don't know the answer, say so - don't make up information.
  Format your response using markdown with proper code blocks.
  
  Context: {context}`,
  ],
  ["human", "{question}"],
]);

// Create a basic RAG chain
export async function createRagChain(projectId: string) {
  const retriever = async (query: string) =>
    retrieveFromPgVector(query, projectId);

  return RunnableSequence.from([
    {
      context: async (input: { question: string }) => {
        const docs = await retriever(input.question);
        return formatDocumentsAsString(docs);
      },
      question: (input: { question: string }) => input.question,
    },
    ragPrompt,
    groq,
    new StringOutputParser(),
  ]);
}

// Create a stateful RAG system with chat history
// export async function createChatRagSystem(projectId: string) {
//   // Define the graph with message-based state
//   const graph = new StateGraph(MessagesAnnotation);

//   // Create memory saver for persistence
//   const checkpointer = new MemorySaver();

//   // Define the retrieve node
//   const retrieve = async (state: any) => {
//     // Get the last user message
//     const lastMessage = state.messages[state.messages.length - 1];
//     const query = lastMessage.content;

//     // Retrieve relevant documents
//     const docs = await retrieveFromPgVector(query, projectId);

//     // Return tool message with retrieved context
//     return {
//       messages: [
//         {
//           role: "tool",
//           content: formatDocumentsAsString(docs),
//           name: "retriever"
//         }
//       ]
//     };
//   };

//   // Define the generate node
//   const generate = async (state: any) => {
//     // Extract the conversation history and retrieved context
//     const messages = state.messages;

//     // Format the prompt with history and context
//     const response = await groq.invoke(messages);

//     // Return AI message with response
//     return {
//       messages: [
//         {
//           role: "assistant",
//           content: response.content
//         }
//       ]
//     };
//   };

//   // Add nodes and edges to the graph
//   graph.addNode("retrieve", retrieve);
//   graph.addNode("generate", generate);

//   graph.addEdge("__start__", "retrieve");
//   graph.addEdge("retrieve", "generate");
//   graph.addEdge("generate", "__end__");

//   // Compile the graph with memory
//   const graphWithMemory = graph.compile({ checkpointer });

//   return graphWithMemory;
// }

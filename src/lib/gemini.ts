import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";
import {
  COMMIT_SUMMARY_PROMPT,
  SOURCE_CODE_PROMPT,
} from "~/utils/prompt-templates";

// const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const gemini = new GoogleGenerativeAI(
  "AIzaSyD0_BtTE_BS2d7amuvOwqcDn00cv9Bi5vQ",
);
const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function aiSummarizeCommit(commitDiff: string) {
  try {
    const prompt = COMMIT_SUMMARY_PROMPT(commitDiff);
    const response = await model.generateContent([prompt]);

    if (!response?.response?.text) {
      throw new Error("Failed to generate commit summary");
    }

    return response.response.text();
  } catch (error) {
    console.error("Error in aiSummarizeCommit:", error);
    return "";
    // throw new Error(
    //   `Failed to summarize commit: ${error instanceof Error ? error.message : "Unknown error"}`,
    // );
  }
}

// Store your API keys
const GEMINI_API_KEYS = [
  "AIzaSyDGI6StmfkNreJeDscjb8PqClBUry7dl80",
  "AIzaSyCtr223eWfEiUp8QHVK3E4NX8Yu2QLAGMA",
  "AIzaSyAirS0rjFNkjbpBW33CpmCNd-FGl7oCyNU",
  "AIzaSyC58E37yNz523aLzWJEaNLBTF4dvbCs61A",
  "AIzaSyD0_BtTE_BS2d7amuvOwqcDn00cv9Bi5vQ",
  "AIzaSyChl3b92b6lVYTfPeXq7AeNnvrrsFcX9kw",
];

// ORIGINAL

export async function aiSummarizeSourceCode(doc: Document) {
  try {
    if (!doc?.metadata?.source) {
      throw new Error("Invalid document: missing metadata.source");
    }

    if (!doc?.pageContent) {
      throw new Error("Invalid document: missing pageContent");
    }

    console.log("getting summary for ... ", doc.metadata.source);
    const code = doc.pageContent.slice(0, 10000); // limit to 1000 characters

    const prompt = SOURCE_CODE_PROMPT(doc, code);
    const response = await model.generateContent([prompt]);
    console.log("🚀 ~ response:", response);

    if (!response?.response?.text) {
      throw new Error("Failed to generate source code summary");
    }

    return response.response.text();
  } catch (error) {
    console.error("Error in aiSummarizeSourceCode:", error);
    throw new Error(
      `Failed to summarize source code for ${doc.metadata.source}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export const generateCodeEmbedding = async (summary: string) => {
  try {
    const embeddingModel = gemini.getGenerativeModel({
      model: "text-embedding-004",
    });
    const response = await embeddingModel.embedContent(summary);

    if (!response?.embedding?.values) {
      throw new Error("Failed to generate embedding: No values returned");
    }

    return response.embedding.values;
  } catch (error) {
    console.error("Error in generateCodeEmbedding:", error);
    throw new Error(
      `Failed to generate code embedding: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// TEST MODE IS ON
let currentKeyIndex = 0;

async function getNextApiKey(): Promise<string> {
  const apiKey = GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
  return apiKey ?? "";
}

// export async function aiSummarizeSourceCode(doc: Document) {
//   try {
//     if (!doc?.metadata?.source) {
//       throw new Error("Invalid document: missing metadata.source");
//     }

//     if (!doc?.pageContent) {
//       throw new Error("Invalid document: missing pageContent");
//     }

//     console.log("getting summary for ... ", doc.metadata.source);
//     const code = doc.pageContent.slice(0, 10000);

//     const prompt = SOURCE_CODE_PROMPT(doc, code);
//     let apiKey = await getNextApiKey();
//     let retryCount = 0;
//     const MAX_RETRIES = GEMINI_API_KEYS.length * 2; // Example: Retry each key twice

//     while (retryCount < MAX_RETRIES) {
//       try {
//         // Assuming your 'model' object needs the API key to be passed in
//         const response = await model.generateContent([prompt], { apiKey });

//         if (!response?.response?.text) {
//           throw new Error("Failed to generate source code summary");
//         }

//         return response.response.text();
//       } catch (error: any) {
//         if (error?.response?.status === 429) {
//           console.warn(
//             `Rate limit encountered with key ${apiKey}. Rotating key...`,
//           );
//           apiKey = await getNextApiKey();
//           retryCount++;
//           // Optionally add a small delay here before retrying with the new key
//           await new Promise((resolve) => setTimeout(resolve, 500));
//         } else {
//           // If it's not a rate limit error, re-throw the error
//           console.error("Error during API call:", error);
//           throw new Error(
//             `Failed to summarize source code for ${doc.metadata.source}: ${
//               error instanceof Error ? error.message : "Unknown error"
//             }`,
//           );
//         }
//       }
//     }

//     // If we've exhausted all retries
//     throw new Error(
//       `Failed to summarize source code for ${doc.metadata.source} after multiple retries due to rate limits.`,
//     );
//   } catch (error) {
//     console.error("Error in aiSummarizeSourceCode:", error);
//     throw new Error(
//       `Failed to summarize source code for ${doc.metadata.source}: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     );
//   }
// }

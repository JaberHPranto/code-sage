import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";
import {
  COMMIT_SUMMARY_PROMPT,
  SOURCE_CODE_PROMPT,
} from "~/utils/prompt-templates";

// const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
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

export async function aiSummarizeSourceCode(doc: Document) {
  try {
    if (!doc?.metadata?.source) {
      throw new Error("Invalid document: missing metadata.source");
    }

    if (!doc?.pageContent) {
      return "";
    }

    console.log("getting summary for ... ", doc.metadata.source);
    const code = doc.pageContent.slice(0, 1000); // limit to 1000 characters

    const prompt = SOURCE_CODE_PROMPT(doc, code);
    const response = await model.generateContent([prompt]);

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

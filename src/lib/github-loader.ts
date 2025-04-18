import { aiSummarizeSourceCode, generateCodeEmbedding } from "~/lib/gemini";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { db } from "~/server/db";
import { delay } from "~/utils/prompt-templates";

/*
 <-- Workflow -->
  
  load repo from github -> get summary of each document provide by Github Loader -> embedding the summary -> save to db
  docs [] => summary [] => embedding [] => save to db  
          -> getSummary(document.pageContent) -> getEmbedding(summary) -> store to pg vector
*/

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch: "main",
    ignoreFiles: [
      ".gitignore",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
      "*.md",
      "*.svg",
    ],
    recursive: true,
    maxConcurrency: 10,
    unknown: "warn",
  });

  const docs = await loader.load();

  return docs;
};

export const indexGithubRepo = async (
  // projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbedding(docs);

  // save to db
  // await Promise.allSettled(
  //   allEmbeddings.map(async (embedding, index) => {
  //     console.log(`processing ${index} of ${allEmbeddings.length}`);

  //     if (!embedding) return;

  //     const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
  //       data: {
  //         projectId,
  //         sourceCode: embedding.source,
  //         fileName: embedding.fileName,
  //         summary: embedding.summary,
  //       },
  //     });

  //     await db.$executeRaw`
  //     UPDATE "SourceCodeEmbedding"
  //     SET "summaryEmbedding" = ${embedding.embedding}::vector
  //     WHERE "id" = ${sourceCodeEmbedding.id}
  //     `;
  //   }),
  // );
};

const generateEmbedding = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc, index) => {
      console.log(`processing ${index + 1} ... `, doc.metadata.source);
      const docSummary = await aiSummarizeSourceCode(doc);
      console.log("🚀 ~ docSummary:", docSummary);
      // const docEmbedding = await generateCodeEmbedding(docSummary);

      // return {
      //   summary: docSummary,
      //   embedding: docEmbedding,
      //   source: JSON.parse(JSON.stringify(doc.pageContent)),
      //   fileName: doc.metadata.source,
      // };
    }),
  );
};

console.log(
  "GITHUB",
  await indexGithubRepo("https://github.com/JaberHPranto/nextjs-boilerplate"),
);

/*
 <-- Workflow -->
  
  load repo from github -> get summary of each document provide by Github Loader -> embedding the summary -> save to db
  docs [] => summary [] => embedding [] => save to db  
          -> getSummary(document.pageContent) -> getEmbedding(summary) -> store to pg vector
*/

import { Octokit } from "@octokit/rest";

interface FileDocument {
  pageContent: string;
  metadata: {
    source: string;
    name: string;
  };
}

interface FolderStructure {
  [key: string]: FolderStructure | string;
}

export function buildFolderStructure(docs: FileDocument[]): FolderStructure {
  const structure: FolderStructure = {};

  for (const doc of docs) {
    const pathParts = doc.metadata.source.split("/");
    let currentLevel = structure;

    // Navigate through the path parts to build nested structure
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i] as string;

      // If we're at the file name (last part)
      if (i === pathParts.length - 1) {
        currentLevel[part] = "file";
      } else {
        // Create folder if it doesn't exist
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        // Move to next level
        currentLevel = currentLevel[part] as FolderStructure;
      }
    }
  }

  return structure;
}

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
): Promise<FileDocument[]> => {
  const token = githubToken || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GitHub token is required. Provide it as a parameter or set GITHUB_TOKEN environment variable.",
    );
  }

  const octokit = new Octokit({ auth: token });

  // Parse GitHub URL to get owner and repo
  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");

  const [, owner, repo] = match!;
  const branch = "main";
  const ignoredPatterns = [
    // Files
    ".gitignore",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lockb",
    "*.svg",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.ico",
    "*.lock",
    "*.DS_Store",
    "tsconfig.*",
    "eslint.*",

    // Folders
    "node_modules",
    ".next",
    "public",
    "dist",
    "build",
    "coverage",
  ];

  const docs: FileDocument[] = [];
  const fetchedPaths = new Set<string>();
  const concurrencyLimit = 10;
  let activeTasks = 0;
  const taskQueue: (() => Promise<void>)[] = [];

  async function throttle<T>(fn: () => Promise<T>): Promise<T> {
    if (activeTasks >= concurrencyLimit) {
      // Wait for a task to be available
      await new Promise<void>((resolve) => {
        taskQueue.push(async () => resolve());
      });
    }

    activeTasks++;
    try {
      return await fn();
    } finally {
      activeTasks--;
      if (taskQueue.length > 0) {
        const nextTask = taskQueue.shift();
        if (nextTask) nextTask();
      }
    }
  }

  async function processDirectory(path = ""): Promise<void> {
    let page = 1;
    let hasMoreContent = true;

    while (hasMoreContent) {
      const { data } = await throttle(() =>
        octokit.repos.getContent({
          owner: owner!,
          repo: repo!,
          path,
          ref: branch,
          per_page: 100,
          page,
        }),
      );

      // Handle case when data is not an array (e.g., when path is a file)
      if (!Array.isArray(data)) {
        hasMoreContent = false;
        continue;
      }

      if (data.length === 0) {
        hasMoreContent = false;
        continue;
      }

      const processingPromises: Promise<void>[] = [];

      for (const item of data) {
        // Skip ignored files
        if (shouldIgnore(item.name, ignoredPatterns)) continue;

        if (item.type === "dir") {
          processingPromises.push(processDirectory(item.path));
        } else if (item.type === "file") {
          if (!fetchedPaths.has(item.path)) {
            processingPromises.push(
              (async () => {
                try {
                  const fileContent = await getFileContent(
                    octokit,
                    owner!,
                    repo!,
                    item.path,
                    branch,
                  );
                  docs.push({
                    pageContent: fileContent,
                    metadata: {
                      source: item.path,
                      name: item.name,
                    },
                  });
                  fetchedPaths.add(item.path);
                } catch (error) {
                  console.warn(`Error fetching file ${item.path}:`, error);
                }
              })(),
            );
          }
        }
      }

      await Promise.all(processingPromises);

      page++;

      // If we got fewer items than the per_page limit, there are no more pages
      hasMoreContent = data.length === 100;
    }
  }

  if (owner && repo) {
    await processDirectory();
  }
  return docs;
};

function shouldIgnore(filename: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.includes("*")) {
      const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(filename);
    }
    return filename === pattern;
  });
}

async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  branch: string,
): Promise<string> {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });

  if ("content" in data && "encoding" in data) {
    if (data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return data.content as string;
  }

  throw new Error(`Unable to get content for file: ${path}`);
}

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);

  // Build and log folder structure
  const folderStructure = buildFolderStructure(docs);
  console.log(
    "Repository structure:",
    JSON.stringify(folderStructure, null, 2),
  );
};

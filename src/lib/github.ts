import axios from "axios";
import { Octokit } from "octokit";
import { toast } from "sonner";
import { db } from "~/server/db";
import { aiSummarizeCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface Response {
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
  commitMessage: string;
  commitHash: string;
}

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summarizeCommit(githubUrl, commit.commitHash);
    }),
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value;
    }
    return "";
  });

  // save to db
  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      console.log("Processing commit: ", index + 1);
      return {
        projectId,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]?.commitAuthorAvatar ?? "",
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      };
    }),
  });

  return commits;
};

export async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      repoUrl: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return { project, githubUrl: project?.repoUrl };
}

export async function getCommitHashes(githubUrl: string): Promise<Response[]> {
  // example Github URL => https://github.com/docker/genai-stack
  const [owner, repo] = githubUrl.split("/").slice(-2);

  if (!owner || !repo) {
    throw new Error("Invalid Github URL");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data?.sort((a: any, b: any) => {
    return (
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
    );
  });

  return sortedCommits.slice(0, 10).map((commit: any) => {
    return {
      commitAuthorName: commit.commit.author?.name,
      commitAuthorAvatar: commit.author?.avatar_url,
      commitDate: commit.commit.author.date,
      commitMessage: commit.commit.message,
      commitHash: commit.sha,
    };
  });
}

export async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: {
      projectId,
    },
  });

  // commits there are not in db
  const unprocessedCommits = commitHashes.filter((commit) => {
    return !processedCommits.find((c) => c.commitHash === commit.commitHash);
  });

  return unprocessedCommits;
}

export async function summarizeCommit(githubUrl: string, commitHash: string) {
  // https://github.com/docker/genai-stack/commit/<commit_hash>.diff    => will return what changes in the commit

  try {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
      headers: {
        Accept: "application/vnd.github.v3.diff",
      },
    });

    return aiSummarizeCommit(data) ?? "";
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch commit diff");
  }
}

// await pollCommits("b826a15a-2ec9-480a-9b56-870f8414a860");

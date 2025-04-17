import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function aiSummarizeCommit(commitDiff: string) {
  const response = await model.generateContent([
    `You are an expert programmer and you are trying to summarize a git diff
    Reminders about the git diff format:
    For every file, there are a few metadata lines. Like (for example)
    \`\`\`
    diff --git a/lib/index.js b/lib/index.js
    index 0123456..abcdef0 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`

    This means that the file lib/index.js was changed. Note that this is only an example.
    In the diff content:
    - Lines starting with "-" were removed
    - Lines starting with "+" were added
    - Lines without "-" or "+" are context lines (not part of the change)

    INSTRUCTIONS:
    1. Create a bullet-point summary (max 5-7 points) of the most significant changes
    2. Focus on functional changes over formatting changes
    3. For each change, include:
        - A clear description of what changed (function added, bug fixed, etc.)
        - Include relevant file path(s) in [square brackets] only when helpful for context
        - If more than 5 files were modified for a single type of change, mention it without listing all files

    EXAMPLE SUMMARY COMMITS:
    \`\`\`
    - Raised the amount if returned recordings from \`10\` to \`100\` [packages/server/api/routers/recordings.ts], [packages/server/constants.ts]
    - Fixed a typo in the github action name [.github/workflows/ci.yml]
    - Moved the \`getRecordings\` function to the \`server\` package [packages/server/api/routers/recordings.ts], [packages/server/api/trpc.ts]
    - Added an OpenAI API key to the environment variables and updated the api to use it. [packages/server/.env.example], [packages/utils/api/openai.ts]
    - Update the styling of dashboard page [app/(protected)/dashboard/page.tsx]
    - Lowered numeric tolerance for test files
    \`\`\`

    Most comments will have less comments than this example list.
    The last comment does not include the file name. Because there were more than two files in the hypothetical commit.
    Do not include parts of example in your summary. It is only given only as  an example of appropriate comments.
    
    'Please summarize the following git diff: \n\n${commitDiff}'
      `,
  ]);

  return response.response.text();
}

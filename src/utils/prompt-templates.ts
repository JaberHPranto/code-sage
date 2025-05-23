import type { Document } from "@langchain/core/documents";
import { fileStructure, summarizations } from "~/lib/doc-data";

export const COMMIT_SUMMARY_PROMPT = (
  commitDiff: string,
) => `You are an expert programmer and you are trying to summarize a git diff
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
        `;

export const SOURCE_CODE_PROMPT = (
  doc: Document,
  code: string,
) => `You are an expert programmer and senior software engineer who specializes in onboarding junior software engineers onto projects. You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.

      Here is the code:
      ---
      ${code}
      ---

      Give a summary of no more than 100 words that explains:
      - The main purpose of this file
      - Key functionality it implements
      - How it fits into the broader system
      - Any critical dependencies or patterns to understand
      `;

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const DOCUMENTATION_GENERATION_PROMPT = () => `
    You are an expert software architect and technical writer.
    Create a comprehensive tutorial-based project documentation for new developers joining this project based on the following GitHub repository analysis:

    CONTEXT: 
    Folder Structure: ${JSON.stringify(fileStructure)}
    File Summaries: ${JSON.stringify(summarizations)}

    INSTRUCTIONS:
    Generate a "Developer's Guide to Understanding and Contributing to ${`Aurora`} with the following sections:

    1. PROJECT OVERVIEW (2-3 paragraphs):
      - Purpose, vision, and core functionality
      - Key problems it solves
      - Primary user base and use cases
      - Tech stack overview

    2. SYSTEM ARCHITECTURE:
      - Create a Mermaid diagram showing the core architecture with:
        * Main components/services
        * Data flow between components
        * External dependencies
        * Key interfaces
        * Database design
        
        Mermaid Diagram Rules
            - Use proper indentation
            - Avoid special characters in node names
            - Use consistent arrow types (--> for direct, -.-> for indirect)
            - Group related components using subgraphs
            - Validate syntax using official Mermaid docs
        
      - Explain the diagram in a step-by-step manner to build understanding
      - Include a second Mermaid diagram showing key data flows through the system

    3. DEVELOPMENT ENVIRONMENT SETUP:
      - Prerequisites and tools installation
      - Step-by-step configuration instructions
      - Environment variables and configuration files explanation
      - Verification steps to ensure everything is working correctly
      - Common setup issues and their solutions

    4. CODEBASE WALKTHROUGH:
      - Entry points to the application
      - Core modules and their responsibilities
      - Important design patterns and architectural decisions
      - Directory structure rationale
      - ✅ PRACTICAL EXERCISE: "Trace a request through the system"

    5. KEY CONCEPTS TUTORIAL:
      - Identify 4-5 fundamental concepts/patterns in the codebase
      - Explain each concept with real code examples
      - Show how these patterns solve specific problems
      - 🔑 KEY INSIGHT: For each concept, highlight why this approach was chosen
      - ⚠️ COMMON PITFALL: Warn about misunderstandings or mistakes

    6. WORKFLOW GUIDES:
      - How to implement a new feature (with example flow)
      - How to fix a bug (with debugging approach)
      - How to add tests for new functionality
      - Code review process and standards
      - ✅ PRACTICAL EXERCISE: "Implement a simple feature"

    7. COMPONENT DEEP DIVES:
      - For each major component:
        * Purpose and responsibilities
        * Key files and their functions
        * Internal data flow
        * Integration points with other components
        * Configuration options
        * Testing strategy
      - Include relevant Mermaid diagrams for complex components

    8. FIRST CONTRIBUTION GUIDE:
      - Contribution workflow from fork to PR
      - Coding standards and conventions
      - Testing requirements
      - 3 suggested "good first issues" with:
        * Problem description
        * Files that need modification
        * Pseudocode or implementation hints
      - ✅ PRACTICAL EXERCISE: "Fix a simple bug"

    9. ADVANCED TOPICS:
      - Performance considerations and optimization strategies
      - Security patterns and best practices
      - Deployment workflow and environments
      - Monitoring and logging
      - Scaling considerations

    10. TROUBLESHOOTING AND FAQ:
      - Common errors and their solutions
      - Debugging tools and techniques
      - Where to find logs and how to interpret them
      - Who to ask for help with specific components

    FORMAT:
    - Use clear markdown with proper headings,subheadings and structure
    - For every sub-section, includes things like overview, key points, purpose and other relevant information along with comprehensive description of that section. Use multilevel hierarchy for better readability.
    - Use multiple heading levels 1-3 for main sections and subsections for better readability
    - Include multiple Mermaid diagrams for architecture, workflows, and component interactions
    - Use proper markdown syntax for code blocks, lists, bold, italics, etc. Use Tables when appropriate for better data representation
    - Incorporate code snippets from the actual codebase to illustrate concepts
    - Add learning checkpoints as "Understanding Check" sections
    - Include "🔑 Key Insight" callouts to highlight important patterns or conventions
    - Add "⚠️ Common Pitfall" warnings where developers often make mistakes
    - Format as a progressive learning journey that builds understanding incrementally
    - Include hands-on exercises that let developers interact with the codebase
    - Use emoji flags: 🚧 Warning, ✅ Verified, 🔍 Check


    NB: Do not include any text outside of valid Markdown, and do not reference your internal thought process.
    `;

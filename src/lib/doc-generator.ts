import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileStructure, summarizations } from "./doc-data";
import { Type as SchemaType } from "@google/genai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const responseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      id: { type: SchemaType.STRING },
      title: { type: SchemaType.STRING },
      description: { type: SchemaType.STRING },
      subchapters: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            title: { type: SchemaType.STRING },
            content: { type: SchemaType.STRING },
          },
          required: ["id", "title", "content"],
        },
      },
    },
    required: ["id", "title", "description", "subchapters"],
  },
};

export const DOCUMENTATION_STRUCTURE_PROMPT = (content: string) => `
You are an expert technical documentation specialist. Your task is to analyze the provided documentation content and break it down into a structured format of chapters and subchapters.

Here is the documentation content:
---
${content}
---

INSTRUCTIONS:
1. Analyze the content and identify the main chapters and their subchapters
2. Create a JSON array where each item represents a chapter with appropriate subchapters
  HERE IS THE REQUIRED JSON FORMAT:
    \`\`\`json
    [
      {
        "id": "unique-id-for-chapter", // kebab-case format based on the title
        "title": "Chapter Title",
        "description": "Brief description of the chapter content",
        "subchapters": [
          {
            "id": "unique-id-for-subchapter", // kebab-case format
            "title": "Subchapter Title",
            "content": "Full content of just this subchapter in markdown"
          }
        ]
      },
      // ... more chapters
    ]
    \`\`\`

  EXAMPLE:
  \`\`\`json
  [
    {
      "id": "project-overview",
      "title": "Project Overview",
      "description": "This chapter provides an overview of the project, its purpose, and its key features.",
      "subchapters": [
        {
          "id": "project-purpose",
          "title": "Project Purpose",
          "content": "The purpose of this project is to..."
        },
        {
          "id": "key-features",
          "title": "Key Features",
          "content": "The key features of this project include..."
        }
      ]
    },
    // ... more chapters
  ]
  \`\`\`

3. Important Guidelines:
  - Remove the redundant "content" field at the chapter level - content should only appear in subchapters
  - Preserve all code examples, diagrams references, and technical explanations in the subchapter content
  - Make sure all bulleted lists, numbered lists, and formatting are maintained in the content
  - Handle tables appropriately by converting them to markdown format in the content
  - For practical exercises or key insights marked with specific formatting, preserve their emphasis
  - If content contains references to files or paths, preserve them exactly as written

5. Error handling:
   - If you encounter ambiguous heading levels, use context to determine the appropriate hierarchy
   - If content doesn't clearly fit into the defined structure, create logical groupings based on content
   - Ensure every piece of the original content is captured in the appropriate subchapter 

RESPONSE FORMAT REQUIREMENTS:
- You MUST respond ONLY with the JSON array itself
- Do NOT include any explanations, descriptions, or text before or after the JSON
- Do NOT include markdown code block formatting  around the JSON
- Your entire response must be valid JSON that can be parsed directly by JSON.parse()
- Begin your response with the opening bracket "[" and end with the closing bracket "]"
- Ensure all quotes and special characters are properly escaped according to JSON syntax
- The response must be a complete, well-formed JSON array containing objects as described above

IMPORTANT: If your response contains ANYTHING other than the JSON array itself, it will be considered invalid.
`;

export async function convertToStructuredDocumentation(content: string) {
  console.log("Converting documentation to structured format...");
  const model = gemini.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema as any,
    },
  });

  const prompt = DOCUMENTATION_STRUCTURE_PROMPT(content);
  const response = await model.generateContent([prompt]);

  if (!response?.response?.text) {
    throw new Error("Failed to convert documentation to structured format");
  }

  try {
    // Get the raw text response
    const rawText = response.response.text();

    // Clean up the response to ensure it's valid JSON
    // Remove any markdown code block markers
    let cleanedText = rawText.replace(/```json|```/g, "").trim();

    // Try to parse the JSON
    const structuredContent = JSON.parse(JSON.stringify(cleanedText));
    return structuredContent;
  } catch (error) {
    console.error("Error parsing structured documentation:", error);
    console.error("Raw response:", response.response.text());
    throw new Error(
      "Failed to parse structured documentation. The model did not return valid JSON.",
    );
  }
}

// Function to save structured documentation
export async function saveStructuredDocumentation() {
  const fs = require("fs");
  const path = require("path");

  // First, read the full documentation
  const outputFilePath = path.join(__dirname, "output.md");
  const content = fs.readFileSync(outputFilePath, "utf8");

  // Convert to structured format
  const structuredContent = await convertToStructuredDocumentation(content);

  // Save the structured content
  const structuredFilePath = path.join(__dirname, "structured-docs.json");
  fs.writeFileSync(
    structuredFilePath,
    JSON.stringify(structuredContent, null, 2),
  );

  console.log("Structured documentation saved to", structuredFilePath);
  return structuredFilePath;
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
    - Use heading levels 1-3 for main sections and subsections for better readability
    - Include multiple Mermaid diagrams for architecture, workflows, and component interactions
    - Incorporate code snippets from the actual codebase to illustrate concepts
    - Add learning checkpoints as "Understanding Check" sections
    - Include "🔑 Key Insight" callouts to highlight important patterns or conventions
    - Add "⚠️ Common Pitfall" warnings where developers often make mistakes
    - Format as a progressive learning journey that builds understanding incrementally
    - Include hands-on exercises that let developers interact with the codebase
    - Use emoji flags: 🚧 Warning, ✅ Verified, 🔍 Check


    NB: Do not include any text outside of valid Markdown, and do not reference your internal thought process.
    `;

export async function generateDocumentation() {
  console.log("Generating documentation...");
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = DOCUMENTATION_GENERATION_PROMPT();

  const response = await model.generateContent([prompt]);

  if (!response?.response?.text) {
    throw new Error("Failed to generate documentation");
  }

  return response.response.text();
}

// --- TEST: Documentation generation ---
const fs = require("fs");
const path = require("path");

// const outputFilePath = path.join(__dirname, "output.md");
// fs.writeFileSync(outputFilePath, await generateDocumentation());

// console.log("Documentation generated successfully at", outputFilePath);

// --- TEST: Documentation structure ---
// const fs = require("fs");
// const path = require("path");

const outputFilePath = path.join(__dirname, "output.md");
const content = fs.readFileSync(outputFilePath, "utf8");

// const structuredContent = await convertToStructuredDocumentation(content);
// console.log("Structured documentation:", structuredContent);

interface Chapter {
  id: string;
  level: number;
  title: string;
  content: string;
  children: Chapter[];
}

interface Chapter {
  id: string;
  level: number;
  title: string;
  content: string;
  children: Chapter[];
}

function parseMarkdownChapters(markdownContent: string): Chapter[] {
  // Split the markdown content into lines
  const lines = markdownContent.split("\n");

  // Create a root array to hold top-level chapters
  const rootChapters: Chapter[] = [];

  // Keep track of the current chapter stack at each level
  const chapterStack: Chapter[] = [];

  let currentContent: string[] = [];

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if the line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      // If we have accumulated content, add it to the most recent chapter
      if (currentContent.length > 0 && chapterStack.length > 0) {
        chapterStack[chapterStack.length - 1].content +=
          currentContent.join("\n");
        currentContent = [];
      }

      // Get the heading level (number of # symbols)
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      // Generate a unique ID from the title
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      // Create a new chapter
      const newChapter: Chapter = {
        id,
        level,
        title,
        content: "",
        children: [],
      };

      // Pop chapters from the stack until we find a parent chapter or reach the root
      while (
        chapterStack.length > 0 &&
        chapterStack[chapterStack.length - 1].level >= level
      ) {
        chapterStack.pop();
      }

      // If there's a parent chapter, add the new chapter to its children
      if (chapterStack.length > 0) {
        chapterStack[chapterStack.length - 1].children.push(newChapter);
      } else {
        // Otherwise, add it to the root chapters
        rootChapters.push(newChapter);
      }

      // Push the new chapter onto the stack
      chapterStack.push(newChapter);
    } else {
      // This is content, not a heading, so add it to the current content buffer
      currentContent.push(line);
    }
  }

  // Add any remaining content to the last chapter
  if (currentContent.length > 0 && chapterStack.length > 0) {
    chapterStack[chapterStack.length - 1].content += currentContent.join("\n");
  }

  return rootChapters;
}

export function chaptersToStructuredDocs(chapters: Chapter[]): any[] {
  return chapters.map((chapter) => {
    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.content,
      subchapters:
        chapter.children.length > 0
          ? chaptersToStructuredDocs(chapter.children)
          : [],
    };
  });
}

// Updated function to parse markdown and convert to structured documentation
export async function parseMarkdownToStructuredDocs(
  markdownContent: string,
): Promise<any[]> {
  const chapters = parseMarkdownChapters(markdownContent);
  // return chapters;
  return chaptersToStructuredDocs(chapters);
}

console.log("SS", await parseMarkdownToStructuredDocs(content));

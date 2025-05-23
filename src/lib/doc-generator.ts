import { GoogleGenerativeAI } from "@google/generative-ai";
import { DOCUMENTATION_GENERATION_PROMPT } from "~/utils/prompt-templates";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

function parseMarkdownChapters(markdownContent: string): Chapter[] {
  // Split the markdown content into lines
  const lines = markdownContent.split("\n");

  const rootChapters: Chapter[] = [];
  const chapterStack: Chapter[] = [];
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      if (currentContent.length > 0 && chapterStack.length > 0) {
        chapterStack[chapterStack.length - 1]!.content +=
          currentContent.join("\n");
        currentContent = [];
      }

      const level = headingMatch[1]!.length;
      const title = headingMatch[2]!.trim();

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
        chapterStack[chapterStack.length - 1]!.level >= level
      ) {
        chapterStack.pop();
      }

      // If there's a parent chapter, add the new chapter to its children
      if (chapterStack.length > 0) {
        chapterStack[chapterStack.length - 1]!.children.push(newChapter);
      } else {
        rootChapters.push(newChapter);
      }

      chapterStack.push(newChapter);
    } else {
      currentContent.push(line);
    }
  }

  // Add any remaining content to the last chapter
  if (currentContent.length > 0 && chapterStack.length > 0) {
    chapterStack[chapterStack.length - 1]!.content += currentContent.join("\n");
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

// console.log("SS", await parseMarkdownToStructuredDocs(content));

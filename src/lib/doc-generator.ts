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

const fs = require("fs");
const path = require("path");

const outputFilePath = path.join(__dirname, "output.md");
const content = fs.readFileSync(outputFilePath, "utf8");

interface ISubChapter {
  title: string;
  id: string; // ID for HTML element targeting (required)
}

interface IChapter {
  title: string;
  content: string;
  items: ISubChapter[];
}

const generateId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const extractChapterContent = (
  fullContent: string,
  chapterTitle: string,
  nextChapterTitle?: string,
): string => {
  const chapterIndex = fullContent.indexOf(`## ${chapterTitle}`);
  if (chapterIndex === -1) return "";

  const startIndex = chapterIndex;

  let endIndex: number;
  if (nextChapterTitle) {
    const nextIndex = fullContent.indexOf(`## ${nextChapterTitle}`);
    endIndex = nextIndex !== -1 ? nextIndex : fullContent.length;
  } else {
    endIndex = fullContent.length;
  }

  return fullContent.substring(startIndex, endIndex).trim();
};

const parseMarkdown = (markdownContent: string): IChapter[] => {
  const structure: IChapter[] = [];

  // Extract all level 2 headings (chapters)
  const chapterMatches = markdownContent.match(/^## (.+)$/gm);
  if (!chapterMatches) return structure;

  const chapterTitles = chapterMatches.map((match) =>
    match.replace(/^## /, ""),
  );

  chapterTitles.forEach((chapterTitle, index) => {
    const nextChapterTitle = chapterTitles[index + 1];

    // Extract full chapter content
    const chapterContent = extractChapterContent(
      markdownContent,
      chapterTitle,
      nextChapterTitle,
    );

    // Extract all level 3 headings (subchapters) within this chapter
    const subChapterMatches = chapterContent.match(/^### (.+)$/gm);
    const subChapters: ISubChapter[] = [];

    if (subChapterMatches) {
      const subChapterTitles = subChapterMatches.map((match) =>
        match.replace(/^### /, ""),
      );

      subChapterTitles.forEach((subTitle) => {
        subChapters.push({
          title: subTitle,
          id: generateId(subTitle),
        });
      });
    }

    structure.push({
      title: chapterTitle,
      content: chapterContent,
      items: subChapters,
    });
  });

  return structure;
};

// --- Documentation Generation ---
// fs.writeFileSync(outputFilePath, await generateDocumentation());
// console.log("Documentation generated successfully at", outputFilePath);

// --- Documentation Parsing ---
// const documentationStructure = parseMarkdown(content);
// console.log("🚀 ~ documentationStructure:", documentationStructure);

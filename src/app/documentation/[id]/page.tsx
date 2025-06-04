"use client";

import {
  Cable,
  Cpu,
  DatabaseZap,
  FolderCode,
  Hash,
  Key,
  MonitorCog,
  Workflow,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

import { ScrollArea } from "~/components/ui/scroll-area";

import MDEditor from "@uiw/react-md-editor";
import { docData } from "~/lib/structured-docs";
import { cn } from "~/lib/utils";
import { DocHeader } from "../_components/doc-header";
import SearchQuery from "../_components/search-query";

const documentationStructure = docData;

export default function DocumentationPage() {
  const [searchOpen, setSearchOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("Project Overview");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Remove number points like "1.", "1.1", "2.3.4", etc.
  const formatTitle = (title: string) => {
    return title.replace(/^\s*\d+(\.\d+)*\.?\s*/g, "").trim();
  };

  const iconMap = [
    { title: "Project Overview", icon: <Zap /> },
    { title: "System Architecture", icon: <DatabaseZap /> },
    { title: "Development Environment Setup", icon: <MonitorCog /> },
    { title: "Codebase Walkthrough", icon: <FolderCode /> },
    { title: "Key Technical Concepts", icon: <Key /> },
    { title: "Workflow Guide", icon: <Workflow /> },
    { title: "Technical Design Decisions", icon: <Cpu /> },
    { title: "Troubleshooting Guide", icon: <Cable /> },
  ];

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    const offset = 100; // Header height
    if (element) {
      const yOffset = -offset;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  const getActiveSectionDoc = (title: string) => {
    return docData.find((section) => section.title === title);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <DocHeader setSearchOpen={setSearchOpen} />

      <div className="container mx-auto flex">
        {/* Left Sidebar - Navigation */}
        <aside className="sticky top-[86px] h-[calc(100vh-90px)] w-72 backdrop-blur-sm">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {documentationStructure.map((section, index) => (
                <Button
                  variant="ghost"
                  className={cn(
                    "hover:bg-primary-50 hover:text-primary-500 w-full items-center justify-start gap-2 font-medium text-gray-400",
                    {
                      "from-primary-400 to-primary-600 hover:from-primary-400 hover:to-primary-500 bg-gradient-to-r text-white hover:text-white":
                        activeSection === section.title,
                    },
                  )}
                  onClick={() => setActiveSection(section.title)}
                >
                  {iconMap[index] ? iconMap[index].icon : <Hash />}
                  <span className="flex-1 text-left font-medium">
                    {formatTitle(section.title)}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-8">
            <article className="prose prose-primary max-w-none">
              <div className="prose-content max-w-4xl overflow-auto leading-relaxed text-gray-700">
                <div>
                  <MDEditor.Markdown
                    className="!bg-transparent !text-white/75"
                    source={getActiveSectionDoc(activeSection)?.content || ""}
                  />
                </div>
              </div>
            </article>
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="sticky top-[86px] h-[calc(100vh-90px)] w-72 backdrop-blur-sm">
          <div className="p-4">
            <h3 className="text-primary-400 mb-4 flex items-center gap-2 font-semibold">
              <Hash className="text-primary-400 h-4 w-4" />
              On this page
            </h3>
            <div className="space-y-2">
              {getActiveSectionDoc(activeSection)?.items?.map((item, index) => (
                <button
                  key={index}
                  id={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/10 block w-full cursor-pointer rounded-[4px] border-l-2 border-transparent py-1 pl-3 text-left text-sm text-gray-400/80 transition-colors"
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="border-primary-100 from-primary-50 mt-8 rounded-lg border bg-gradient-to-r to-indigo-50 p-4">
              <h4 className="mb-2 font-medium text-gray-900">Need Help?</h4>
              <p className="mb-3 text-sm text-gray-600">
                Can't find what you're looking for? Try our AI assistant.
              </p>
              <Button
                size="sm"
                className="from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 w-full cursor-pointer bg-gradient-to-r"
              >
                Ask AI Assistant
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Search Dialog */}
      <SearchQuery searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
    </div>
  );
}

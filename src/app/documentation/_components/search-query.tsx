import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FileText, Search } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useState } from "react";

const searchableContent = [
  {
    title: "Introduction",
    content: "CodeAI intelligent code analysis",
    href: "#introduction",
  },
  {
    title: "Quick Start",
    content: "Get started repository indexing",
    href: "#quick-start",
  },
  {
    title: "Commit Analysis",
    content: "AI commit summaries natural language",
    href: "#commit-analysis",
  },
  {
    title: "Code Reviews",
    content: "Automated pull request analysis",
    href: "#code-reviews",
  },
  {
    title: "GitHub Integration",
    content: "Connect GitHub repositories",
    href: "#github-integration",
  },
  {
    title: "API Reference",
    content: "REST API endpoints documentation",
    href: "#api-reference",
  },
];

interface SearchQueryProps {
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchQuery = ({
  searchOpen,
  setSearchOpen,
}: SearchQueryProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search Documentation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search for topics, features, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base"
            autoFocus
          />

          {searchQuery && (
            <ScrollArea className="max-h-96">
              <div className="space-y-2">
                {searchableContent.length > 0 ? (
                  searchableContent.map((result, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-lg border border-blue-100 p-3 transition-colors hover:bg-blue-50"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="mb-1 font-medium text-gray-900">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {!searchQuery && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Popular searches</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Quick Start",
                  "API Reference",
                  "GitHub Integration",
                  "Code Reviews",
                ].map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SearchQuery;

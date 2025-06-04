import { useState } from "react";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  fileReferences: {
    fileName: string;
    summary: string;
    sourceCode: string;
    similarity: number;
  }[];
}

const CodeReferences = ({ fileReferences }: Props) => {
  const [tab, setTab] = useState(fileReferences[0]?.fileName);

  if (fileReferences.length === 0) return null;

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <div className="bg-card flex gap-2 overflow-auto rounded-md p-1">
          {fileReferences.map((file) => (
            <button
              key={file.fileName}
              className={cn(
                "text-mutated-foreground cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                {
                  "bg-primary text-primary-foreground": tab === file.fileName,
                },
              )}
              onClick={() => setTab(file.fileName)}
            >
              {file.fileName}
            </button>
          ))}
        </div>

        {fileReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[40vh] max-w-7xl overflow-auto rounded-md"
          >
            <SyntaxHighlighter language="typescript" style={nord}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default CodeReferences;

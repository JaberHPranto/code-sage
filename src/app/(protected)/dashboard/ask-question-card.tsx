"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import useProjects from "~/hooks/use-projects";
import { askQuestion } from "./action";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";

const AskQuestionCard = () => {
  const [question, setQuestion] = useState(
    "What are the filters used in this project?",
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileReferences, setFileReferences] = useState<
    {
      fileName: string;
      summary: string;
      sourceCode: string;
      similarity: number;
    }[]
  >([]);
  const [answer, setAnswer] = useState("");

  const { selectedProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnswer("");
    setFileReferences([]);

    if (!selectedProject?.id) return;

    setLoading(true);

    const { output, fileReferences } = await askQuestion(
      question,
      selectedProject.id,
    );
    setOpen(true);
    setFileReferences(fileReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) setAnswer((prev) => prev + delta);
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogContent className="sm:max-w-7xl">
            <DialogTitle>
              <Image src="/logo.png" alt="logo" width={42} height={40} />
            </DialogTitle>

            <div data-color-mode="light">
              <MDEditor.Markdown
                source={answer}
                className="!h-full max-h-[40vh] max-w-7xl overflow-scroll"
              />
            </div>
            <div className="h-4" />
            <CodeReferences fileReferences={fileReferences} />

            <Button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
            >
              Close
            </Button>
          </DialogContent>
        </DialogHeader>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Which files are responsible for user authentication?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4" />
            <Button type="submit" className="ml-auto block" disabled={loading}>
              Ask the sage
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
export default AskQuestionCard;

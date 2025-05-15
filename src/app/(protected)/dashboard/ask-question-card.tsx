"use client";
import MDEditor from "@uiw/react-md-editor";
import { readStreamableValue } from "ai/rsc";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
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
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";
import { askQuestion } from "./action";
import CodeReferences from "./code-references";

const AskQuestionCard = () => {
  const [question, setQuestion] = useState("");
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

  const refetch = useRefetch();

  const saveAnswer = api.project.saveAnswer.useMutation();

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

  const handleSaveAnswer = async () => {
    if (!selectedProject?.id) return;

    await saveAnswer.mutateAsync(
      {
        projectId: selectedProject.id,
        question,
        answer,
        fileReferences,
      },
      {
        onSuccess: () => {
          toast.success("Answer saved successfully");
          refetch();
          setOpen(false);
        },
        onError: (err) => {
          console.log(err);
          toast.error("Failed to save answer");
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="logo" width={42} height={40} />
                <Button
                  onClick={() => handleSaveAnswer()}
                  variant={"outline"}
                  className="rounded-3xl !px-4"
                  disabled={saveAnswer.isPending}
                >
                  <Bookmark className="size-3.5" />
                  Save Answer
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[90vh]">
            <div data-color-mode="light">
              <MDEditor.Markdown
                source={answer}
                className="!h-full max-h-[40vh] max-w-7xl overflow-scroll"
              />
            </div>
            <div className="h-4" />
            <CodeReferences fileReferences={fileReferences} />
          </div>
        </DialogContent>
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

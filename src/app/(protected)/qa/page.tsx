"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import useProjects from "~/hooks/use-projects";
import { api } from "~/trpc/react";
import AskQuestionCard from "../dashboard/ask-question-card";
import { Fragment, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";

const QAPage = () => {
  const { selectedProjectId } = useProjects();
  const { data: questions } = api.project.getQuestions.useQuery(
    {
      projectId: selectedProjectId,
    },
    {
      enabled: !!selectedProjectId,
    },
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const selectedQuestion = questions?.[questionIndex];

  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4" />
      <h1 className="text-xl font-semibold">Saved Question</h1>
      <div className="h-2" />
      <div className="flex flex-col gap-2">
        {questions?.map((question) => (
          <Fragment key={question.id}>
            <SheetTrigger
              onClick={() => setQuestionIndex(questions.indexOf(question))}
            >
              <div className="bg-card/80 text-card-foreground flex items-center gap-4 rounded-lg border p-4 shadow">
                <img
                  className="rounded-full"
                  height={32}
                  width={32}
                  src={question.user.imageUrl ?? ""}
                />

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-1 text-lg font-medium text-gray-300">
                      {question.question}
                    </p>
                    <span className="text-xs whitespace-nowrap text-gray-400">
                      {question.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-gray-400">
                    {question.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </Fragment>
        ))}
      </div>

      {selectedQuestion && (
        <SheetContent className="bg-background overflow-auto p-4 sm:max-w-[60vw]">
          <SheetHeader>
            <SheetTitle>{selectedQuestion.question}</SheetTitle>
          </SheetHeader>
          <div data-color-mode="dark">
            <MDEditor.Markdown
              source={selectedQuestion.answer}
              className="!bg-transparent"
            />
          </div>
          <CodeReferences
            fileReferences={(selectedQuestion.fileReferences ?? []) as any}
          />
        </SheetContent>
      )}
    </Sheet>
  );
};
export default QAPage;

"use client";

import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import useProjects from "~/hooks/use-projects";
import CommitLog from "./commit-log";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import useRefetch from "~/hooks/use-refetch";
import { indexGithubRepo } from "~/lib/github-loader";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Progress } from "~/components/ui/progress";

const DashboardPage = () => {
  const [startIndexing, setStartIndexing] = useState(false);

  const { selectedProject, selectedProjectId } = useProjects();
  const indexProjectRepo = api.project.indexProjectRepo.useMutation();

  const { data: indexingProgress } =
    api.project.pollProjectIndexingProgress.useQuery(
      {
        projectId: selectedProjectId,
      },
      {
        enabled: !!selectedProjectId && startIndexing,
        refetchInterval: 4000,
      },
    );

  const { data: isIndexingFinished } =
    api.project.getProjectIndexingStatus.useQuery(
      {
        projectId: selectedProjectId,
      },
      {
        enabled: !!selectedProjectId,
      },
    );

  const refetch = useRefetch();

  const handleRepoIndexing = async () => {
    // console.log("selectedProjectId", selectedProjectId);
    if (!selectedProject) return;

    try {
      setStartIndexing(true);
      await indexProjectRepo.mutateAsync(
        {
          projectId: selectedProjectId,
          repoUrl: selectedProject.repoUrl,
        },
        {
          onSuccess(data, variables, context) {
            setStartIndexing(false);
            toast.success("Repo indexing started successfully");
            refetch();
          },
        },
      );
    } catch (error) {}
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* Github Link */}
        <div className="bg-primary flex w-fit rounded-md px-4 py-3">
          <div className="flex items-center">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                {" "}
                This project is linked to{" "}
                <Link
                  href={selectedProject?.repoUrl ?? "#"}
                  target="_blank"
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {selectedProject?.repoUrl}{" "}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="flex items-center gap-4">
          Team Members InviteButton ArchiveButton
        </div>
      </div>
      {isIndexingFinished && (
        <div className="my-8">
          <p className="text-muted-foreground text-center text-sm">
            The project{" "}
            <span className="text-primary font-semibold">
              {selectedProject?.name}
            </span>{" "}
            has been indexed successfully.
          </p>
        </div>
      )}
      {!isIndexingFinished && (
        <div className="">
          <Button
            className="from-primary mx-auto my-10 block bg-gradient-to-br to-blue-300 text-white"
            onClick={() => handleRepoIndexing()}
            variant={"outline"}
            disabled={startIndexing}
          >
            {startIndexing ? "Indexing..." : "Index Github Repo"}
          </Button>
        </div>
      )}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          {/* AskQuestion MeetingCard */}
        </div>
      </div>
      {/* && */}
      {startIndexing && !indexingProgress?.isFinished && (
        <div>
          <Progress
            value={
              ((indexingProgress?.currentStep ?? 0) /
                (indexingProgress?.totalSteps ?? 0)) *
              100
            }
            className="w-full [&>div]:rounded-l-full [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:via-sky-500 [&>div]:to-indigo-500"
          />

          <p className="text-muted-foreground mt-2 text-center text-sm">
            Indexing Progress: {indexingProgress?.currentStep ?? 0} /{" "}
            {indexingProgress?.totalSteps ?? 0}
          </p>
        </div>
      )}
      <div className="mt-8">
        <CommitLog />
      </div>
    </div>
  );
};
export default DashboardPage;

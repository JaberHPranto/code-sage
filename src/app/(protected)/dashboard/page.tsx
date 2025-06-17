"use client";

import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import useProjects from "~/hooks/use-projects";
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";
import { Analytics } from "./analytics";
import { CommitLog } from "./commit-log";
import { Card, CardContent } from "~/components/ui/card";
import { extractGitHubPath } from "~/utils/helper";

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
    if (!selectedProject) return;

    try {
      setStartIndexing(true);
      await indexProjectRepo.mutateAsync(
        {
          projectId: selectedProjectId,
          repoUrl: selectedProject.repoUrl,
        },
        {
          onSuccess() {
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
      <div className="flex flex-wrap items-center justify-between gap-y-4 px-4">
        <Card className="my-2 w-full border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm">
          <CardContent className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-orange-500/20 p-3">
                  <Github className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Repository Connected
                  </h3>
                  <p className="text-sm text-slate-300">
                    This project is linked to{" "}
                    <span className="ml-1 font-medium text-orange-400">
                      {selectedProject?.repoUrl
                        ? extractGitHubPath(selectedProject.repoUrl)
                        : ""}
                    </span>
                  </p>
                </div>
              </div>
              <Link
                href={selectedProject ? selectedProject.repoUrl : "#"}
                className="flex items-center gap-1 rounded-sm border-orange-500/30 bg-orange-500/10 px-3 py-2 text-sm text-orange-400 hover:bg-orange-500/20"
                target="_blank"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Repo
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        {/* <div className="flex items-center gap-4">
          Team Members InviteButton ArchiveButton
        </div> */}
      </div>

      <Analytics />
      {/* 
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
      )} */}
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
      <div>
        <CommitLog />
      </div>
    </div>
  );
};
export default DashboardPage;

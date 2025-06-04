"use client";

import { Bug, ExternalLink, FileText, Github, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import useProjects from "~/hooks/use-projects";
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";
import CommitLog from "./commit-log";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
      {/* Stats */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group gap-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:bg-black/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Lines
            </CardTitle>
            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-2 transition-transform duration-300 group-hover:scale-110">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
              45,672
            </div>
            <p className="mt-1 text-xs text-gray-400">Across all files</p>
          </CardContent>
        </Card>

        <Card className="group gap-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:bg-black/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">
              Contributors
            </CardTitle>
            <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-2 transition-transform duration-300 group-hover:scale-110">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
              12
            </div>
            <p className="mt-1 text-xs text-gray-400">Active developers</p>
          </CardContent>
        </Card>

        <Card className="group gap-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:bg-black/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">
              Open Issues
            </CardTitle>
            <div className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-2 transition-transform duration-300 group-hover:scale-110">
              <Bug className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
              23
            </div>
            <p className="mt-1 text-xs text-gray-400">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="group gap-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:bg-black/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">
              Performance
            </CardTitle>
            <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-2 transition-transform duration-300 group-hover:scale-110">
              <Zap className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
              Fast
            </div>
            <p className="mt-1 text-xs text-gray-400">Analysis speed</p>
          </CardContent>
        </Card>
      </div>

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

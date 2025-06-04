import { Calendar, ExternalLink, Hash, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import useProjects from "~/hooks/use-projects";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { formatTimeAgo } from "~/utils/helper";

const CommitLog = () => {
  const { selectedProjectId, selectedProject } = useProjects();
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: selectedProjectId,
  });

  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, commitIndex) => (
          <li key={commit.id} className="relative flex gap-x-4">
            <div
              className={cn(
                "absolute top-0 left-0 flex w-6 justify-center",
                commitIndex === commits.length - 1 ? "h-6" : "-bottom-6",
              )}
            >
              <div className="w-[1px] translate-x-1 bg-gray-700"></div>
            </div>

            <>
              <img
                src={
                  Boolean(commit.commitAuthorAvatar)
                    ? (commit.commitAuthorAvatar as string)
                    : "https://api.dicebear.com/7.x/lorelei/svg"
                }
                alt="Author"
                className="relative size-9 flex-none rounded-full bg-gray-50"
              />
              <div className="bg-card ring-border flex-auto rounded-md p-3 ring-1 ring-inset">
                <div className="mb-4 flex flex-col gap-3 border-b pb-4">
                  {/* Commit info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-1.5">
                          <Hash className="h-4 w-4 text-orange-400" />
                        </div>
                        <Badge className="border-orange-500/30 bg-slate-800/80 px-3 py-1 font-mono text-xs text-orange-300 transition-colors hover:bg-orange-500/10">
                          {commit.commitHash.slice(0, 7)}
                        </Badge>
                      </div>
                    </div>

                    <Link
                      href={`${selectedProject?.repoUrl}/commit/${commit.commitHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-1.5 text-slate-300 transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-300"
                    >
                      <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover/link:rotate-12" />
                      <span className="text-sm font-medium">GitHub</span>
                    </Link>
                  </div>

                  {/* Author and date info */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-1.5">
                        <User className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-200">
                        {commit.commitAuthorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5">
                        <Calendar className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-400">
                        {/* {formatDate(commit.date)} */}
                        {commit.commitDate
                          ? formatTimeAgo(
                              new Date(commit.commitDate).toString(),
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-card-foreground text-lg font-semibold">
                  {commit.commitMessage}
                </span>
                <pre className="text-secondary-foreground/80 mt-2 text-sm leading-6 whitespace-pre-wrap">
                  {commit.summary}
                </pre>
              </div>
            </>
          </li>
        ))}
      </ul>
    </>
  );
};
export default CommitLog;

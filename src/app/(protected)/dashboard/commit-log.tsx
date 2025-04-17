import { ExternalLink } from "lucide-react";
import Link from "next/link";
import useProjects from "~/hooks/use-projects";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

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
              <div className="w-px translate-x-1 bg-gray-200"></div>
            </div>

            <>
              <img
                src={
                  Boolean(commit.commitAuthorAvatar)
                    ? commit.commitAuthorAvatar
                    : "https://github.com/vercel.png"
                }
                alt="Author"
                className="relative mt-2 size-8 flex-none rounded-full bg-gray-50"
              />
              <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200 ring-inset">
                <div className="flex justify-between gap-x-4">
                  <Link
                    target="_blank"
                    href={`${selectedProject?.repoUrl}/commit/${commit.commitHash}`}
                    className="py-0.5 text-xs leading-5 text-gray-500"
                  >
                    <span className="mr-1 font-medium text-gray-900">
                      {commit.commitAuthorName}
                    </span>
                    <span className="inline-flex items-center">
                      committed <ExternalLink className="ml-1 size-4" />
                    </span>
                  </Link>
                </div>
                <span className="font-semibold">{commit.commitMessage}</span>
                <pre className="mt-2 text-sm leading-6 whitespace-pre-wrap text-gray-500">
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

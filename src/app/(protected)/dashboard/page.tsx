"use client";

import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import useProjects from "~/hooks/use-projects";

const DashboardPage = () => {
  const { selectedProject } = useProjects();

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

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          AskQuestion MeetingCard
        </div>
      </div>

      <div className="mt-8">CommitLog</div>
    </div>
  );
};
export default DashboardPage;

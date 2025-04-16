import { useState } from "react";
import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";

export default function useProjects() {
  const { data: projects } = api.project.getProjects.useQuery();
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "code-sage-projectId",
    "",
  );
  const selectedProject = projects?.find(
    (project) => project.id === selectedProjectId,
  );

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
  };
}

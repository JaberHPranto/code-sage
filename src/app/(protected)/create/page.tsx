"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";

interface FormInput {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
}

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();

  const refetch = useRefetch();

  const onSubmit = (data: FormInput) => {
    createProject.mutate(
      {
        name: data.projectName,
        repoUrl: data.repoUrl,
        githubToken: data.githubToken,
      },
      {
        onSuccess: async (project) => {
          toast.success("Project created successfully");

          reset();
          refetch();
        },
        onError: (error) => {
          console.log("Error creating project", error);
          toast.error("Failed to create project");
        },
      },
    );
  };

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/github-activity.svg"
        alt="working person"
        className="h-56 w-auto"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">Link your repository</h1>
          <p className="text-muted-foreground text-sm">
            Enter the url of your repository to link it with Code Sage
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2">
          <Input
            {...register("projectName", { required: true })}
            placeholder="Project Name"
            required
          />
          <Input
            {...register("repoUrl", { required: true })}
            placeholder="Repository URL"
            required
          />
          <Input
            {...register("githubToken")}
            placeholder="Github Token (Optional)"
          />

          <Button className="mt-2 w-fit" disabled={createProject.isPending}>
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
};
export default CreatePage;

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "~/lib/github";
import { indexGithubRepo } from "~/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        repoUrl: z.string().min(1),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = ctx.db.project.create({
        data: {
          name: input.name,
          repoUrl: input.repoUrl,
          userToProjects: {
            create: {
              userId: ctx.user.userId,
            },
          },
        },
      });

      await pollCommits((await project).id);

      return project;
    }),
  indexProjectRepo: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        repoUrl: z.string().min(1),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await indexGithubRepo(input.projectId, input.repoUrl, input.githubToken);

      return true;
    }),
  pollProjectIndexingProgress: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const progress = ctx.db.indexingProgress.findUnique({
        where: {
          projectId: input.projectId,
        },
      });

      return progress;
    }),
  getProjectIndexingStatus: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const progress = ctx.db.indexingProgress.findUnique({
        where: {
          projectId: input.projectId,
        },
      });

      return (await progress)?.isFinished ?? false;
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId,
          },
        },
        deletedAt: null,
      },
    });

    return projects;
  }),
  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      pollCommits(input.projectId).then().catch();
      const commits = ctx.db.commit.findMany({
        where: {
          projectId: input.projectId,
        },
      });

      return commits;
    }),
  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        question: z.string().min(1),
        answer: z.string().min(1),
        fileReferences: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = ctx.db.question.create({
        data: {
          projectId: input.projectId,
          userId: ctx.user.userId,
          question: input.question,
          answer: input.answer,
          fileReferences: input.fileReferences,
        },
      });

      return question;
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "~/lib/github";

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
});

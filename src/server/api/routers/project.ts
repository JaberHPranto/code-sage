import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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

      return project;
    }),
});

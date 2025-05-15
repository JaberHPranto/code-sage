import { db } from "~/server/db";

async function clearDatabase() {
  console.log("Clearing all database tables...");

  // Delete in reverse order of dependencies to avoid foreign key constraint errors
  await db.question.deleteMany({});
  await db.sourceCodeEmbedding.deleteMany({});
  await db.indexingProgress.deleteMany({});
  await db.commit.deleteMany({});
  await db.userToProject.deleteMany({});
  await db.project.deleteMany({});
  // await db.user.deleteMany({});

  console.log("All database tables cleared successfully");
}

clearDatabase()
  .catch((e) => {
    console.error("Error clearing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

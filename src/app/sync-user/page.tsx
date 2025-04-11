import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "~/server/db";

const SyncUserPage = async () => {
  // getting user id from clerk
  const { userId } = await auth();

  if (!userId) throw new Error("User not found");

  // getting user details
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user.emailAddresses[0]?.emailAddress) return notFound();

  // updating db with new user
  await db.user.upsert({
    where: {
      emailAddress: user.emailAddresses[0]?.emailAddress,
    },
    update: {
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      emailAddress: user.emailAddresses[0]?.emailAddress,
    },
    create: {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      emailAddress: user.emailAddresses[0]?.emailAddress,
    },
  });

  return redirect("/dashboard");
};
export default SyncUserPage;

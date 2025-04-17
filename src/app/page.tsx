import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth();

  if (user.userId) return redirect("/dashboard");

  return (
    <div className="flex items-center justify-center gap-2 py-20">
      <p>Welcome to Code Sage. </p>
      <Link href="/sign-in" className="text-primary/80">
        Please sign in to continue.
      </Link>
    </div>
  );
}
